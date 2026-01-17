
**Issue**: Cannot connect to AWS MySQL database (41.216.185.84:3306) from localhost
**Status**: Environment variables configured correctly, but connection blocked

---

## 📋 SOLUTION OPTIONS

### Option 1: Fix Direct Connection (Recommended for Production)
### Option 2: Use SSH Tunneling (Quick Fix for Development)

---

## 🎯 OPTION 1: FIX DIRECT CONNECTION

### Step 1: Check AWS Security Group
Your AWS security group must allow inbound MySQL connections:

1. **Go to AWS EC2 Console** → **Security Groups**
2. **Find your MySQL instance's security group**
3. **Add Inbound Rule**:
   - **Type**: MySQL/Aurora
   - **Protocol**: TCP
   - **Port Range**: 3306
   - **Source**: Your IP address (or 0.0.0.0/0 for testing)

### Step 2: Verify MySQL Service is Running
SSH into your AWS VPS and check:
```bash
ssh ubuntu@41.216.185.84
sudo systemctl status mysql
# Should show: Active: active (running)
```

### Step 3: Test Connection
```bash
node test-database-connection.js
```

**Expected Result**:
```
✅ Connected to MySQL database!
Database: hostvoch_webapp
MySQL Version: 11.4.9-MariaDB
Products: 104 items found
```

---

## 🚀 OPTION 2: SSH TUNNELING (QUICK FIX)

### Step 1: Update SSH Tunnel Script
Edit `setup-ssh-tunnel.js` and update the SSH key path:
```javascript
const sshKeyPath = 'C:/path/to/your/aws-key.pem'; // Windows path
// or
const sshKeyPath = '/home/user/aws-key.pem'; // Linux/Mac path
```

### Step 2: Set SSH Key Permissions
```bash
# On Windows (PowerShell as Administrator):
icacls "C:\path\to\your\aws-key.pem" /inheritance:r /grant:r "$($env:USERNAME):F"

# On Linux/Mac:
chmod 400 /path/to/your/aws-key.pem
```

### Step 3: Create Environment Override
Create `.env.local.tunnel`:
```env
DB_HOST=localhost
DB_PORT=3307
DB_USER=hostvoch_webar
DB_PASSWORD=YOUR_DB_PASSWORD
DB_DATABASE=hostvoch_webapp
```

### Step 4: Start SSH Tunnel
```bash
node setup-ssh-tunnel.js
```

### Step 5: Test Connection (in another terminal)
```bash
# Load tunnel environment
set DB_HOST=localhost && set DB_PORT=3307 && node test-database-connection.js
```

---

## 🔍 TROUBLESHOOTING

### Issue: "ECONNREFUSED"
**Cause**: Security group blocking connections
**Fix**: Add inbound rule for port 3306 from your IP

### Issue: "SSH tunnel fails"
**Cause**: SSH key permissions or path incorrect
**Fix**:
1. Verify key path in script
2. Set correct permissions: `chmod 400 key.pem`
3. Test manual SSH: `ssh -i key.pem ubuntu@41.216.185.84`

### Issue: "MySQL service not running"
**Cause**: MySQL stopped on AWS VPS
**Fix**:
```bash
ssh ubuntu@41.216.185.84
sudo systemctl start mysql
sudo systemctl enable mysql
```

### Issue: "Access denied for user"
**Cause**: Wrong credentials or user permissions
**Fix**: Verify credentials in AWS MySQL and grant permissions:
```sql
GRANT ALL PRIVILEGES ON hostvoch_webapp.* TO 'hostvoch_webar'@'%' IDENTIFIED BY 'YOUR_DB_PASSWORD';
FLUSH PRIVILEGES;
```

---

## 📊 TESTING CHECKLIST

- [ ] Environment variables loaded correctly
- [ ] SSH tunnel active (if using tunneling)
- [ ] Database connection successful
- [ ] Products table accessible (104 items)
- [ ] All tables listed correctly
- [ ] Next.js app starts without DB errors

---

## 🎯 RECOMMENDATION

**For Development**: Use SSH tunneling (Option 2) - faster setup
**For Production**: Fix direct connection (Option 1) - better performance

**Current Status**: Ready to test both options

---

## 📞 NEXT STEPS

1. Choose your preferred option (SSH tunnel or direct connection)
2. Follow the step-by-step guide above
3. Test the connection with: `node test-database-connection.js`
4. Once working, run: `npm run dev` to start your Next.js app

**Need help?** Run the test script and share the error message for specific troubleshooting.
