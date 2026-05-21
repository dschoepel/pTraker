#!/usr/bin/env python3
"""Generate all secrets needed for the ptraker production Supabase .env"""

import hmac, hashlib, base64, json, time, secrets

jwt_secret = secrets.token_urlsafe(40)
now = int(time.time())
exp = now + 315360000  # 10 years

def b64u(d):
    if isinstance(d, dict):
        d = json.dumps(d, separators=(',', ':')).encode()
    elif isinstance(d, str):
        d = d.encode()
    return base64.urlsafe_b64encode(d).rstrip(b'=').decode()

def make_jwt(payload):
    h = b64u({'alg': 'HS256', 'typ': 'JWT'})
    p = b64u(payload)
    msg = f'{h}.{p}'
    sig = base64.urlsafe_b64encode(
        hmac.new(jwt_secret.encode(), msg.encode(), hashlib.sha256).digest()
    ).rstrip(b'=').decode()
    return f'{msg}.{sig}'

anon_key         = make_jwt({'role': 'anon',         'iss': 'supabase', 'iat': now, 'exp': exp})
service_role_key = make_jwt({'role': 'service_role', 'iss': 'supabase', 'iat': now, 'exp': exp})

# Verify before printing — truncated JWTs cause subtle prod failures
assert anon_key.count('.')         == 2, f"ANON_KEY malformed: {anon_key.count('.')} dots"
assert service_role_key.count('.') == 2, f"SERVICE_ROLE_KEY malformed: {service_role_key.count('.')} dots"

print("# Copy these values into /data/supabase-ptraker/.env")
print("# Save them in your password manager — ANON_KEY and SERVICE_ROLE_KEY are needed later")
print("# WARNING: these values are long and will wrap in your terminal.")
print("# Copy each value carefully — it must have exactly 2 dots (3 segments).")
print()
print(f"JWT_SECRET={jwt_secret}")
print(f"ANON_KEY={anon_key}")
print(f"SERVICE_ROLE_KEY={service_role_key}")
print(f"POSTGRES_PASSWORD={secrets.token_urlsafe(24)}")
print(f"SECRET_KEY_BASE={secrets.token_urlsafe(64)}")
print(f"VAULT_ENC_KEY={secrets.token_hex(16)}")        # exactly 32 bytes — AES-256-GCM requirement
print(f"PG_META_CRYPTO_KEY={secrets.token_urlsafe(32)}")
print(f"LOGFLARE_PUBLIC_ACCESS_TOKEN={secrets.token_urlsafe(24)}")
print(f"LOGFLARE_PRIVATE_ACCESS_TOKEN={secrets.token_urlsafe(24)}")
print(f"DASHBOARD_PASSWORD={secrets.token_urlsafe(16)}")
print(f"POOLER_TENANT_ID={secrets.token_hex(8)}")
