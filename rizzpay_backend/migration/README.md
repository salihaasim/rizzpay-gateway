
# RizzPay Migration Strategy: Lovable → AWS Production

## Overview
This directory contains the migration strategy and tools to move RizzPay from Lovable/Supabase to a full AWS production environment with Test, UAT, and Prod environments.

## Current Status: Phase 1 - Database Migration ✅ IN PROGRESS

### Completed:
- ✅ Migration framework setup
- ✅ Database schema created for AWS RDS
- ✅ Supabase export scripts ready
- ✅ Terraform infrastructure code prepared
- ✅ Docker configurations ready
- ✅ Deployment scripts created

### Next Steps:
1. **Export Supabase Data** (Current Step)
2. Set up AWS infrastructure with Terraform
3. Import data to AWS RDS
4. Test database migration

## Migration Phases

### Phase 1: Database Migration (Current)
- Export Supabase schema and data
- Set up AWS RDS PostgreSQL instances
- Migrate database structure and data
- Validate data integrity

### Phase 2: Application Migration
- Containerize React frontend and Node.js backend
- Set up AWS infrastructure (ECS, S3, CloudFront)
- Configure environment-specific settings

### Phase 3: CI/CD Pipeline
- Set up GitHub Actions workflows
- Implement automated testing
- Deploy to Test → UAT → Prod environments

### Phase 4: Monitoring & Operations
- Set up CloudWatch monitoring
- Configure alerting and logging
- Implement backup strategies

## How to Execute the Migration

### Step 1: Export Supabase Data (Current Step)
```bash
cd rizzpay_backend/migration
npm install

# Set your Supabase credentials
export SUPABASE_URL="your_supabase_url"
export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"

# Run the export
npm run export:supabase
```

### Step 2: Set up AWS Infrastructure
```bash
# Initialize Terraform
npm run terraform:init

# Plan and apply for test environment
npm run terraform:plan:test
npm run terraform:apply:test
```

### Step 3: Import Data to AWS RDS
```bash
# Set environment variables for target database
export DB_HOST="your_rds_endpoint"
export DB_USER="rizzpay_admin"
export DB_PASSWORD="your_password"
export DB_NAME="rizzpay"

# Import data
npm run import:data test
```

## Directory Structure
```
migration/
├── database/
│   ├── export/          # Supabase export scripts ✅
│   │   ├── supabase_export.js
│   │   └── exported_data/  # Will contain exported data
│   ├── schema/          # Database schema files ✅
│   │   └── rizzpay_schema.sql
│   └── migration/       # Migration scripts ✅
│       └── import_supabase_data.js
├── infrastructure/
│   ├── terraform/       # AWS infrastructure as code ✅
│   │   ├── main.tf
│   │   └── environments/
│   └── docker/          # Container configurations ✅
│       ├── Dockerfile.backend
│       ├── Dockerfile.frontend
│       └── nginx.conf
├── deployment/
│   ├── scripts/         # Deployment automation ✅
│   │   └── deploy.sh
│   └── environments/    # Environment configs ✅
│       └── test.env
└── MIGRATION_CHECKLIST.md  # Detailed checklist ✅
```

## Environment Setup

### Required Environment Variables for Supabase Export:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key

### Required Environment Variables for AWS Import:
- `DB_HOST`: RDS endpoint
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name

## Migration Features

### Database Export Features:
- ✅ Complete schema export
- ✅ All table data export
- ✅ Data validation and integrity checks
- ✅ Export summary and statistics
- ✅ Error handling and logging

### AWS Infrastructure Features:
- ✅ Multi-environment support (Test, UAT, Prod)
- ✅ RDS PostgreSQL with automated backups
- ✅ S3 + CloudFront for frontend hosting
- ✅ ECS for containerized backend
- ✅ Security groups and VPC configuration
- ✅ SSL certificates for production

### Deployment Features:
- ✅ Automated Docker builds
- ✅ Environment-specific configurations
- ✅ Blue-green deployment ready
- ✅ Rollback procedures

## Security Considerations
- Database encryption at rest
- SSL/TLS for data in transit
- VPC isolation
- IAM role-based access control
- API key rotation capabilities

## Cost Optimization
- Environment-appropriate instance sizes
- Automated scaling policies
- Reserved instances for production
- S3 lifecycle policies

## Monitoring & Alerts
- CloudWatch integration
- Database performance monitoring
- Application logs aggregation
- Cost monitoring and alerts

## Risk Mitigation
- Parallel running during transition
- Automated rollback procedures
- Data validation at each step
- Comprehensive testing in lower environments

---

## Current Action Required:
Run the Supabase export script to begin the migration process.
