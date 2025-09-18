# AI Deployment Prompt for EC2 Node.js Setup

## 🌟 Copy-Paste This Prompt to Any AI Assistant

```
I have an AWS EC2 instance (Amazon Linux 2) with an Elastic IP. Please give me exact step-by-step commands to:

1. Install Node.js (version 18.x) and npm on Amazon Linux 2
2. Upload or clone my Node.js project into /var/www/ directory
3. Run npm install to install all dependencies
4. Start my app (index.js or server.js) manually to test it works
5. Install and configure PM2 to run the app so it stays alive after I log out
6. Configure NGINX reverse proxy so that my app (running on port 3000) is accessible from port 80 via my Elastic IP
7. Save PM2 processes so they restart automatically on server reboot
8. Set up basic firewall rules for security

Please provide:
- Copy-pasteable commands for Amazon Linux 2
- Explanation of what each step does in simple terms
- How to check if each step worked correctly
- Basic troubleshooting if something goes wrong

My app details:
- Entry point: index.js (or specify your main file)
- Port: 3000 (or specify your port)
- Project name: rizzpay-backend
```

## 🚀 What This Prompt Gets You

✅ **Complete Node.js installation** - Latest stable version with npm  
✅ **Proper project setup** - In the right directory with correct permissions  
✅ **Production process management** - PM2 for keeping your app alive  
✅ **Web server configuration** - Nginx reverse proxy for port 80 access  
✅ **Auto-restart setup** - App survives server reboots  
✅ **Basic security** - Firewall configuration  
✅ **Verification steps** - How to check everything works  
✅ **Troubleshooting** - What to do if things go wrong  

## 🎯 Why This Prompt Works

- **Specific OS**: Amazon Linux 2 (matches your EC2)
- **Exact requirements**: All 8 steps you need
- **Copy-pasteable**: Commands you can run directly
- **Educational**: Explains what each command does
- **Comprehensive**: From installation to production-ready

## 📝 Customization Tips

Before using the prompt, update these details:
- **Entry point**: Change `index.js` to your main file
- **Port**: Change `3000` to your app's port
- **Project name**: Change `rizzpay-backend` to your project name

## 🔧 Alternative Versions

### For Ubuntu/Debian EC2:
Replace "Amazon Linux 2" with "Ubuntu 20.04 LTS"

### For Docker deployment:
Add: "Also show me how to containerize this with Docker"

### For SSL/HTTPS:
Add: "Include SSL certificate setup with Let's Encrypt"

---

**Pro Tip**: Save this prompt and use it whenever you need to deploy Node.js apps on EC2! 🚀