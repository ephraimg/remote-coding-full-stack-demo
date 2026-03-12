# Secrets Management

⚠️ **CRITICAL: Never commit these values to GitHub!**

## Secrets to Keep Private

### 1. EC2 Instance Information
- **EC2 IP Address** - Your server's public IP
- **SSH Keys** - Never commit private keys
- **EC2 Username** - Keep in environment variables

### 2. API Keys & Credentials
- **Anthropic API Key** (if using Claude Code)
- **GitHub Personal Access Tokens**
- **AWS Credentials** (if any)

### 3. XRP Wallet Information
- **Private Keys** - NEVER commit or store in code
- **Wallet Seeds** - Keep offline and secure
- **Production Addresses** - Use environment variables

## Where to Store Secrets

### Local Development

Create `.env` file (already in .gitignore):
```bash
# Copy from template
cp .env.example .env

# Edit with your real values
nano .env
```

### On EC2 Instance

Store in `~/.secrets` file:
```bash
# Create secrets file
cat > ~/.secrets << 'EOF'
export EC2_HOST="your-real-ip"
export EC2_USER="ec2-claude-user"
export EXAMPLE_XRP_ADDRESS="your-test-address"
EOF

# Secure it
chmod 600 ~/.secrets

# Source in .bashrc
echo '[ -f ~/.secrets ] && source ~/.secrets' >> ~/.bashrc
```

### GitHub Actions

Add as **Repository Secrets**:
1. Go to: Settings → Secrets and variables → Actions
2. Add secrets:
   - `EC2_HOST` - Your EC2 IP address
   - `EC2_SSH_KEY` - Your SSH private key
   - `EC2_USER` - Username (e.g., ec2-claude-user)

## Safe Values for Public Repo

These are OK to commit:
- ✅ Testnet RPC URLs (wss://s.altnet.rippletest.net:51233)
- ✅ Example testnet addresses (if publicly funded)
- ✅ Port numbers (3000, 80, 443)
- ✅ Placeholder values (e.g., "your-ip-here")

## Unsafe Values - NEVER COMMIT

These should NEVER be in code:
- ❌ Real EC2 IP addresses
- ❌ Private keys or seeds
- ❌ API keys or tokens
- ❌ SSH private keys
- ❌ Production wallet addresses
- ❌ Personal email addresses
- ❌ Internal URLs or endpoints

## Pre-Commit Hook

This repo should have a pre-commit hook to scan for secrets.

Check for patterns like:
- IP addresses: `\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}`
- Private keys: `-----BEGIN.*PRIVATE KEY-----`
- API keys: `sk-ant-`, `ghp_`, `AKIA`

## If You Accidentally Commit a Secret

1. **Immediately rotate the secret** (change password, revoke key, etc.)
2. Remove from Git history:
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch path/to/file" \
     --prune-empty --tag-name-filter cat -- --all
   ```
3. Force push (if you control the repo)
4. Consider the secret compromised

## Example Usage in Code

### ❌ BAD - Hardcoded Secret
```javascript
const EC2_HOST = '12.34.56.78';  // Never hardcode real IPs!
```

### ✅ GOOD - Environment Variable
```javascript
const EC2_HOST = process.env.EC2_HOST || 'localhost';
```

### ✅ GOOD - Placeholder in Docs
```bash
# Connect to EC2
ssh ec2-user@$EC2_HOST
```
