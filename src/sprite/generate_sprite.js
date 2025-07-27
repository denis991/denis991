const fs = require('fs');
const path = require('path');

const SPRITE_FILE = 'sprite.svg';
const CSS_FILE = 'sprite.css';
const ICON_DIR = __dirname;

function getIconName(filename) {
  // telegram.svg -> telegram
  return path.basename(filename, '.svg').toLowerCase();
}

function extractSvgContent(svg) {
  // 1. shields.io: ищем base64-иконку
  const base64Match = svg.match(/<image[^>]+href="data:image\/svg\+xml;base64,([^"]+)"/i);
  if (base64Match) {
    const base64 = base64Match[1];
    const decoded = Buffer.from(base64, 'base64').toString('utf8');
    const innerSvgMatch = decoded.match(/<svg[^>]*viewBox="([^"]+)"[^>]*>([\s\S]*?)<\/svg>/i);
    if (innerSvgMatch) {
      return { viewBox: innerSvgMatch[1], content: innerSvgMatch[2].trim() };
    }
  }
  // 2. Обычный svg
  const svgMatch = svg.match(/<svg[^>]*viewBox="([^"]+)"[^>]*>([\s\S]*?)<\/svg>/i);
  if (svgMatch) {
    return { viewBox: svgMatch[1], content: svgMatch[2].trim() };
  }
  return null;
}

const files = fs.readdirSync(ICON_DIR).filter(f => f.endsWith('.svg') && f !== SPRITE_FILE);
let symbols = '';
let css = '';
let ids = [];

files.forEach(file => {
  const svg = fs.readFileSync(path.join(ICON_DIR, file), 'utf8');
  const id = getIconName(file);
  const result = extractSvgContent(svg);
  if (result && result.content) {
    symbols += `<symbol id="${id}" viewBox="${result.viewBox}">${result.content}</symbol>\n`;
    css += `.icon-${id} { width: 1em; height: 1em; display: inline-block; vertical-align: middle; background: none; }\n.icon-${id} svg { width: 100%; height: 100%; }\n`;
    ids.push(id);
  } else {
    console.warn('Пропущен файл (нет валидной иконки):', file);
  }
});

const sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n${symbols}</svg>\n`;
fs.writeFileSync(path.join(ICON_DIR, SPRITE_FILE), sprite, 'utf8');
fs.writeFileSync(path.join(ICON_DIR, CSS_FILE), css, 'utf8');

// Для demo.html
fs.writeFileSync(path.join(ICON_DIR, 'icon_ids.json'), JSON.stringify(ids, null, 2), 'utf8');

console.log(`Sprite and CSS generated! Icons: ${ids.length}`);