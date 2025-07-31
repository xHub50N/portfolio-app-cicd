#!/bin/bash

SERVICE_NAME="set-static-dns.service"
DNS_IP="192.168.1.23"
SERVICE_PATH="/etc/systemd/system/$SERVICE_NAME"

echo "Tworzę usługę systemd w: $SERVICE_PATH"
cat <<EOF | sudo tee $SERVICE_PATH > /dev/null
[Unit]
Description=Set static DNS in resolv.conf
After=network-online.target
Wants=network-online.target

[Service]
Type=oneshot
ExecStart=/bin/bash -c 'echo "nameserver $DNS_IP" > /etc/resolv.conf'

[Install]
WantedBy=multi-user.target
EOF

echo "Przeładowuję systemd..."
sudo systemctl daemon-reload

echo "Włączam usługę, aby uruchamiała się przy starcie..."
sudo systemctl enable $SERVICE_NAME

echo "Uruchamiam usługę..."
sudo systemctl start $SERVICE_NAME

echo -e "\nZawartość /etc/resolv.conf:"
cat /etc/resolv.conf

echo -e "\nUsługa została utworzona i uruchomiona."
