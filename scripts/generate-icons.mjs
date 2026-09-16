import sharp from "sharp";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const publicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public");

const svg = (fontSize) => `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="96" fill="#0b0f0d"/>
  <text x="256" y="290" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="${fontSize}" fill="#39e07a">IS</text>
</svg>`;

async function run() {
  const sizes = [
    { file: "web-app-manifest-192x192.png", size: 192 },
    { file: "web-app-manifest-512x512.png", size: 512 },
    { file: "apple-touch-icon.png", size: 180 },
    { file: "favicon-96x96.png", size: 96 },
  ];

  for (const { file, size } of sizes) {
    await sharp(Buffer.from(svg(220))).resize(size, size).png().toFile(path.join(publicDir, file));
    console.log("wrote", file);
  }

  writeFileSync(path.join(publicDir, "favicon.svg"), svg(220).trim());
  await sharp(Buffer.from(svg(220))).resize(32, 32).png().toFile(path.join(publicDir, "favicon.png"));
  console.log("wrote favicon.svg, favicon.png");
}

run();
