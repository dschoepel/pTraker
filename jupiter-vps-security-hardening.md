# Jupiter VPS — Security Hardening

## Overview

*As of Date:* May-14-2026

This document covers the security hardening performed on the Jupiter VPS (`theschoepels.com`) in May 2026. Jupiter is an 8-year-old server that accumulated configuration drift over time. This audit cleaned up stale rules, secured exposed services, and brought the server to a consistent hardened baseline matching Neptune.

No active compromise was found during the audit. This was a proactive hardening exercise.

---

## Services Running on Jupiter

| Container | Image | Purpose | Network |
|---|---|---|---|
| `swag` | linuxserver/swag | Reverse proxy + SSL + fail2ban | proxy_net |
| `bookstack` | solidnerd/bookstack | Wiki | proxy_net |
| `bookstack_db` | mariadb | Bookstack database | proxy_net |
| `nextcloud-app` | linuxserver/nextcloud | File sync/storage | proxy_net + nextcloud-internal |
| `nextcloud-db` | mariadb | Nextcloud database | nextcloud-internal only |
| `ntfy` | binwiederhier/ntfy | Push notifications | proxy_net |
| `pictures` | piwigo/piwigo | Photo gallery | proxy_net |
| `piwigo-db` | mariadb | Piwigo database | proxy_net |
| `wordpress` | wordpress | Development site | proxy_net |
| `wordpress_db` | mysql | WordPress database | proxy_net |
| `imagepulse` | ghcr.io/dschoepel/imagepulse | Docker image update notifications | proxy_net |
| `portainer` | portainer/portainer-ee | Container management | proxy_net |
| `diun-diun-1` | crazymax/diun | Image update detection | diun_default |

### Native services (not Docker)

| Service | Port | Access |
|---|---|---|
| Webmin | 10000 | Via nginx proxy only (`jupiter.theschoepels.com`) |
| SSH | 22791 | Direct, key-based auth only |
| URBackup client | 55413/55414 out | Outbound to backup server |

---

## Final Firewall Configuration

```
[ 1] 80/tcp         ALLOW IN    Anywhere    HTTP (SWAG)
[ 2] 443/tcp        ALLOW IN    Anywhere    HTTPS (SWAG)
[ 3] 22791/tcp      ALLOW IN    Anywhere    SSH
[ 4] 55413/tcp      ALLOW OUT   Anywhere    URBackup client
[ 5] 55414/tcp      ALLOW OUT   Anywhere    URBackup client
```

### Ports removed during hardening

| Port | Service | Reason removed |
|---|---|---|
| 7080 | Bookstack | Now localhost-only, SWAG proxies |
| 2083 | ntfy | Now localhost-only, SWAG proxies |
| 8000 | Portainer agent | Now localhost-only |
| 8889 | Unknown | Stale rule — nothing listening |
| 9001 | Portainer agent | Agent commented out in compose |
| 9443 | Portainer HTTPS | Now localhost-only |
| 10000 | Webmin | Now proxied via SWAG only |
| 5093 | Unknown | Stale docker0 rule |

### Additional iptables rule (not UFW)

Allows the SWAG container to reach Webmin on the host:

```bash
sudo iptables -I INPUT -i br-2c3797117f1f -p tcp --dport 10000 -j ACCEPT
sudo netfilter-persistent save
```

> `br-2c3797117f1f` is the bridge interface for `proxy_net` (`172.18.0.0/16`). If this network is ever recreated verify the bridge name with `ip link show | grep br-` and update accordingly.

---

## WireGuard VPN Tunnel

Jupiter has a WireGuard tunnel to the home LAN — same pattern as Neptune. This provides:
- Secure remote access to Portainer and Webmin from anywhere
- Permanent fallback access regardless of home IP changes
- Encrypted path to LAN services (AdGuard DNS at `10.0.10.233`)

### Network details

| Component | Value |
|---|---|
| Jupiter tunnel IP | `10.0.100.3` |
| UDM Pro endpoint | `vpn.schoepels.com:51820` |
| UDM Pro public key | `i31SGjc19DjX1gaMC8BTGt8AvdgYMeC00T6TiT87uwM=` |
| Jupiter public key | `eoSRkcdMxB3hjHG9P2WN9wCW0wGCHG6F5HPHLXq5F3Y=` |
| Tunnel subnet | `10.0.100.0/24` |
| AllowedIPs | `10.0.10.0/24` (split tunnel — LAN traffic only) |

> Neptune uses `10.0.100.2`, Jupiter uses `10.0.100.3`. Both connect to the same UDM Pro WireGuard server (`vps-tunnel`).

### Configuration file

`/etc/wireguard/wg0.conf`:

```ini
[Interface]
PrivateKey = <redacted>
Address = 10.0.100.3/32
DNS = 10.0.10.233

[Peer]
PublicKey = i31SGjc19DjX1gaMC8BTGt8AvdgYMeC00T6TiT87uwM=
AllowedIPs = 10.0.10.0/24
Endpoint = vpn.schoepels.com:51820
PersistentKeepalive = 25
```

### Verify tunnel

```bash
sudo wg show
ping -c 4 10.0.10.233
```

