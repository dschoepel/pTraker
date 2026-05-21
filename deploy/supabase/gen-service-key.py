#!/usr/bin/env python3
"""Regenerate SERVICE_ROLE_KEY using the existing JWT_SECRET from Supabase .env"""
import hmac, hashlib, base64, json, time

env_path = '/data/supabase-ptraker/.env'
with open(env_path) as f:
    for line in f:
        if line.startswith('JWT_SECRET='):
            secret = line.strip()[len('JWT_SECRET='):]
            break
    else:
        raise SystemExit('JWT_SECRET not found in ' + env_path)

now = int(time.time())
exp = now + 315360000  # 10 years

def b64u(d):
    data = json.dumps(d, separators=(',', ':')).encode() if isinstance(d, dict) else d.encode()
    return base64.urlsafe_b64encode(data).rstrip(b'=').decode()

header  = b64u({'alg': 'HS256', 'typ': 'JWT'})
payload = b64u({'role': 'service_role', 'iss': 'supabase', 'iat': now, 'exp': exp})
msg = f'{header}.{payload}'
sig = base64.urlsafe_b64encode(
    hmac.new(secret.encode(), msg.encode(), hashlib.sha256).digest()
).rstrip(b'=').decode()

key = f'{msg}.{sig}'
print(key)
import sys
print(f'\nDots: {key.count(".")} (need 2)', file=sys.stderr)
