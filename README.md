
# RizzPay Payment Gateway

RizzPay is a comprehensive payment gateway platform designed for Indian businesses, offering a wide range of payment collection methods, transaction management, and merchant services.

## Features

- **Multiple Payment Methods**: Accept payments via UPI, cards, net banking, and more
- **Payment Links**: Generate shareable payment links to collect payments without a website
- **Escrow Services**: Secure payment holding system to protect both buyers and sellers
- **Merchant Dashboard**: Comprehensive analytics and transaction management
- **Webhook Integration**: Easily integrate payments with your website or application
- **Transaction Logs**: Detailed transaction history and reporting
- **Real-time Notifications**: Stay updated on payment status changes
- **Admin Controls**: Manage merchants, escrow accounts, and platform settings

## Documentation

For detailed information about the platform, please refer to the following documentation:

- [RizzPay Documentation](RIZZPAY_DOCUMENTATION.md): Complete platform overview
- [Payment Processing Guide](PAYMENT_README.md): Payment processing workflows
- [Merchant Onboarding Guide](MERCHANT_ONBOARDING.md): How to onboard merchants to the platform
- [Escrow System Explained](RIZZPAY_ESCROW_EXPLAINED.md): Understanding the escrow system
- [Webhook Integration Guide](WEBHOOK_README.md): Integrating with our webhook API

## Developer Integration

RizzPay provides several methods for integrating payments into your application:

1. **Direct API Integration**: Use our REST APIs for complete control
2. **Payment Links**: Generate payment links to share with customers
3. **Hosted Payment Page**: Redirect customers to our secure payment page
4. **Webhook Integration**: Receive payment notifications directly to your server

## UPI Payment Links

RizzPay now supports UPI payment link generation for merchants:

1. Go to the Admin Dashboard > Payment Links tab
2. Click "Generate New UPI Link"
3. Fill in the payment details including amount, customer information, and UPI ID
4. Share the generated link with your customer
5. Track payment status in real-time from your dashboard

These payment links work seamlessly on all devices and payment apps, ensuring a smooth transaction experience for your customers.

## Recent Updates

- Added UPI payment link generation feature for direct payment collection
- Implemented comprehensive escrow system with bank API integration
- Enhanced webhook integration with multiple programming language examples
- Improved transaction log filtering and export capabilities

## Installation Instructions

### AWS Cloud Deployment

#### Prerequisites
- AWS account with appropriate permissions
- Domain name (optional but recommended)
- SSL certificate (via AWS Certificate Manager)

#### Step 1: Set Up Infrastructure
1. **Create EC2 Instance**:
   - Launch an EC2 instance (recommended: t3.medium or higher)
   - Use Amazon Linux 2 or Ubuntu Server 20.04 LTS
   - Allocate at least 20GB EBS storage
   - Configure security group to allow HTTP (80), HTTPS (443), and SSH (22) ports

2. **Set Up Database**:
   - Option A: Create an RDS PostgreSQL instance (recommended for production)
     - Engine version: PostgreSQL 14.0 or higher
     - Instance class: db.t3.medium or higher
     - Storage: 20GB minimum, enable auto-scaling
     - Configure VPC security group to allow access from EC2 instance
   
   - Option B: Install PostgreSQL directly on EC2 instance (for smaller deployments)
     ```bash
     # For Ubuntu
     sudo apt update
     sudo apt install postgresql postgresql-contrib
     
     # For Amazon Linux
     sudo amazon-linux-extras enable postgresql13
     sudo yum install postgresql postgresql-server
     sudo postgresql-setup initdb
     sudo systemctl start postgresql
     sudo systemctl enable postgresql
     ```

3. **Configure Load Balancer (Optional):**
   - Create an Application Load Balancer
   - Configure target groups pointing to your EC2 instance(s)
   - Set up SSL certificate via AWS Certificate Manager
   - Configure health checks and routing rules

#### Step 2: Install Dependencies

1. **Connect to EC2 Instance**:
   ```bash
   ssh -i your-key.pem ec2-user@your-instance-ip
   ```

2. **Install Node.js, Nginx, and dependencies**:
   ```bash
   # Update system
   sudo yum update -y # Amazon Linux
   # OR
   sudo apt update # Ubuntu
   
   # Install Node.js
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   source ~/.bashrc
   nvm install 16
   
   # Install Nginx
   sudo yum install nginx # Amazon Linux
   # OR
   sudo apt install nginx # Ubuntu
   
   # Start Nginx
   sudo systemctl start nginx
   sudo systemctl enable nginx
   
   # Install PM2 for process management
   npm install -g pm2
   ```

