#!/bin/bash

# TeleHealth Platform Deployment Script
# This script automates the deployment of the TeleHealth platform to AWS

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="telehealth"
AWS_REGION="us-east-1"
ENVIRONMENT="production"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if AWS CLI is installed
    if ! command -v aws &> /dev/null; then
        log_error "AWS CLI is not installed. Please install it first."
        exit 1
    fi
    
    # Check if Terraform is installed
    if ! command -v terraform &> /dev/null; then
        log_error "Terraform is not installed. Please install it first."
        exit 1
    fi
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install it first."
        exit 1
    fi
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install it first."
        exit 1
    fi
    
    # Check AWS credentials
    if ! aws sts get-caller-identity &> /dev/null; then
        log_error "AWS credentials not configured. Please run 'aws configure' first."
        exit 1
    fi
    
    log_success "All prerequisites met!"
}

deploy_infrastructure() {
    log_info "Deploying infrastructure with Terraform..."
    
    cd infrastructure/terraform
    
    # Initialize Terraform
    terraform init
    
    # Plan deployment
    terraform plan -var="environment=$ENVIRONMENT" -var="aws_region=$AWS_REGION" -out=tfplan
    
    # Apply deployment
    terraform apply tfplan
    
    # Get outputs
    ECR_REPOSITORY_URL=$(terraform output -raw ecr_repository_url)
    LOAD_BALANCER_DNS=$(terraform output -raw load_balancer_dns)
    S3_FILES_BUCKET=$(terraform output -raw s3_files_bucket)
    S3_FRONTEND_BUCKET=$(terraform output -raw s3_frontend_bucket)
    CLOUDFRONT_DOMAIN=$(terraform output -raw cloudfront_domain)
    
    cd ../..
    
    log_success "Infrastructure deployed successfully!"
    log_info "Load Balancer DNS: $LOAD_BALANCER_DNS"
    log_info "CloudFront Domain: $CLOUDFRONT_DOMAIN"
}

build_and_push_backend() {
    log_info "Building and pushing backend Docker image..."
    
    # Login to ECR
    aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REPOSITORY_URL
    
    # Build Docker image
    cd backend/telehealth-api
    docker build -f ../../infrastructure/docker/Dockerfile.backend -t $ECR_REPOSITORY_URL:latest .
    
    # Push to ECR
    docker push $ECR_REPOSITORY_URL:latest
    
    cd ../..
    
    log_success "Backend image built and pushed successfully!"
}

deploy_backend() {
    log_info "Deploying backend to ECS..."
    
    # Update ECS service to use new image
    aws ecs update-service \
        --cluster $PROJECT_NAME-cluster \
        --service $PROJECT_NAME-backend \
        --force-new-deployment \
        --region $AWS_REGION
    
    # Wait for deployment to complete
    aws ecs wait services-stable \
        --cluster $PROJECT_NAME-cluster \
        --services $PROJECT_NAME-backend \
        --region $AWS_REGION
    
    log_success "Backend deployed successfully!"
}

build_and_deploy_frontend() {
    log_info "Building and deploying frontend applications..."
    
    # Deploy each frontend app
    for app in "doctor-portal" "patient-app" "admin-dashboard"; do
        log_info "Deploying $app..."
        
        cd frontend/$app
        
        # Install dependencies
        npm ci
        
        # Build application
        VITE_API_BASE_URL="https://$LOAD_BALANCER_DNS" npm run build
        
        # Deploy to S3
        aws s3 sync dist/ s3://$S3_FRONTEND_BUCKET-$app --delete
        
        cd ../..
        
        log_success "$app deployed successfully!"
    done
}

run_health_checks() {
    log_info "Running health checks..."
    
    # Check backend health
    BACKEND_URL="https://$LOAD_BALANCER_DNS/health"
    if curl -f $BACKEND_URL &> /dev/null; then
        log_success "Backend health check passed!"
    else
        log_warning "Backend health check failed. Please check the logs."
    fi
    
    # Check frontend availability
    FRONTEND_URL="https://$CLOUDFRONT_DOMAIN"
    if curl -f $FRONTEND_URL &> /dev/null; then
        log_success "Frontend health check passed!"
    else
        log_warning "Frontend health check failed. Please check the deployment."
    fi
}

cleanup() {
    log_info "Cleaning up temporary files..."
    rm -f infrastructure/terraform/tfplan
    log_success "Cleanup completed!"
}

main() {
    log_info "Starting TeleHealth Platform deployment..."
    
    check_prerequisites
    deploy_infrastructure
    build_and_push_backend
    deploy_backend
    build_and_deploy_frontend
    run_health_checks
    cleanup
    
    log_success "Deployment completed successfully!"
    log_info "Backend API: https://$LOAD_BALANCER_DNS"
    log_info "Frontend Apps: https://$CLOUDFRONT_DOMAIN"
    log_info "CloudWatch Dashboard: https://$AWS_REGION.console.aws.amazon.com/cloudwatch/home?region=$AWS_REGION#dashboards:name=$PROJECT_NAME-dashboard"
}

# Handle script arguments
case "${1:-}" in
    "infrastructure")
        check_prerequisites
        deploy_infrastructure
        ;;
    "backend")
        check_prerequisites
        build_and_push_backend
        deploy_backend
        ;;
    "frontend")
        check_prerequisites
        build_and_deploy_frontend
        ;;
    "health")
        run_health_checks
        ;;
    "cleanup")
        cleanup
        ;;
    *)
        main
        ;;
esac

