
# RizzPay AWS Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying RizzPay to AWS using a hybrid approach with S3/CloudFront for frontend and keeping Supabase as the backend.

## Prerequisites
- AWS CLI installed and configured
- AWS account with appropriate permissions
- Domain name (optional but recommended)
- Node.js and npm/yarn installed locally

## Architecture
```
[Users] → [Route 53] → [CloudFront] → [S3 Static Website] → [Supabase Backend]
```

## Deployment Steps

### 1. Environment Setup
```bash
# Navigate to aws-deployment directory
cd aws-deployment

# Make scripts executable
chmod +x *.sh

# Set up AWS environment
./environment-setup.sh
```

### 2. Configure Environment Variables
```bash
# Copy the template
cp production-env.template .env.production

# Edit the file with your production values
nano .env.production
```

Required environment variables:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `VITE_APP_URL`: Your production domain URL

### 3. Build and Deploy
```bash
# Run the deployment script
./deploy.sh
```

This script will:
- Build the React application for production
- Create S3 bucket with static website hosting
- Upload files to S3
- Set up proper bucket policies

### 4. Configure CloudFront (Manual Step)
1. Go to AWS CloudFront console
2. Create a new distribution
3. Use the S3 bucket as origin
4. Configure caching behaviors
5. Set up custom error pages for SPA routing

### 5. SSL Certificate and Domain
1. Request SSL certificate in AWS Certificate Manager
2. Configure Route 53 hosted zone
3. Create DNS records pointing to CloudFront

### 6. Update Supabase Settings
1. Add your new domain to Supabase CORS settings
2. Update redirect URLs in Supabase Auth settings

## Security Configuration

### CloudWatch Monitoring
```bash
# Set up monitoring
./cloudwatch-setup.sh
```

### Security Headers
```bash
# Configure security headers
./security-headers.sh
```

## Troubleshooting

### Common Issues
1. **Build Failures**: Check environment variables are set correctly
2. **CORS Errors**: Ensure Supabase allows your domain
3. **404 Errors**: Verify CloudFront error pages are configured for SPA

### Logs and Monitoring
- Check CloudWatch logs for S3 and CloudFront
- Monitor Supabase dashboard for API errors
- Use browser dev tools for client-side debugging

## Cost Estimation
- S3 Storage: ~$0.023/GB/month
- CloudFront: ~$0.085/GB for first 10TB
- Route 53: ~$0.50/month per hosted zone
- SSL Certificate: Free with AWS Certificate Manager

## Maintenance
- Monitor CloudWatch metrics
- Update SSL certificates when needed
- Review and optimize CloudFront caching rules
- Regular security updates

## CI/CD Pipeline (Optional)
For automated deployments, consider setting up:
- AWS CodePipeline
- GitHub Actions integration
- Automated testing and deployment

## Support
For issues related to:
- AWS services: Check AWS documentation
- Supabase: Check Supabase documentation
- Application errors: Review application logs
