
# RizzPay Migration Checklist

## Phase 1: Database Migration ✅ STARTED

### Prerequisites
- [ ] AWS Account setup with appropriate permissions
- [ ] Terraform installed locally
- [ ] AWS CLI configured
- [ ] Docker installed
- [ ] Access to Supabase project

### Step 1: Export Supabase Data
```bash
cd rizzpay_backend/migration
npm install
export SUPABASE_URL="your_supabase_url"
export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
npm run export:supabase
```

### Step 2: Set up AWS Infrastructure
```bash
# Initialize Terraform
npm run terraform:init

# Plan and apply for test environment
npm run terraform:plan:test
npm run terraform:apply:test

# Plan and apply for UAT environment
npm run terraform:plan:uat
npm run terraform:apply:uat

# Plan and apply for production environment
npm run terraform:plan:prod
npm run terraform:apply:prod
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
npm run import:data uat
npm run import:data prod
```

## Phase 2: Application Migration

### Step 4: Containerize Applications
- [ ] Build backend Docker image
- [ ] Build frontend Docker image
- [ ] Test containers locally
- [ ] Push to ECR repositories

### Step 5: Configure Environment Variables
- [ ] Set up AWS Secrets Manager
- [ ] Configure environment-specific settings
- [ ] Update database connection strings
- [ ] Configure external API keys

### Step 6: Deploy Applications
```bash
# Deploy to test environment
npm run deploy:test

# Deploy to UAT environment
npm run deploy:uat

# Deploy to production
npm run deploy:prod
```

## Phase 3: CI/CD Pipeline

### Step 7: Set up GitHub Actions
- [ ] Create deployment workflows
- [ ] Configure environment secrets
- [ ] Set up automated testing
- [ ] Configure approval processes

### Step 8: Configure Monitoring
- [ ] Set up CloudWatch logs
- [ ] Configure application metrics
- [ ] Set up alerting rules
- [ ] Configure health checks

## Phase 4: Go-Live

### Step 9: DNS and Domain Configuration
- [ ] Update DNS records for rizz-pay.in
- [ ] Configure SSL certificates
- [ ] Set up CDN and caching
- [ ] Test all environments

### Step 10: Final Validation
- [ ] End-to-end testing on all environments
- [ ] Performance testing
- [ ] Security validation
- [ ] Backup and recovery testing

## Rollback Plan
- [ ] Document rollback procedures
- [ ] Test rollback scenarios
- [ ] Prepare emergency contacts
- [ ] Create communication plan

## Post-Migration Tasks
- [ ] Monitor application performance
- [ ] Optimize costs
- [ ] Update documentation
- [ ] Train team on new infrastructure
- [ ] Decommission old resources (after validation period)

## Important Notes
- Always test in TEST environment first
- UAT environment should mirror production as closely as possible
- Keep Supabase running during initial migration for fallback
- Monitor costs during initial weeks
- Set up proper backup strategies before going live

## Emergency Contacts
- AWS Support: [Support Case URL]
- DevOps Team: [Contact Information]
- Database Administrator: [Contact Information]
