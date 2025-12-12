# Secure Client Registration & Admin Panel - Backend Specification

This document outlines the required backend architecture, database schema, and security protocols to support the frontend implementation provided in the React application.

## 1. Database Schema (PostgreSQL)

We use PostgreSQL for its robust JSON support and row-level security capabilities.

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    phone_verified BOOLEAN DEFAULT FALSE,
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified BOOLEAN DEFAULT FALSE,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL, -- Argon2id hash
    role VARCHAR(20) DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
    marketing_opt_in BOOLEAN DEFAULT FALSE,
    marketing_channel VARCHAR(20),
    terms_accepted_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    failed_login_attempts INT DEFAULT 0,
    lockout_until TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE
);

-- Admin Audit Log
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(50) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexing for Performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
```

## 2. Authentication & Security Implementation

### Password Hashing
- **Algorithm**: Argon2id
- **Parameters**: 
  - Time cost: 2
  - Memory cost: 19 MiB
  - Parallelism: 1
- **Library**: `argon2` (Node.js) or `passlib` (Python)

### Admin Unlock Credentials
- The specific email `mauriciosntt@gmail.com` serves as the trigger for the Admin role.
- **Implementation**:
  1. During registration endpoint processing, check if `email === 'mauriciosntt@gmail.com'`.
  2. If match, verify phone/email OTPs rigorously.
  3. Upon success, set `role = 'ADMIN'`.

### Session Management
- **Token**: JWT (JSON Web Token) or Secure HttpOnly Session Cookies.
- **Attributes**: `SameSite=Strict`, `Secure` (HTTPS only), `HttpOnly`.
- **Timeout**: 15 minutes absolute timeout for inactivity.
- **Lockout**: After 5 failed attempts, lock account for 30 minutes (`lockout_until` column).

### Two-Factor Authentication (Admin)
- Implement TOTP (Time-based One-Time Password) using `otplib`.
- Store TOTP secret encrypted in the database.
- Enforce TOTP challenge on every Admin login.

## 3. Data Cataloging & File Encryption

To meet the requirement of exporting user records to an isolated folder:

### Sync Process (Cron Job / Worker)
1. **Trigger**: On User Create/Update.
2. **Action**: Serialize user data to JSON.
3. **Encryption**: 
   - Generate a random 32-byte AES key per file.
   - Encrypt the JSON content using AES-256-GCM.
   - Encrypt the per-file key using a Master Key stored in HSM/Vault.
   - Prepend the encrypted key to the file header.
4. **Storage**:
   - Path: `/var/secure_catalog/[UUID].enc`
   - Permissions: `600` (Owner read/write only). Owner must be the service account.

## 4. Operational Hardening & Deployment

### Server Configuration
- **OS**: Hardened Linux (e.g., Ubuntu LTS with CIS benchmarks applied).
- **User**: Run application as non-root user `webapp`.
- **File System**: Catalog folder `/var/secure_catalog` must be outside web root.
- **Firewall**: UFW allowing only ports 443 (HTTPS) and 22 (SSH - restricted IPs).

### HTTPS & SSL/TLS Configuration (MANDATORY)
HTTPS is required for all environments.
1. **Certificates**: Use **Let's Encrypt** (via Certbot) for automated SSL certificate issuance and renewal.
2. **Protocols**: Disable TLS 1.0 and 1.1. Enable **TLS 1.2 and 1.3** only.
3. **Redirects**: Configure Nginx/Apache to force a 301 Permanent Redirect from HTTP (80) to HTTPS (443).
4. **HSTS**: Enable HTTP Strict Transport Security (HSTS) header:
   `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`

### Secrets Management
- Do NOT store secrets in code.
- Use Environment Variables or a Secret Manager (e.g., AWS Secrets Manager, HashiCorp Vault).
- **Required Secrets**:
  - `DB_CONNECTION_STRING`
  - `SESSION_SECRET`
  - `MASTER_ENCRYPTION_KEY`
  - `SMS_GATEWAY_API_KEY`
  - `SMTP_CREDENTIALS`

### Deployment Checklist
1. [ ] Run `npm audit` or `pip safety` to check dependencies.
2. [ ] **Verify SSL/TLS**: Test domain via SSL Labs (Target: A+ rating).
3. [ ] Configure headers: HSTS, X-Frame-Options, X-Content-Type-Options.
4. [ ] Set up nightly database backups (encrypted) to off-site storage (S3/Azure Blob).
5. [ ] Verify that `mauriciosntt@gmail.com` is the ONLY account that can trigger admin creation.

## 5. API Endpoints Specification

- `POST /api/auth/register`: Handle initial form data.
- `POST /api/auth/send-otp`: Trigger SMS/Email providers.
- `POST /api/auth/verify`: Validate OTPs and finalize account creation.
- `POST /api/admin/export`: Admin-only. Stream encrypted catalog files.
- `GET /api/admin/users`: Admin-only. List users with pagination.

---
*Generated by Senior Frontend Security Engineer*