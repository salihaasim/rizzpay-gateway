# Networking Setup Todo List

## Current Status
- **Target Elastic IP**: 13.203.234.115
- **Primary Bank Integration**: CUB (City Union Bank)

## Network Configuration Tasks

### 1. Elastic IP Verification
- [ ] Confirm Elastic IP 13.203.234.115 is attached and visible
- [ ] Test with: `curl ifconfig.me`
- [ ] Verify IP matches expected address

### 2. Outbound Traffic Routing
- [ ] Ensure all outbound traffic to CUB API (443 HTTPS) goes via Elastic IP
- [ ] Configure NAT Gateway if multiple servers are deployed
- [ ] Test API connectivity from EC2 instances

### 3. Security Group Configuration
- [ ] Lock down Security Groups
- [ ] Allow only required ports:
  - SSH (22) from your IP only
  - HTTPS (443) outbound for API calls
  - HTTP (80) for web traffic (if needed)
- [ ] Remove unnecessary open ports

### 4. High Availability Setup
- [ ] Deploy infrastructure in at least 2 Availability Zones
- [ ] Configure load balancer across AZs
- [ ] Test failover scenarios

### 5. Bank IP Whitelisting
- [ ] Ask CUB if they support multiple IP whitelists for failover
- [ ] Request backup IP addresses for redundancy
- [ ] Document all whitelisted IPs

### 6. Long-term Connectivity Options
- [ ] Evaluate VPN setup with CUB for secure connectivity
- [ ] Consider AWS Direct Connect for dedicated connection
- [ ] Compare costs and security benefits

### 7. Monitoring and Logging
- [ ] Enable VPC Flow Logs to monitor outgoing API traffic
- [ ] Set up CloudWatch monitoring for network metrics
- [ ] Configure alerts for connection failures

## Security Considerations
- All bank API communications use HTTPS (port 443)
- AES-256 encryption required for sensitive data
- IP whitelisting mandatory for bank APIs
- Network segmentation for production environment

## Testing Checklist
- [ ] Verify outbound IP is consistent
- [ ] Test API connectivity from all servers
- [ ] Validate security group rules
- [ ] Test failover scenarios
- [ ] Monitor network logs for anomalies