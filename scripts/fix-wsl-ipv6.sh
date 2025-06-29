#!/bin/bash
# Script para desabilitar IPv6 no WSL e forçar IPv4

echo "Desabilitando IPv6 no WSL..."

# Adiciona configuração para desabilitar IPv6
sudo sysctl -w net.ipv6.conf.all.disable_ipv6=1
sudo sysctl -w net.ipv6.conf.default.disable_ipv6=1
sudo sysctl -w net.ipv6.conf.lo.disable_ipv6=1

# Torna permanente
echo "net.ipv6.conf.all.disable_ipv6 = 1" | sudo tee -a /etc/sysctl.conf
echo "net.ipv6.conf.default.disable_ipv6 = 1" | sudo tee -a /etc/sysctl.conf
echo "net.ipv6.conf.lo.disable_ipv6 = 1" | sudo tee -a /etc/sysctl.conf

# Reinicia a rede
sudo service networking restart

echo "IPv6 desabilitado. Testando conexão..."
curl -4 https://supabase.com