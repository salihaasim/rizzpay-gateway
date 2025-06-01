
# RizzPay AWS Deployment Checklist

## Pre-Deployment
- [ ] AWS CLI installed and configured
- [ ] AWS account with necessary permissions
- [ ] Domain name purchased (if using custom domain)
- [ ] Supabase project configured for production
- [ ] Environment variables prepared

## Environment Setup
- [ ] Run `./environment-setup.sh`
- [ ] Create `.env.production` from template
- [ ] Configure all required environment variables
- [ ] Test local build: `npm run build`

## AWS Infrastructure
- [ ] S3 bucket created and configured
- [ ] S3 static website hosting enabled
- [ ] Bucket policy applied for public read access
- [ ] CloudFront distribution created
- [ ] CloudFront origin pointing to S3 bucket
- [ ] CloudFront caching rules configured
- [ ] Custom error pages set up for SPA routing

## SSL and Domain
- [ ] SSL certificate requested in ACM
- [ ] Certificate validated
- [ ] Route 53 hosted zone created (if using Route 53)
- [ ] DNS records configured
- [ ] CloudFront distribution using SSL certificate

## Security
- [ ] AWS WAF rules configured (optional)
- [ ] Security headers implemented
- [ ] CloudWatch monitoring set up
- [ ] IAM roles and policies reviewed

## Supabase Configuration
- [ ] Production environment configured
- [ ] CORS settings updated with new domain
- [ ] Auth redirect URLs updated
- [ ] Database policies reviewed
- [ ] API rate limits configured

## Testing
- [ ] Frontend loads correctly
- [ ] Authentication works
- [ ] API calls successful
- [ ] Payment flows tested
- [ ] Admin dashboard accessible
- [ ] Mobile responsiveness verified

## Post-Deployment
- [ ] Monitor CloudWatch metrics
- [ ] Check error logs
- [ ] Verify SSL certificate
- [ ] Test all user flows
- [ ] Performance testing
- [ ] SEO configuration (if needed)

## Rollback Plan
- [ ] Previous version backup available
- [ ] Rollback procedure documented
- [ ] Database backup confirmed
- [ ] DNS TTL considerations noted

## Documentation
- [ ] Update deployment documentation
- [ ] Share access credentials securely
- [ ] Document monitoring procedures
- [ ] Create maintenance schedule
