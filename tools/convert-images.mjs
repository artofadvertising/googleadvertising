// Maakt AVIF- en WebP-varianten (480, 800 en 1200 breed) van elke foto in public/assets.
// Gebaseerd op het bureau-sjabloon (vindbaar-maken, templates/images/convert.mjs).
// De site zelf heeft geen dependencies; sharp installeer je alleen om dit script te draaien:
//
//   mkdir -p /tmp/imgtool && cd /tmp/imgtool && npm init -y >/dev/null && npm install sharp@0.33.5 --silent
//   NODE_PATH=/tmp/imgtool/node_modules node tools/convert-images.mjs
//
// Nieuwe foto: zet de JPG (2000 breed) in public/assets, draai dit script en neem de naam op in PHOTOS in build.mjs.
import { createRequire } from 'node:module';
import { readdirSync, statSync } from 'node:fs';
import { join, basename } from 'node:path';
const sharp = createRequire(import.meta.url)('sharp');

const dir = process.argv[2] || 'public/assets';
const widths = [480, 800, 1200];
const skip = (f) => f.startsWith('og-'); // deelafbeeldingen blijven JPG
for (const f of readdirSync(dir).filter((f) => f.endsWith('.jpg') && !skip(f))) {
  const src = join(dir, f);
  const name = basename(f, '.jpg');
  const meta = await sharp(src).metadata();
  const sizes = [];
  for (const w of widths.filter((w) => w <= meta.width)) {
    const base = sharp(src).resize({ width: w, withoutEnlargement: true });
    const avif = join(dir, `${name}-${w}.avif`);
    const webp = join(dir, `${name}-${w}.webp`);
    await base.clone().avif({ quality: 52, effort: 4 }).toFile(avif);
    await base.clone().webp({ quality: 76 }).toFile(webp);
    sizes.push(`${w}: avif ${Math.round(statSync(avif).size / 1024)}K, webp ${Math.round(statSync(webp).size / 1024)}K`);
  }
  console.log(`${name} (${meta.width}x${meta.height}, jpg ${Math.round(statSync(src).size / 1024)}K) -> ${sizes.join(' | ')}`);
}