### Auto-start on reboot

```bash
sudo systemctl enable wg-quick@wg0
```

---

## Docker Configuration

### Global log rotation + DNS fallback

`/etc/docker/daemon.json`:

```json
{
  "dns": ["1.1.1.1", "8.8.8.8"],
  "dns-opts": ["ndots:1"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

### Proxy network subnet

`proxy_net` uses `172.18.0.0/16` with gateway `172.18.0.1`. SWAG's IP on this network is `172.18.0.6` (may change on container restart — services should use subnet ranges not specific IPs).

---

## Service Security Configuration

### Portainer

- **Ports** restricted to localhost-only: `127.0.0.1:9000`, `127.0.0.1:9443`, `127.0.0.1:8000`
- **Access** via nginx proxy only at `https://portainer.theschoepels.com`
- **IP restricted** to home IP + WireGuard tunnel in both location blocks

Compose file: `/data/proxy/portainer/portainer.yml`

Nginx config: `/data/proxy/letsencrypt/config/nginx/proxy-confs/portainer.subdomain.conf`

```nginx
location / {
    allow 75.86.11.184;      # home WAN IP (covers all LAN Edge Agents)
    allow 10.0.100.3;        # Jupiter WireGuard tunnel
    allow 142.202.188.252;   # Neptune VPS Edge Agent
    deny  all;
    ...
            }
location /api/websocket/ {
    allow 75.86.11.184;      # home WAN IP (covers all LAN Edge Agents)
    allow 10.0.100.3;        # Jupiter WireGuard tunnel
    allow 142.202.188.252;   # Neptune VPS Edge Agent
    deny  all;
    ...
                          }
```
> Port 8000 must remain publicly bound (not localhost-only) for Edge Agent tunnel connections — this is the one Portainer port that legitimately needs to be public.

> If locked out via home IP, connect via WireGuard tunnel — `10.0.100.3` is always allowed.

### Webmin

- **Direct port 10000** closed in UFW
- **Access** via nginx proxy only at `https://jupiter.theschoepels.com`
- **IP restricted** to home IP + WireGuard tunnel
- **proxy_pass** uses `172.18.0.1:10000` (bridge gateway IP)

Nginx config: `/data/proxy/letsencrypt/config/nginx/proxy-confs/jupiter.theschoepels.com.subdomain.conf`

```nginx
location / {
    allow 75.86.11.184;
    allow 10.0.100.3;
    deny  all;
    proxy_pass https://172.18.0.1:10000;
    proxy_ssl_verify off;
}
```

### Bookstack

- **Port 7080** restricted to localhost-only: `127.0.0.1:7080:8080`
- **Access** via SWAG proxy at `https://bookstack.theschoepels.com`
- **Public** — relies on Bookstack's own login

### ntfy

- **Port 2083** restricted to localhost-only: `127.0.0.1:2083:80`
- **Access** via SWAG proxy at `https://ntfy.theschoepels.com`
- **Public** — required for push notifications from any device

### Imagepulse

- **Ports block removed entirely** from compose — SWAG reaches it via internal Docker network
- **Access** via SWAG proxy at `https://imagepulse.theschoepels.com`
- **Public** — relies on webhook secret + Imagepulse's own auth

### WordPress (development)

- **Port 9080** restricted to localhost-only: `127.0.0.1:9080:80`
- **MySQL port 30306** removed entirely — internal container networking only
- **Credentials** in Portainer environment variables
- **wp-config.php** uses `wordpressdb:3306` (internal Docker network)

### Nextcloud

- **No port bindings** — accessed via SWAG on `proxy_net` only ✅
- **Database** on isolated `nextcloud-internal` network only ✅
- **Trusted proxy** fixed to subnet: `172.18.0.0/16`
- **Version:** 33.0.3 (current as of May 2026)

```bash
# Verify trusted proxy
docker exec nextcloud-app php occ config:system:get trusted_proxies --output=json
# Should return: ["172.18.0.0\/16"]
```

### Piwigo (pictures)

- **No port bindings** in compose ✅
- **Public** — family photo gallery

---

## SSL Configuration

### Certificate fix

`ssl.conf` was pointing to SWAG's self-signed fallback cert. Fixed to use Let's Encrypt:

```nginx
ssl_certificate /config/keys/letsencrypt/fullchain.pem;
ssl_certificate_key /config/keys/letsencrypt/privkey.pem;
```

### OCSP stapling disabled

Let's Encrypt ECDSA certificates via E-series intermediates don't include an OCSP URL. Disabled to eliminate nginx warnings:

```nginx
ssl_stapling off;
```

### Certificate renewal hooks

Location: `/data/proxy/letsencrypt/config/etc/letsencrypt/renewal-hooks/`

| Hook | Purpose | Status |
|---|---|---|
| `pre/10-nginx` | Stops nginx during HTTP-01 validation | Active ✅ |
| `deploy/10-default` | Generates pfx and bundle files after renewal | Active ✅ |
| `post/20-mailu-certs.sh` | Copied certs to Mailu (decommissioned) | **Removed** ✅ |

---

## fail2ban Configuration

