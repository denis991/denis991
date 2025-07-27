#!/bin/bash
# Скачивает все shields.io SVG из README.md в текущую папку, имена — только логотип (telegram.svg, mongodb.svg)
set -e
cd "$(dirname "$0")"
README="../../README.md"

# Удаляем старые svg (кроме sprite.svg)
find . -maxdepth 1 -type f -name '*.svg' ! -name 'sprite.svg' -delete

# Ищем shields.io ссылки
grep -oE 'src="https://img\.shields\.io[^\"]+"' "$README" | \
  sed -E 's/src="(https:\/\/img\.shields\.io[^"]+)"/\1/' | \
  while read -r url; do
    # Извлекаем logo=telegram или logo=mongodb
    logo=$(echo "$url" | grep -oE 'logo=[^&"]+' | sed 's/logo=//')
    # Если не найден logo, берём часть после badge/
    if [ -z "$logo" ]; then
      logo=$(echo "$url" | sed -E 's#.*/badge/([^/?]+).*#\1#' | cut -d'-' -f1)
    fi
    # В нижний регистр
    logo=$(echo "$logo" | tr 'A-Z' 'a-z')
    fname="${logo}.svg"
    echo "Скачиваю $url -> $fname"
    curl -sSL "$url" -o "$fname"
    sleep 0.1
  done

echo "Готово! Все shields.io SVG скачаны."
# chmod +x download_svgs.sh && ./download_svgs.sh
# cd ../sprite && node generate_sprite.js