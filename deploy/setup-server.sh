#!/bin/bash
# ============================================================
# Grinalda EC2 Server Setup Script
# 새 EC2 인스턴스에서 이 스크립트를 실행하면 보안 설정이 자동 적용됩니다.
#
# 사용법:
#   chmod +x deploy/setup-server.sh
#   sudo ./deploy/setup-server.sh
# ============================================================

set -e

echo "============================================"
echo "  Grinalda Server Security Setup"
echo "============================================"

# ── 1. 시스템 업데이트 ──
echo ""
echo "[1/5] 시스템 패키지 업데이트..."
apt update && apt upgrade -y

# ── 2. Nginx 설치 및 구성 ──
echo ""
echo "[2/5] Nginx 설치 및 구성..."
apt install nginx -y

# rate limiting zone 추가 (nginx.conf의 http 블록)
if ! grep -q "limit_req_zone.*zone=app" /etc/nginx/nginx.conf; then
    sed -i '/http {/a\\tlimit_req_zone $binary_remote_addr zone=app:10m rate=10r/s;' /etc/nginx/nginx.conf
    echo "  ✅ Rate limiting zone 추가됨"
fi

# Nginx 설정 파일 복사
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cp "$SCRIPT_DIR/nginx/grinalda.conf" /etc/nginx/sites-available/grinalda

# 기본 설정 제거 및 grinalda 활성화
rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/grinalda /etc/nginx/sites-enabled/grinalda

# Nginx 문법 검사 및 재시작
nginx -t && systemctl restart nginx && systemctl enable nginx
echo "  ✅ Nginx 설치 및 구성 완료"

# ── 3. HTTPS 인증서 설치 (Let's Encrypt) ──
echo ""
echo "[3/5] Let's Encrypt HTTPS 인증서 설정..."
apt install certbot python3-certbot-nginx -y

# 도메인이 설정되어 있으면 자동 발급
DOMAIN=$(grep "server_name" /etc/nginx/sites-available/grinalda | head -1 | awk '{print $2}' | tr -d ';')
if [ "$DOMAIN" != "_" ] && [ -n "$DOMAIN" ]; then
    echo "  도메인 감지: $DOMAIN"
    certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --email admin@$DOMAIN || {
        echo "  ⚠️  인증서 발급 실패. 도메인 DNS 설정을 확인 후 수동으로 실행하세요:"
        echo "     sudo certbot --nginx -d $DOMAIN"
    }
else
    echo "  ⚠️  도메인이 '_'로 설정되어 있습니다."
    echo "     grinalda.conf의 server_name을 실제 도메인으로 변경 후 아래 명령 실행:"
    echo "     sudo certbot --nginx -d your-domain.com"
fi

# 자동 갱신 cron 확인
systemctl enable certbot.timer 2>/dev/null || true
echo "  ✅ Certbot 설치 완료 (90일마다 자동 갱신)"

# ── 4. fail2ban 설치 및 구성 ──
echo ""
echo "[4/5] fail2ban 설치 및 구성..."
apt install fail2ban -y

# Next.js 공격 탐지 필터
cat > /etc/fail2ban/filter.d/nginx-nextjs-exploit.conf << 'EOF'
[Definition]
failregex = ^<HOST> .* "POST .* HTTP/.*" (400|403|500) .* "(Go-http-client|python-requests|python-urllib).*"
            ^<HOST> .* "POST .* HTTP/.*" .* "next-action".*
ignoreregex =
EOF

# fail2ban jail 설정
cat > /etc/fail2ban/jail.d/nginx-nextjs.conf << 'EOF'
[nginx-nextjs-exploit]
enabled = true
filter = nginx-nextjs-exploit
logpath = /var/log/nginx/access.log
maxretry = 3
findtime = 60
bantime = 3600
action = iptables-multiport[name=NextJSExploit, port="80,443"]
EOF

# 기본 SSH 보호 강화
cat > /etc/fail2ban/jail.d/ssh.conf << 'EOF'
[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
findtime = 300
bantime = 3600
EOF

systemctl restart fail2ban && systemctl enable fail2ban
echo "  ✅ fail2ban 구성 완료"

# ── 5. 방화벽 (UFW) 설정 ──
echo ""
echo "[5/5] UFW 방화벽 설정..."
apt install ufw -y

ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
# 3030 포트는 열지 않음 (Nginx가 내부에서 접근)

echo "y" | ufw enable
echo "  ✅ UFW 방화벽 설정 완료"

# ── 완료 ──
echo ""
echo "============================================"
echo "  ✅ 서버 보안 설정 완료!"
echo "============================================"
echo ""
echo "  적용된 항목:"
echo "  ✅ Nginx 리버스 프록시 (포트 80/443 → 127.0.0.1:3030)"
echo "  ✅ Rate Limiting (10 req/s per IP)"
echo "  ✅ 봇/스캐너 User-Agent 차단"
echo "  ✅ Server Action 외부 호출 차단"
echo "  ✅ fail2ban (SSH + Next.js exploit 탐지)"
echo "  ✅ UFW 방화벽 (22, 80, 443만 허용)"
echo ""
echo "  ⚠️  남은 작업:"
echo "  1. grinalda.conf의 server_name을 실제 도메인으로 변경"
echo "  2. sudo certbot --nginx -d your-domain.com (HTTPS 발급)"
echo "  3. AWS 콘솔에서 Security Group 수정:"
echo "     - 포트 3030 인바운드 삭제"
echo "     - 포트 5432/6379 인바운드 삭제"
echo "     - SSH(22)는 내 IP만 허용"
echo ""
