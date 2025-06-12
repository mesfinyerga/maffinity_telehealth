#!/bin/bash

# TeleHealth Platform - Package Creation Script
# This script creates a downloadable package without node_modules

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="telehealth-platform"
PACKAGE_NAME="telehealth-platform-complete"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
PACKAGE_DIR="/tmp/${PACKAGE_NAME}_${TIMESTAMP}"
ARCHIVE_NAME="${PACKAGE_NAME}_${TIMESTAMP}.tar.gz"

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

create_package_structure() {
    log_info "Creating package structure..."
    
    mkdir -p "$PACKAGE_DIR"
    cd /home/ubuntu/telehealth-platform
    
    # Copy all files except node_modules and build artifacts
    rsync -av \
        --exclude='node_modules' \
        --exclude='dist' \
        --exclude='build' \
        --exclude='.next' \
        --exclude='coverage' \
        --exclude='.nyc_output' \
        --exclude='*.log' \
        --exclude='.env' \
        --exclude='uploads' \
        --exclude='.git' \
        --exclude='*.tar.gz' \
        . "$PACKAGE_DIR/"
    
    log_success "Package structure created!"
}

create_readme() {
    log_info "Creating comprehensive README..."
    
    cat > "$PACKAGE_DIR/README.md" << 'EOF'
# TeleHealth Platform - Complete Package

## 🏥 AI-Enhanced Telehealth & Diagnostics Platform for Ethiopia

This package contains the complete TeleHealth Platform - a comprehensive, enterprise-grade healthcare solution designed specifically for the Ethiopian market with global scalability.

### 📋 Package Contents

```
telehealth-platform/
├── backend/                    # NestJS Backend API
│   └── telehealth-api/        # Main API application
├── frontend/                   # React Frontend Applications
│   ├── doctor-portal/         # Doctor Web Portal
│   ├── patient-app/           # Patient Mobile App
│   └── admin-dashboard/       # Admin Dashboard
├── infrastructure/             # Cloud Infrastructure
│   ├── terraform/             # Infrastructure as Code
│   ├── docker/                # Container Configurations
│   ├── scripts/               # Deployment Scripts
│   └── monitoring/            # Monitoring Configurations
├── tests/                     # Comprehensive Test Suite
│   ├── backend/               # Backend Tests
│   ├── frontend/              # Frontend Tests
│   └── e2e/                   # End-to-End Tests
├── docs/                      # Complete Documentation
│   ├── telehealth_architecture.md
│   ├── comprehensive-documentation.md
│   ├── user-manual.md
│   ├── integration-connectivity.md
│   └── final-integration-delivery.md
└── .github/                   # CI/CD Workflows
    └── workflows/
```

### 🚀 Quick Start Guide

#### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 15+
- Docker and Docker Compose
- AWS CLI (for cloud deployment)
- Terraform (for infrastructure)

#### 1. Backend Setup

```bash
cd backend/telehealth-api
npm install
cp .env.example .env
# Configure your environment variables
npm run start:dev
```

#### 2. Frontend Applications

**Doctor Portal:**
```bash
cd frontend/doctor-portal
npm install
npm run dev
# Access at http://localhost:5173
```

**Patient App:**
```bash
cd frontend/patient-app
npm install
npm run dev
# Access at http://localhost:5174
```

**Admin Dashboard:**
```bash
cd frontend/admin-dashboard
npm install
npm run dev
# Access at http://localhost:5175
```

#### 3. Database Setup

```bash
# Create PostgreSQL database
createdb telehealth_db

# Run migrations (when implemented)
cd backend/telehealth-api
npm run migration:run
```

### 🏗️ Architecture Overview

#### Backend (NestJS + TypeScript)
- **Authentication & Authorization**: JWT-based with RBAC
- **AI Services**: OpenAI GPT-4 integration for triage and image analysis
- **Real-time Communication**: WebSocket-based consultations
- **File Management**: Secure upload with AWS S3 integration
- **Database**: PostgreSQL with TypeORM
- **API Documentation**: Swagger/OpenAPI

#### Frontend Applications
- **Doctor Portal**: Professional dashboard with patient management
- **Patient App**: Mobile-first with AI triage and multilingual support
- **Admin Dashboard**: System management and analytics

#### Key Features
- 🤖 **AI-Powered Triage**: Multilingual symptom analysis (English/Amharic)
- 🖼️ **Medical Image Analysis**: AI-powered diagnostic assistance
- 💬 **Real-time Consultations**: Secure video and text communication
- 🌍 **Multilingual Support**: English and Amharic throughout
- 🔒 **HIPAA-Compliant**: Enterprise-grade security and audit logging
- 📱 **Mobile-First Design**: Responsive across all devices
- ☁️ **Cloud-Native**: AWS deployment with auto-scaling

### 🔧 Configuration

#### Environment Variables

**Backend (.env):**
```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=telehealth_db
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRES_IN=7d
OPENAI_API_KEY=your_openai_key
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=us-east-1
S3_BUCKET_NAME=telehealth-files
```

**Frontend (.env):**
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```

### 🧪 Testing

#### Run All Tests
```bash
# Backend tests
cd backend/telehealth-api
npm run test
npm run test:e2e

# Frontend tests
cd frontend/doctor-portal
npm run test

cd frontend/patient-app
npm run test

# End-to-end tests
cd tests/e2e
npm install
npm run test
```

### 🚀 Deployment

#### Local Development
```bash
# Start all services with Docker Compose
docker-compose up -d

# Or use the deployment script
chmod +x infrastructure/scripts/deploy.sh
./infrastructure/scripts/deploy.sh
```

#### Cloud Deployment (AWS)
```bash
# Configure AWS credentials
aws configure

# Deploy infrastructure
cd infrastructure/terraform
terraform init
terraform plan
terraform apply

# Deploy applications
cd ../../
./infrastructure/scripts/deploy.sh
```

### 📚 Documentation

- **[Architecture Guide](docs/telehealth_architecture.md)**: Complete system architecture
- **[User Manual](docs/user-manual.md)**: User guides for all applications
- **[API Documentation](docs/comprehensive-documentation.md)**: Complete API reference
- **[Deployment Guide](docs/comprehensive-documentation.md#deployment-guide)**: Production deployment
- **[Integration Guide](docs/integration-connectivity.md)**: System integration details

### 🔐 Security Features

- JWT-based authentication with refresh tokens
- Role-based access control (Patient/Doctor/Admin)
- End-to-end encryption for all communications
- Comprehensive audit logging
- HIPAA-compliant data handling
- Multi-factor authentication support
- Rate limiting and DDoS protection

### 🌍 Ethiopian Market Features

- **Multilingual Support**: Full English and Amharic interface
- **Cultural Sensitivity**: Healthcare recommendations adapted for Ethiopian context
- **Local Integration**: Ethiopian phone number formats and address systems
- **Regulatory Compliance**: Adherence to Ethiopian healthcare regulations

### 🎯 Demo Credentials

**Doctor Portal:**
- Email: doctor@telehealth.com
- Password: doctor123

**Patient App:**
- Email: patient@telehealth.com
- Password: patient123

**Admin Dashboard:**
- Email: admin@telehealth.com
- Password: admin123

### 🛠️ Development

#### Project Structure
- **Modular Architecture**: Clean separation of concerns
- **TypeScript**: Full type safety across the stack
- **Modern React**: Hooks, Context API, and functional components
- **Responsive Design**: Mobile-first with Tailwind CSS
- **Real-time Features**: WebSocket integration
- **AI Integration**: OpenAI GPT-4 for medical assistance

#### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### 📞 Support

For technical support or questions:
- **Documentation**: Check the comprehensive docs/ folder
- **Issues**: Create detailed issue reports
- **Email**: support@telehealth.com

### 📄 License

This project is proprietary software developed for healthcare applications.
All rights reserved.

### 🏆 Features Highlights

#### For Patients
- AI-powered symptom triage in English and Amharic
- Easy appointment booking with Ethiopian doctors
- Secure video consultations
- Personal health record management
- Medication reminders and health tips

#### For Doctors
- Comprehensive patient management dashboard
- AI-assisted diagnosis and image analysis
- Real-time consultation tools
- Integrated medical records
- Performance analytics and insights

#### For Administrators
- Complete system oversight and monitoring
- User management and verification
- Analytics and reporting
- Security and compliance monitoring
- System health and performance tracking

---

**Built with ❤️ for Ethiopian Healthcare**

This platform represents a significant advancement in telehealth technology, combining cutting-edge AI with healthcare expertise to serve the Ethiopian market while maintaining global standards for security, compliance, and user experience.
EOF

    log_success "README created!"
}

create_installation_script() {
    log_info "Creating installation script..."
    
    cat > "$PACKAGE_DIR/install.sh" << 'EOF'
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
EOF

    chmod +x "$PACKAGE_DIR/install.sh"
    log_success "Installation script created!"
}

create_docker_compose() {
    log_info "Creating Docker Compose configuration..."
    
    cat > "$PACKAGE_DIR/docker-compose.yml" << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: telehealth_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  backend:
    build:
      context: ./backend/telehealth-api
      dockerfile: ../../infrastructure/docker/Dockerfile.backend
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: development
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USERNAME: postgres
      DB_PASSWORD: postgres
      DB_NAME: telehealth_db
      REDIS_HOST: redis
      REDIS_PORT: 6379
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    volumes:
      - ./backend/telehealth-api:/app
      - /app/node_modules

volumes:
  postgres_data:
  redis_data:
EOF

    log_success "Docker Compose configuration created!"
}

create_package_info() {
    log_info "Creating package information..."
    
    cat > "$PACKAGE_DIR/PACKAGE_INFO.md" << EOF
# TeleHealth Platform Package Information

**Package Created:** $(date)
**Version:** 1.0.0
**Build:** ${TIMESTAMP}

## Package Contents Summary

### Applications
- **Backend API**: NestJS with TypeScript, 7 integrated modules
- **Doctor Portal**: React web application for healthcare providers
- **Patient App**: Mobile-first React application with AI triage
- **Admin Dashboard**: System management and analytics interface

### Infrastructure
- **Terraform**: Complete AWS infrastructure as code
- **Docker**: Container configurations for all services
- **CI/CD**: GitHub Actions workflows for automated deployment
- **Monitoring**: CloudWatch and application monitoring setup

### Documentation
- **Architecture Documentation**: Complete system design and integration
- **User Manuals**: Comprehensive guides for all user types
- **API Documentation**: Complete REST API and WebSocket documentation
- **Deployment Guides**: Step-by-step deployment procedures

### Testing
- **Backend Tests**: Unit and integration tests for all modules
- **Frontend Tests**: Component and integration tests for all apps
- **E2E Tests**: Complete user workflow validation
- **Security Tests**: Vulnerability scanning and penetration testing

## Key Features Implemented

### AI Services
- ✅ Multilingual symptom triage (English/Amharic)
- ✅ Medical image analysis with GPT-4 Vision
- ✅ Intelligent health recommendations
- ✅ Cultural sensitivity for Ethiopian market

### Real-time Communication
- ✅ WebSocket-based consultations
- ✅ Secure file sharing
- ✅ Push notifications
- ✅ Typing indicators and read receipts

### Security & Compliance
- ✅ JWT authentication with refresh tokens
- ✅ Role-based access control
- ✅ End-to-end encryption
- ✅ Comprehensive audit logging
- ✅ HIPAA-equivalent compliance

### User Experience
- ✅ Responsive design for all devices
- ✅ Dark/light theme support
- ✅ Multilingual interface (English/Amharic)
- ✅ Accessibility compliance (WCAG 2.1)

### Cloud Infrastructure
- ✅ AWS ECS Fargate deployment
- ✅ RDS PostgreSQL with encryption
- ✅ S3 file storage with CDN
- ✅ Auto-scaling and load balancing
- ✅ Comprehensive monitoring and alerting

## Installation Requirements

### System Requirements
- Node.js 18+
- PostgreSQL 15+
- Redis (optional, for caching)
- Docker (for containerized deployment)

### Cloud Requirements (for production)
- AWS Account with appropriate permissions
- Domain name for SSL certificates
- SMTP service for email notifications
- OpenAI API key for AI services

## Support Information

This package includes comprehensive documentation and support materials:
- Step-by-step installation guides
- Configuration examples
- Troubleshooting procedures
- Performance optimization guides
- Security best practices

For additional support, refer to the documentation in the docs/ directory.

---

**Enterprise-Grade TeleHealth Platform**
*Built for Ethiopian Healthcare with Global Standards*
EOF

    log_success "Package information created!"
}

create_archive() {
    log_info "Creating compressed archive..."
    
    cd /tmp
    tar -czf "$ARCHIVE_NAME" "${PACKAGE_NAME}_${TIMESTAMP}"
    
    # Move to original directory
    mv "$ARCHIVE_NAME" /home/ubuntu/
    
    log_success "Archive created: /home/ubuntu/$ARCHIVE_NAME"
}

cleanup() {
    log_info "Cleaning up temporary files..."
    rm -rf "$PACKAGE_DIR"
    log_success "Cleanup completed!"
}

main() {
    echo "📦 TeleHealth Platform Package Creator"
    echo "====================================="
    echo
    
    create_package_structure
    create_readme
    create_installation_script
    create_docker_compose
    create_package_info
    create_archive
    cleanup
    
    echo
    log_success "Package creation completed successfully!"
    echo
    echo "📦 Package Details:"
    echo "   Name: $ARCHIVE_NAME"
    echo "   Location: /home/ubuntu/$ARCHIVE_NAME"
    echo "   Size: $(du -h /home/ubuntu/$ARCHIVE_NAME | cut -f1)"
    echo
    echo "🚀 To use the package:"
    echo "   1. Extract: tar -xzf $ARCHIVE_NAME"
    echo "   2. Install: cd ${PACKAGE_NAME}_${TIMESTAMP} && ./install.sh"
    echo "   3. Configure: Edit .env files with your settings"
    echo "   4. Deploy: Follow the deployment guide in docs/"
    echo
}

main "$@"
EOF

    chmod +x /home/ubuntu/telehealth-platform/create-package.sh
    log_success "Package creation script created!"
}

# Execute the package creation
create_package_creation_script

