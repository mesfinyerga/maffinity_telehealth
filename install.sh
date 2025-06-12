#!/bin/bash

# TeleHealth Platform Installation Script

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        log_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    # Check PostgreSQL
    if ! command -v psql &> /dev/null; then
        log_warning "PostgreSQL is not installed. You'll need to install it separately."
    fi
    
    log_success "Prerequisites check completed!"
}

install_backend() {
    log_info "Installing backend dependencies..."
    
    cd backend/telehealth-api
    
    if [ ! -f ".env" ]; then
        cp .env.example .env
        log_warning "Created .env file from template. Please configure your environment variables."
    fi
    
    npm install
    
    log_success "Backend dependencies installed!"
    cd ../..
}

install_frontend() {
    log_info "Installing frontend dependencies..."
    
    # Doctor Portal
    log_info "Installing Doctor Portal dependencies..."
    cd frontend/doctor-portal
    npm install
    cd ../..
    
    # Patient App
    log_info "Installing Patient App dependencies..."
    cd frontend/patient-app
    npm install
    cd ../..
    
    # Admin Dashboard
    log_info "Installing Admin Dashboard dependencies..."
    cd frontend/admin-dashboard
    npm install
    cd ../..
    
    log_success "All frontend dependencies installed!"
}

create_database() {
    log_info "Setting up database..."
    
    if command -v psql &> /dev/null; then
        # Check if database exists
        if psql -lqt | cut -d \| -f 1 | grep -qw telehealth_db; then
            log_warning "Database 'telehealth_db' already exists."
        else
            createdb telehealth_db
            log_success "Database 'telehealth_db' created!"
        fi
    else
        log_warning "PostgreSQL not found. Please create database 'telehealth_db' manually."
    fi
}

setup_development() {
    log_info "Setting up development environment..."
    
    # Create uploads directory
    mkdir -p backend/telehealth-api/uploads/medical-images
    
    log_success "Development environment setup completed!"
}

main() {
    echo "🏥 TeleHealth Platform Installation"
    echo "=================================="
    echo
    
    check_prerequisites
    install_backend
    install_frontend
    create_database
    setup_development
    
    echo
    log_success "Installation completed successfully!"
    echo
    echo "Next steps:"
    echo "1. Configure your .env files with appropriate values"
    echo "2. Start the backend: cd backend/telehealth-api && npm run start:dev"
    echo "3. Start the frontend apps:"
    echo "   - Doctor Portal: cd frontend/doctor-portal && npm run dev"
    echo "   - Patient App: cd frontend/patient-app && npm run dev"
    echo "   - Admin Dashboard: cd frontend/admin-dashboard && npm run dev"
    echo
    echo "🚀 Happy coding!"
}

main "$@"
