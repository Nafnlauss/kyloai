#!/bin/bash
# Script temporário para executar comandos com sudo

if [ "$1" = "playwright-install" ]; then
    echo "628396" | sudo -S npx playwright install chromium
elif [ "$1" = "playwright-deps" ]; then
    echo "628396" | sudo -S npx playwright install-deps
elif [ "$1" = "apt-deps" ]; then
    echo "628396" | sudo -S apt-get update && echo "628396" | sudo -S apt-get install -y libnspr4 libnss3 libasound2t64
elif [ "$1" = "chrome-link" ]; then
    echo "628396" | sudo -S mkdir -p /opt/google/chrome
    echo "628396" | sudo -S ln -sf /usr/bin/chromium /opt/google/chrome/chrome
elif [ "$1" = "test" ]; then
    echo "628396" | sudo -S echo "Sudo funcionando!"
else
    echo "Uso: ./sudo-helper.sh [playwright-install|playwright-deps|apt-deps|chrome-link|test]"
fi