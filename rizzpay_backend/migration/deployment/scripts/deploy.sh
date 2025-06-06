
#!/bin/bash

# RizzPay Deployment Script
# Usage: ./deploy.sh [environment] [service]
# Example: ./deploy.sh prod backend

set -e

ENVIRONMENT=${1:-test}
SERVICE=${2:-all}
AWS_REGION="ap-south-1"
ECR_REPOSITORY_URI="123456789012.dkr.ecr.ap-south-1.amazonaws.com"

echo "🚀 Starting deployment for environment: $ENVIRONMENT, service: $SERVICE"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check AWS CLI
if ! command -v aws &> /dev/null; then
    print_error "AWS CLI not found. Please install AWS CLI."
    exit 1
fi

# Check Docker
if ! command -v docker &> /dev/null; then
    print_error "Docker not found. Please install Docker."
    exit 1
fi

# Set environment variables
case $ENVIRONMENT in
    "test")
        CLUSTER_NAME="rizzpay-test"
        DB_HOST="rizzpay-test-db.cluster-xyz.ap-south-1.rds.amazonaws.com"
        ;;
    "uat")
        CLUSTER_NAME="rizzpay-uat"
        DB_HOST="rizzpay-uat-db.cluster-xyz.ap-south-1.rds.amazonaws.com"
        ;;
    "prod")
        CLUSTER_NAME="rizzpay-prod"
        DB_HOST="rizzpay-prod-db.cluster-xyz.ap-south-1.rds.amazonaws.com"
        ;;
    *)
        print_error "Invalid environment: $ENVIRONMENT"
        exit 1
        ;;
esac

# Deploy backend
deploy_backend() {
    print_status "Deploying backend to $ENVIRONMENT..."
    
    # Build Docker image
    docker build -f ../infrastructure/docker/Dockerfile.backend -t rizzpay-backend:$ENVIRONMENT .
    
    # Tag for ECR
    docker tag rizzpay-backend:$ENVIRONMENT $ECR_REPOSITORY_URI/rizzpay-backend:$ENVIRONMENT
    
    # Push to ECR
    aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REPOSITORY_URI
    docker push $ECR_REPOSITORY_URI/rizzpay-backend:$ENVIRONMENT
    
    # Update ECS service
    aws ecs update-service \
        --cluster $CLUSTER_NAME \
        --service rizzpay-backend \
        --force-new-deployment \
        --region $AWS_REGION
    
    print_status "Backend deployment completed"
}

# Deploy frontend
deploy_frontend() {
    print_status "Deploying frontend to $ENVIRONMENT..."
    
    # Build frontend
    cd ../../frontend || exit 1
    npm run build
    
    # Sync to S3
    aws s3 sync dist/ s3://rizzpay-$ENVIRONMENT-frontend/ --delete
    
    # Invalidate CloudFront
    DISTRIBUTION_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?Comment=='RizzPay $ENVIRONMENT'].Id" --output text)
    if [ ! -z "$DISTRIBUTION_ID" ]; then
        aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"
    fi
    
    cd ../rizzpay_backend/migration/deployment/scripts || exit 1
    print_status "Frontend deployment completed"
}

# Main deployment logic
case $SERVICE in
    "backend")
        deploy_backend
        ;;
    "frontend")
        deploy_frontend
        ;;
    "all")
        deploy_backend
        deploy_frontend
        ;;
    *)
        print_error "Invalid service: $SERVICE"
        exit 1
        ;;
esac

print_status "🎉 Deployment completed successfully!"
