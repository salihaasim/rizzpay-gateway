
# AWS Deployment Troubleshooting Guide

## Common Deployment Issues

### Build Errors

**Error: Environment variables not defined**
```bash
# Solution: Check .env.production file
cat .env.production
# Ensure all required variables are set
```

**Error: Out of memory during build**
```bash
# Solution: Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

### S3 Issues

**Error: Access Denied when accessing website**
- Check bucket policy allows public read access
- Verify bucket is configured for static website hosting
- Ensure index.html is set as index document

**Error: 404 for SPA routes**
- Configure error document to redirect to index.html
- Set up CloudFront custom error pages

### CloudFront Issues

**Error: Files not updating**
- Create CloudFront invalidation: `aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"`
- Check cache behaviors and TTL settings

**Error: SSL certificate not working**
- Ensure certificate is in us-east-1 region (required for CloudFront)
- Verify certificate is validated and issued

### Supabase Integration Issues

**Error: CORS errors**
```bash
# Solution: Add domain to Supabase CORS settings
# In Supabase dashboard: Settings > API > CORS origins
# Add: https://yourdomain.com
```

**Error: Authentication redirects failing**
- Update Supabase Auth settings with new redirect URLs
- Check Site URL and Redirect URLs configuration

### Performance Issues

**Slow loading times**
- Enable gzip compression in CloudFront
- Optimize caching rules
- Check CloudFront edge locations

**High costs**
- Review CloudFront pricing tiers
- Optimize file sizes and compression
- Monitor usage in CloudWatch

## Debugging Steps

### 1. Check Application Logs
```bash
# Browser console for client-side errors
# Supabase dashboard for backend errors
# CloudWatch logs for infrastructure issues
```

### 2. Verify Infrastructure
```bash
# Test S3 bucket directly
aws s3 ls s3://your-bucket-name

# Check CloudFront distribution status
aws cloudfront get-distribution --id YOUR_DISTRIBUTION_ID
```

### 3. Test API Connectivity
```bash
# Test Supabase connection
curl -H "apikey: YOUR_ANON_KEY" "YOUR_SUPABASE_URL/rest/v1/"
```

## Emergency Procedures

### Rollback to Previous Version
1. Restore previous S3 files from backup
2. Create CloudFront invalidation
3. Revert DNS changes if needed

### Service Outage
1. Check AWS Service Health Dashboard
2. Monitor CloudWatch metrics
3. Review error logs
4. Contact AWS support if needed

## Monitoring and Alerts

### Key Metrics to Monitor
- CloudFront error rates
- S3 request errors
- Response times
- SSL certificate expiration

### Setting Up Alerts
```bash
# Create CloudWatch alarm for high error rates
aws cloudwatch put-metric-alarm \
  --alarm-name "HighErrorRate" \
  --alarm-description "Alert when error rate exceeds threshold" \
  --metric-name "ErrorRate" \
  --namespace "AWS/CloudFront" \
  --statistic "Average" \
  --period 300 \
  --threshold 5.0 \
  --comparison-operator "GreaterThanThreshold"
```

## Performance Optimization

### CloudFront Optimization
- Configure appropriate TTL values
- Enable compression
- Use origin shield for global distribution

### S3 Optimization
- Enable transfer acceleration
- Use appropriate storage class
- Implement lifecycle policies

## Security Best Practices

### Regular Security Tasks
- Review IAM permissions
- Check security groups
- Monitor access logs
- Update SSL certificates

### Incident Response
1. Identify the issue
2. Contain the problem
3. Investigate root cause
4. Implement fix
5. Document lessons learned