#### Step 3: Deploy Application

1. **Clone Repository**:
   ```bash
   git clone https://your-repository-url/rizzpay.git
   cd rizzpay
   ```

2. **Install Application Dependencies**:
   ```bash
   npm install
   ```

3. **Create Environment Variables**:
   ```bash
   cp .env.example .env.production
   # Edit the .env.production file with your database credentials and other config
   nano .env.production
   ```

4. **Build Production Bundle**:
   ```bash
   npm run build
   ```

5. **Configure PM2 for Process Management**:
   ```bash
   pm2 start npm --name "rizzpay" -- run start:prod
   pm2 startup
   pm2 save
   ```

6. **Set up Nginx as Reverse Proxy**:
   ```bash
   sudo nano /etc/nginx/sites-available/rizzpay
   ```
   
   Add the following configuration:
   ```
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;
   
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

7. **Enable Site and Restart Nginx**:
   ```bash
   sudo ln -s /etc/nginx/sites-available/rizzpay /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

8. **Set Up SSL with Certbot (Let's Encrypt)**:
   ```bash
   sudo yum install certbot python3-certbot-nginx # Amazon Linux
   # OR
   sudo apt install certbot python3-certbot-nginx # Ubuntu
   
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

#### Step 4: Database Setup and Migration

1. **Configure Database Connection**:
   - Update the database connection parameters in your .env.production file
   - Ensure your EC2 instance can connect to your RDS or local PostgreSQL

2. **Run Database Migrations**:
   ```bash
   NODE_ENV=production npm run migrate
   ```

#### Step 5: Monitoring and Maintenance

1. **Set Up Application Monitoring**:
   ```bash
   pm2 install pm2-logrotate
   pm2 set pm2-logrotate:max_size 10M
   pm2 set pm2-logrotate:retain 30
   ```

2. **Configure AWS CloudWatch (Optional)**:
   ```bash
   sudo yum install amazon-cloudwatch-agent # Amazon Linux
   # OR
   sudo apt install amazon-cloudwatch-agent # Ubuntu
   
   # Configure CloudWatch agent
   sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-config-wizard
   ```

3. **Set Up Regular Backups**:
   - For RDS, configure automated snapshots
   - For local PostgreSQL, set up regular pg_dump scripts and upload to S3

#### Step 6: Scaling Configuration (Optional)

1. **Configure Auto Scaling Group**:
   - Create an AMI from your configured EC2 instance
   - Set up a launch template using the AMI
   - Configure an Auto Scaling Group with desired capacity
   - Associate the Auto Scaling Group with your Application Load Balancer

#### Step 7: Set Up CDN (Optional)

1. **Configure CloudFront**:
   - Create a CloudFront distribution
   - Set your load balancer or EC2 instance as the origin
   - Configure caching behavior for static assets

### Physical Server Installation

If you prefer to deploy on a physical server rather than AWS EC2:

1. **Prepare the Server**:
   - Install a Linux distribution (Ubuntu Server 20.04 LTS recommended)
   - Configure firewall to allow necessary ports (80, 443, 22)
   - Set up RAID for data redundancy

2. **Install Required Software**:
   - Follow steps 2-4 from the AWS installation guide above
   - Ensure PostgreSQL is properly secured with strong passwords

3. **Configure High Availability**:
   - Consider setting up multiple server instances with load balancing
   - Implement regular backups to external storage
   - Set up database replication for redundancy

4. **Network Configuration**:
   - Configure your router/firewall to forward appropriate ports
   - Set up a static IP address or use DDNS
   - Consider using a reverse proxy like Nginx or HAProxy

## Security Best Practices

1. **Database Security**:
   - Use strong passwords for database users
   - Implement least-privilege access principles
   - Regularly update and patch the database server

2. **Application Security**:
   - Keep Node.js and npm packages updated
   - Implement API rate limiting
   - Use HTTPS exclusively in production

3. **Server Security**:
   - Keep the OS and all packages updated
   - Use a firewall to restrict access
   - Implement intrusion detection systems
   - Set up regular security audits

## Getting Started with RizzPay

To start accepting payments with RizzPay:

1. Register for a merchant account
2. Complete the verification process
3. Integrate one of our payment solutions
4. Start accepting payments

For more information, visit our developer portal or contact our support team.
