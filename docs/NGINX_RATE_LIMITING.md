# Nginx Rate Limiting Configuration

## Why Nginx Instead of Express?

**Benefits:**
- ✅ More efficient - blocks requests before they hit Node.js
- ✅ Lower CPU usage - handled at web server level
- ✅ Better DDoS protection - stops attacks at the edge
- ✅ Can protect multiple services with one config
- ✅ Built-in logging and monitoring

## Configuration

Update your Nginx config (usually `/etc/nginx/conf.d/xrp-demo.conf`):

```nginx
# Define rate limit zone (before server block)
# 10MB zone can track ~160,000 IP addresses
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=general_limit:10m rate=60r/m;

server {
    listen 80;
    server_name YOUR_EC2_IP;

    # General rate limit - 60 requests per minute per IP
    limit_req zone=general_limit burst=20 nodelay;

    # More strict rate limit for API endpoints
    location /api/ {
        limit_req zone=api_limit burst=5 nodelay;
        limit_req_status 429;

        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }

    # Health check - no rate limiting
    location /health {
        proxy_pass http://localhost:3000;
    }

    # Static files and React app
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

## Rate Limit Explanations

### API Rate Limit
```nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
```
- **10r/s** = 10 requests per second per IP
- **burst=5** = Allow temporary bursts up to 5 extra requests
- **nodelay** = Don't delay requests, reject immediately when over limit

### General Rate Limit
```nginx
limit_req_zone $binary_remote_addr zone=general_limit:10m rate=60r/m;
```
- **60r/m** = 60 requests per minute per IP
- **burst=20** = Allow bursts up to 20 extra requests
- Good for general browsing

## Customizing Limits

### More Strict (Production)
```nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=5r/s;   # 5 per second
limit_req_zone $binary_remote_addr zone=general_limit:10m rate=30r/m; # 30 per minute
```

### More Lenient (Development)
```nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/s;  # 100 per second
limit_req_zone $binary_remote_addr zone=general_limit:10m rate=600r/m; # 600 per minute
```

### Different Limits for Different Endpoints
```nginx
server {
    # Balance checks - very strict
    location /api/balance {
        limit_req zone=balance_limit burst=2 nodelay;
        limit_req_status 429;
        proxy_pass http://localhost:3000;
    }

    # QR generation - less strict
    location /api/payment-qr {
        limit_req zone=qr_limit burst=10 nodelay;
        proxy_pass http://localhost:3000;
    }
}
```

## Testing Rate Limits

```bash
# Test API rate limit - should hit limit after 10 requests/second
for i in {1..20}; do
  curl http://YOUR_EC2_IP/api/balance/rYourAddress &
done
wait

# You should see some 429 (Too Many Requests) responses
```

## Monitoring

### Check Nginx logs
```bash
# Access log
sudo tail -f /var/log/nginx/access.log | grep 429

# Error log
sudo tail -f /var/log/nginx/error.log | grep "limiting requests"
```

### Add Custom Error Page for 429

```nginx
server {
    # Custom 429 error page
    error_page 429 /429.html;
    location = /429.html {
        root /usr/share/nginx/html;
        internal;
    }
}
```

Create `/usr/share/nginx/html/429.html`:
```html
<!DOCTYPE html>
<html>
<head>
    <title>Too Many Requests</title>
</head>
<body>
    <h1>Rate Limit Exceeded</h1>
    <p>Please slow down and try again in a moment.</p>
</body>
</html>
```

## Apply Configuration

```bash
# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

## Whitelist Trusted IPs (Optional)

```nginx
# Define whitelist
geo $limit {
    default 1;
    10.0.0.0/8 0;      # Internal network
    192.168.0.0/16 0;  # Internal network
    YOUR_TRUSTED_IP 0; # Your IP
}

map $limit $limit_key {
    0 "";
    1 $binary_remote_addr;
}

# Use in rate limit
limit_req_zone $limit_key zone=api_limit:10m rate=10r/s;
```

Whitelisted IPs bypass rate limiting.

## Cost Comparison

### Without Nginx Rate Limiting
- Malicious requests hit Node.js
- CPU usage spikes
- Legitimate users affected
- Potential server crashes

### With Nginx Rate Limiting
- Bad requests blocked at web server
- Node.js CPU stays low
- Legitimate users unaffected
- Server stays responsive