fail2ban runs in two places on Jupiter:

### SWAG container (nginx protection)

Built into the linuxserver/swag image. Monitors nginx logs directly.

Active jails:
- `nginx-badbots` — blocks known bad bots
- `nginx-botsearch` — blocks directory scanning
- `nginx-http-auth` — blocks repeated auth failures

```bash
# Check status
docker exec swag fail2ban-client status
```

### Host (SSH protection)

Installed natively to protect SSH since SWAG doesn't have access to auth logs.

Config: `/etc/fail2ban/jail.local`

```ini
[DEFAULT]
ignoreip = 127.0.0.1/8 ::1 75.86.11.184

[sshd]
enabled = true
port = 22791
maxretry = 5
bantime = 3600
findtime = 600
```

```bash
# Check SSH jail status
sudo fail2ban-client status sshd

# Verify ignored IPs
sudo fail2ban-client get sshd ignoreip
```

> Home IP `75.86.11.184` is in the ignore list — cannot accidentally self-ban.

---

## Cleanup Performed

### Stale proxy configs removed

- `mailu.subdomain.conf` — mail server decommissioned
- `dockge.subdomain.conf` — container manager removed
- `patchpanda.subdomain.conf` — replaced by imagepulse
- `wordpress.subdomain.save` — stale backup file

### Services removed/disabled

- **Pollinate** — Ubuntu entropy seeding service, unnecessary on production VPS
- **ModemManager** — no modems on a VPS

### Data cleaned up

- `/data/mail/` — leftover SSL certs from decommissioned Mailu
- `post/20-mailu-certs.sh` — cert renewal hook that would have broken renewals

---

## Nginx Proxy Configs

| Domain | Backend | Access |
|---|---|---|
| `bookstack.theschoepels.com` | `bookstack:8080` | Public (Bookstack login) |
| `imagepulse.theschoepels.com` | `imagepulse:3579` | Public (webhook + auth) |
| `jupiter.theschoepels.com` | `172.18.0.1:10000` | IP + WireGuard restricted |
| `nextcloud.theschoepels.com` | `nextcloud-app:443` | Public (Nextcloud login) |
| `ntfy.theschoepels.com` | `ntfy:80` | Public |
| `pictures.theschoepels.com` | `pictures:80` | Public |
| `portainer.theschoepels.com` | `portainer:9000` | IP + WireGuard restricted |

---

## Access Fallback Procedure

If locked out of Portainer or Webmin (home IP changed):

**Option 1 — Connect via WireGuard tunnel** (preferred)
Connect your device to the WireGuard network — `10.0.100.3` is permanently allowed in both configs.

**Option 2 — SSH to Jupiter and update home IP**
```bash
# Update both configs
nano /data/proxy/letsencrypt/config/nginx/proxy-confs/portainer.subdomain.conf
nano /data/proxy/letsencrypt/config/nginx/proxy-confs/jupiter.theschoepels.com.subdomain.conf

# Reload nginx
docker exec swag nginx -s reload
```

---

## Troubleshooting

### Verify all ports correctly bound
```bash
sudo ss -tlnp | grep -v "127.0.0.1\|::1\|\[::1\]"
```
Should only show: SSH (22791), HTTP (80), HTTPS (443)

### Check WireGuard tunnel
```bash
sudo wg show
ping -c 4 10.0.10.233
```

### Check Docker log sizes
```bash
docker ps --no-trunc --format "{{.ID}} {{.Names}}" | while read id name; do
  log="/var/lib/docker/containers/${id}/${id}-json.log"
  if [ -f "$log" ]; then
    size=$(du -sh "$log" | cut -f1)
    echo "$size $name"
  fi
done | sort -rh
```

### Truncate a container log
```bash
sudo truncate -s 0 $(docker inspect --format='{{.LogPath}}' <container-name>)
```

### Webmin not accessible
1. Check iptables rule: `sudo iptables -L INPUT -n | grep 10000`
2. Check Webmin running: `sudo systemctl status webmin`
3. Check SWAG can reach host: `docker exec swag curl -vk https://172.18.0.1:10000 2>&1 | head -5`
4. If bridge changed: `ip link show | grep br-` and update iptables rule

### nginx warnings after reload
```bash
docker exec swag nginx -t
```
Should show only `syntax ok` and `test is successful` with no warnings.

### Certificate renewal test
```bash
docker exec swag certbot renew --dry-run
```

### WireGuard drops after reboot
```bash
sudo systemctl status wg-quick@wg0
sudo systemctl enable wg-quick@wg0
```

---

## Related Services

| Service | URL |
|---|---|
| Bookstack | `https://bookstack.theschoepels.com` |
| Nextcloud | `https://nextcloud.theschoepels.com` |
| Ntfy | `https://ntfy.theschoepels.com` |
| Pictures | `https://pictures.theschoepels.com` |
| Portainer | `https://portainer.theschoepels.com` |
| Webmin | `https://jupiter.theschoepels.com` |
| Imagepulse | `https://imagepulse.theschoepels.com` |
| Dynu DDNS | `https://dynu.com` |
| UniFi Network console | Local LAN access |