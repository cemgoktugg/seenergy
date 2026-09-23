#!/usr/bin/env node
/**
 * Generate the mock asset library.
 *
 *   node scripts/mock/generate-assets.mjs
 *
 * Everything written here is produced locally from code. Nothing is copied
 * from the reference site and nothing is hotlinked. The output has to be good
 * enough that the homepage reads as a real storefront in a client review —
 * so these are drawn device illustrations on a clean field, not grey boxes.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const OUT = 'public/mock';

const svg = (w, h, body, extra = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img">${extra}${body}</svg>\n`;

/* ------------------------------------------------------------------ */
/* shared pieces                                                       */
/* ------------------------------------------------------------------ */

const shadow = (cx, cy, rx, ry) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="rgba(15,23,42,.13)"/>`;

const bodyGradient = (id, from, to) => `
  <linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>
  </linearGradient>`;

const glossGradient = (id) => `
  <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#fff" stop-opacity=".55"/>
    <stop offset="1" stop-color="#fff" stop-opacity="0"/>
  </linearGradient>`;

/* ------------------------------------------------------------------ */
/* product illustrations — 600 x 600 on white                          */
/* ------------------------------------------------------------------ */

const DEVICES = {
  receiver: (c) => `
    ${shadow(300, 430, 190, 20)}
    <rect x="110" y="250" width="380" height="150" rx="14" fill="url(#g)"/>
    <rect x="110" y="250" width="380" height="44" rx="14" fill="url(#gloss)"/>
    <rect x="150" y="300" width="130" height="52" rx="7" fill="#0d1117"/>
    <text x="215" y="337" font-family="monospace" font-size="30" fill="${c.accent}" text-anchor="middle">1080</text>
    <circle cx="330" cy="326" r="15" fill="#0d1117"/><circle cx="330" cy="326" r="6" fill="${c.accent}"/>
    <rect x="370" y="315" width="90" height="9" rx="4" fill="#0d1117" opacity=".6"/>
    <rect x="370" y="334" width="60" height="9" rx="4" fill="#0d1117" opacity=".35"/>`,

  remote: (c) => `
    ${shadow(300, 500, 90, 16)}
    <rect x="215" y="110" width="170" height="380" rx="42" fill="url(#g)"/>
    <rect x="215" y="110" width="170" height="150" rx="42" fill="url(#gloss)"/>
    <circle cx="300" cy="175" r="26" fill="${c.accent}"/>
    <path d="M292 166l18 9-18 9z" fill="#fff"/>
    ${[0, 1, 2, 3, 4]
      .map(
        (r) =>
          [0, 1, 2]
            .map(
              (col) =>
                `<rect x="${248 + col * 38}" y="${240 + r * 42}" width="28" height="26" rx="8" fill="#0d1117" opacity=".55"/>`,
            )
            .join(''),
      )
      .join('')}`,

  speaker: (c) => `
    ${shadow(300, 470, 150, 18)}
    <rect x="150" y="140" width="300" height="320" rx="28" fill="url(#g)"/>
    <rect x="150" y="140" width="300" height="110" rx="28" fill="url(#gloss)"/>
    <circle cx="300" cy="290" r="98" fill="#111820"/>
    <circle cx="300" cy="290" r="80" fill="none" stroke="#2b3440" stroke-width="6"/>
    <circle cx="300" cy="290" r="42" fill="#1d2530"/>
    <circle cx="300" cy="290" r="16" fill="${c.accent}"/>
    <rect x="230" y="418" width="140" height="12" rx="6" fill="#0d1117" opacity=".5"/>`,

  camera: (c) => `
    ${shadow(300, 460, 130, 18)}
    <rect x="270" y="300" width="60" height="130" rx="12" fill="#c9ced6"/>
    <ellipse cx="300" cy="430" rx="95" ry="18" fill="#aeb5be"/>
    <rect x="150" y="170" width="300" height="150" rx="70" fill="url(#g)"/>
    <rect x="150" y="170" width="300" height="60" rx="60" fill="url(#gloss)"/>
    <circle cx="255" cy="245" r="52" fill="#0d1117"/>
    <circle cx="255" cy="245" r="34" fill="#12324d"/>
    <circle cx="243" cy="233" r="11" fill="#7fd3ff" opacity=".85"/>
    <circle cx="370" cy="245" r="9" fill="${c.accent}"/>`,

  ledbar: (c) => `
    ${shadow(300, 420, 210, 14)}
    ${[0, 1, 2]
      .map(
        (i) => `<g transform="translate(0 ${i * 62})">
      <rect x="90" y="230" width="420" height="30" rx="8" fill="url(#g)"/>
      ${Array.from({ length: 9 }, (_, k) => `<rect x="${112 + k * 44}" y="238" width="26" height="14" rx="4" fill="${c.accent}"/>`).join('')}
    </g>`,
      )
      .join('')}`,

  adapter: (c) => `
    ${shadow(300, 450, 140, 18)}
    <rect x="180" y="180" width="240" height="240" rx="26" fill="url(#g)"/>
    <rect x="180" y="180" width="240" height="90" rx="26" fill="url(#gloss)"/>
    <rect x="216" y="240" width="168" height="70" rx="10" fill="#0d1117" opacity=".78"/>
    <text x="300" y="288" font-family="sans-serif" font-weight="700" font-size="34" fill="${c.accent}" text-anchor="middle">12V</text>
    <rect x="252" y="336" width="96" height="10" rx="5" fill="#0d1117" opacity=".4"/>
    <path d="M420 300h70v22h-70z" fill="#b9bfc7"/>
    <circle cx="516" cy="311" r="26" fill="#8f979f"/>`,

  headunit: (c) => `
    ${shadow(300, 430, 200, 16)}
    <rect x="90" y="215" width="420" height="190" rx="16" fill="url(#g)"/>
    <rect x="90" y="215" width="420" height="60" rx="16" fill="url(#gloss)"/>
    <rect x="180" y="248" width="240" height="98" rx="8" fill="#06121f"/>
    <text x="300" y="312" font-family="monospace" font-size="42" fill="${c.accent}" text-anchor="middle">87.5</text>
    <circle cx="135" cy="300" r="30" fill="#1b222b"/><circle cx="135" cy="300" r="12" fill="${c.accent}"/>
    <circle cx="465" cy="300" r="30" fill="#1b222b"/><circle cx="465" cy="300" r="12" fill="#59606a"/>
    ${Array.from({ length: 5 }, (_, k) => `<rect x="${190 + k * 46}" y="362" width="34" height="12" rx="5" fill="#1b222b"/>`).join('')}`,

  router: (c) => `
    ${shadow(300, 440, 160, 16)}
    ${[[150, -22], [300, 0], [450, 22]]
      .map(
        ([x, rot]) =>
          `<g transform="rotate(${rot} ${x} 300)"><rect x="${x - 9}" y="120" width="18" height="180" rx="9" fill="#3b434e"/></g>`,
      )
      .join('')}
    <rect x="130" y="290" width="340" height="130" rx="18" fill="url(#g)"/>
    <rect x="130" y="290" width="340" height="46" rx="18" fill="url(#gloss)"/>
    ${Array.from({ length: 4 }, (_, k) => `<circle cx="${190 + k * 55}" cy="382" r="8" fill="${k < 3 ? c.accent : '#4b5563'}"/>`).join('')}`,

  meter: (c) => `
    ${shadow(300, 470, 130, 16)}
    <rect x="175" y="120" width="250" height="330" rx="22" fill="url(#g)"/>
    <rect x="175" y="120" width="250" height="110" rx="22" fill="url(#gloss)"/>
    <rect x="205" y="155" width="190" height="86" rx="8" fill="#0d2018"/>
    <text x="300" y="215" font-family="monospace" font-size="40" fill="#7dffb0" text-anchor="middle">220</text>
    <circle cx="300" cy="320" r="58" fill="#1b222b"/>
    <circle cx="300" cy="320" r="46" fill="none" stroke="${c.accent}" stroke-width="5" stroke-dasharray="6 8"/>
    <rect x="294" y="278" width="12" height="34" rx="6" fill="${c.accent}"/>
    <circle cx="240" cy="415" r="13" fill="#c02020"/><circle cx="360" cy="415" r="13" fill="#1b222b"/>`,

  cable: (c) => `
    ${shadow(300, 470, 150, 16)}
    <g fill="none" stroke="url(#g)" stroke-width="26" stroke-linecap="round">
      <path d="M170 250c70-60 190-60 260 0s-40 130-110 90 20-140 130-70"/>
    </g>
    <g fill="none" stroke="${c.accent}" stroke-width="6" stroke-dasharray="3 22" stroke-linecap="round">
      <path d="M170 250c70-60 190-60 260 0s-40 130-110 90 20-140 130-70"/>
    </g>
    <rect x="120" y="228" width="70" height="44" rx="10" fill="#8f979f"/>
    <rect x="430" y="368" width="70" height="44" rx="10" fill="#8f979f"/>`,

  battery: (c) => `
    ${shadow(300, 450, 130, 16)}
    <rect x="200" y="140" width="200" height="290" rx="18" fill="url(#g)"/>
    <rect x="200" y="140" width="200" height="100" rx="18" fill="url(#gloss)"/>
    <rect x="262" y="112" width="76" height="32" rx="8" fill="#9aa1a9"/>
    <rect x="228" y="250" width="144" height="60" rx="8" fill="#0d1117" opacity=".7"/>
    <path d="M300 262l-26 40h22l-8 34 34-46h-22z" fill="${c.accent}"/>
    <rect x="240" y="342" width="120" height="10" rx="5" fill="#0d1117" opacity=".35"/>
    <rect x="240" y="366" width="82" height="10" rx="5" fill="#0d1117" opacity=".22"/>`,

  monitor: (c) => `
    ${shadow(300, 480, 160, 16)}
    <rect x="90" y="130" width="420" height="256" rx="14" fill="#2b3440"/>
    <rect x="102" y="142" width="396" height="216" rx="8" fill="url(#screen)"/>
    <rect x="102" y="142" width="396" height="90" rx="8" fill="url(#gloss)"/>
    <rect x="270" y="386" width="60" height="52" fill="#9aa1a9"/>
    <rect x="200" y="436" width="200" height="18" rx="9" fill="#7f878f"/>
    <circle cx="300" cy="372" r="4" fill="${c.accent}"/>`,

  /* --- drawn for the brand showcases ---------------------------------
     A brand band shows four products from one brand side by side, and with
     twelve device drawings each of those bands came out as the same silhouette
     in four finishes — four identical monitors, four identical receivers. These
     six give every featured brand at least two distinct shapes. */

  aio: (c) => `
    ${shadow(300, 500, 175, 16)}
    <rect x="70" y="110" width="460" height="300" rx="18" fill="url(#g)"/>
    <rect x="86" y="126" width="428" height="248" rx="10" fill="url(#screen)"/>
    <rect x="86" y="126" width="428" height="104" rx="10" fill="url(#gloss)"/>
    <circle cx="300" cy="392" r="5" fill="${c.accent}"/>
    <path d="M252 410h96l26 62h-148z" fill="#9aa1a9"/>
    <rect x="186" y="470" width="228" height="18" rx="9" fill="#7f878f"/>`,

  dome: (c) => `
    ${shadow(300, 400, 145, 16)}
    <ellipse cx="300" cy="250" rx="150" ry="122" fill="url(#g)"/>
    <ellipse cx="300" cy="250" rx="150" ry="122" fill="url(#gloss)" opacity=".5"/>
    <rect x="138" y="128" width="324" height="74" rx="16" fill="#c9ced6"/>
    <circle cx="300" cy="290" r="54" fill="#0d1117"/>
    <circle cx="300" cy="290" r="36" fill="#12324d"/>
    <circle cx="285" cy="275" r="11" fill="#7fd3ff" opacity=".85"/>
    <circle cx="398" cy="252" r="9" fill="${c.accent}"/>`,

  nvr: (c) => `
    ${shadow(300, 420, 200, 18)}
    <rect x="80" y="248" width="440" height="126" rx="12" fill="url(#g)"/>
    <rect x="80" y="248" width="440" height="42" rx="12" fill="url(#gloss)"/>
    <rect x="108" y="296" width="152" height="48" rx="6" fill="#0d1117"/>
    <text x="184" y="330" font-family="monospace" font-size="26" fill="${c.accent}" text-anchor="middle">REC</text>
    <rect x="292" y="300" width="196" height="9" rx="4" fill="#0d1117" opacity=".35"/>
    ${Array.from(
      { length: 6 },
      (_, k) =>
        `<circle cx="${300 + k * 34}" cy="332" r="7" fill="${k === 0 ? c.accent : '#4b5563'}"/>`,
    ).join('')}`,

  column: (c) => `
    ${shadow(300, 500, 85, 15)}
    <rect x="232" y="90" width="136" height="398" rx="16" fill="url(#g)"/>
    <rect x="232" y="90" width="136" height="150" rx="16" fill="url(#gloss)"/>
    ${[0, 1, 2, 3]
      .map(
        (i) => `<circle cx="300" cy="${152 + i * 88}" r="36" fill="#111820"/>
      <circle cx="300" cy="${152 + i * 88}" r="15" fill="${c.accent}" opacity=".85"/>`,
      )
      .join('')}
    <rect x="252" y="462" width="96" height="12" rx="6" fill="#0d1117" opacity=".45"/>`,

  acremote: (c) => `
    ${shadow(300, 478, 78, 14)}
    <rect x="216" y="132" width="168" height="330" rx="26" fill="url(#g)"/>
    <rect x="216" y="132" width="168" height="120" rx="26" fill="url(#gloss)"/>
    <rect x="242" y="162" width="116" height="72" rx="8" fill="#0d2018"/>
    <text x="300" y="212" font-family="monospace" font-size="30" fill="#7dffb0" text-anchor="middle">24</text>
    <circle cx="300" cy="300" r="30" fill="${c.accent}"/>
    <path d="M286 300h28M300 286v28" stroke="#fff" stroke-width="6" stroke-linecap="round"/>
    ${[0, 1]
      .map((r) =>
        [0, 1, 2]
          .map(
            (col) =>
              `<rect x="${244 + col * 40}" y="${356 + r * 44}" width="30" height="26" rx="8" fill="#0d1117" opacity=".5"/>`,
          )
          .join(''),
      )
      .join('')}`,

  /* Drawn as an offset dish seen at an angle, not face on: a near-circle with
     a stick reads as a dark ball rather than an antenna. The narrower ellipse,
     the concentric rims and the LNB arm coming forward are what make the shape
     legible at card size. */
  dish: (c) => `
    ${shadow(300, 505, 120, 15)}
    <rect x="292" y="300" width="16" height="170" rx="8" fill="#8f979f"/>
    <rect x="236" y="462" width="128" height="18" rx="9" fill="#7f878f"/>
    <g transform="rotate(-14 292 250)">
      <ellipse cx="292" cy="250" rx="126" ry="170" fill="url(#g)"/>
      <ellipse cx="292" cy="250" rx="126" ry="170" fill="url(#gloss)" opacity=".45"/>
      <ellipse cx="292" cy="250" rx="96" ry="138" fill="#0d1117" opacity=".07"/>
      <ellipse cx="292" cy="250" rx="58" ry="86" fill="#0d1117" opacity=".05"/>
    </g>
    <rect x="300" y="243" width="118" height="12" rx="6" fill="#9aa1a9" transform="rotate(18 300 243)"/>
    <circle cx="410" cy="286" r="26" fill="${c.accent}"/>
    <circle cx="410" cy="286" r="11" fill="#0d1117" opacity=".35"/>`,
};

const FINISHES = [
  { name: 'graphite', from: '#525b66', to: '#2b3440', accent: '#ffb020' },
  { name: 'black', from: '#3a4048', to: '#161b21', accent: '#4fc3f7' },
  { name: 'silver', from: '#e6e9ed', to: '#b6bcc4', accent: '#ff8a00' },
  { name: 'white', from: '#ffffff', to: '#d7dce2', accent: '#2196f3' },
];

/**
 * `transparent` drops the white plate behind the device.
 *
 * The plated version is right for a product card, which is white anyway. On a
 * coloured surface — the amber category tiles — that plate shows up as a white
 * box around the product. Blending it away is not a fix: `multiply` against
 * amber turns the device brown, and dropping the blend puts the box back. A
 * device drawn on nothing composites correctly onto any background.
 */
function productSvg(device, finish, { transparent = false } = {}) {
  const defs = `<defs>
    ${bodyGradient('g', finish.from, finish.to)}
    ${glossGradient('gloss')}
    <linearGradient id="screen" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#12314f"/><stop offset=".5" stop-color="#2b6fa8"/><stop offset="1" stop-color="#0d1b2a"/>
    </linearGradient>
  </defs>`;
  const plate = transparent ? '' : '<rect width="600" height="600" fill="#fff"/>';
  return svg(600, 600, `${plate}${DEVICES[device](finish)}`, defs);
}

/* ------------------------------------------------------------------ */
/* decorative banner backgrounds                                       */
/* ------------------------------------------------------------------ */

function techBanner(w, h, a, b, accent, seed = 1) {
  const rings = Array.from(
    { length: 5 },
    (_, i) =>
      `<circle cx="${w * (0.72 + 0.03 * seed)}" cy="${h / 2}" r="${60 + i * 55}" fill="none" stroke="${accent}" stroke-opacity="${0.16 - i * 0.025}" stroke-width="2"/>`,
  ).join('');
  const wave = Array.from({ length: 26 }, (_, i) => {
    const x = (w / 26) * i;
    const amp = 14 + ((i * 7 + seed * 11) % 30);
    return `<rect x="${x}" y="${h / 2 - amp}" width="4" height="${amp * 2}" rx="2" fill="${accent}" fill-opacity="${0.14 + (i % 5) * 0.05}"/>`;
  }).join('');

  return svg(
    w,
    h,
    `<rect width="${w}" height="${h}" fill="url(#bg)"/>${rings}${wave}
     <path d="M0 ${h} L${w * 0.42} ${h * 0.2} L${w * 0.52} ${h} Z" fill="#fff" fill-opacity=".05"/>`,
    `<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/>
    </linearGradient></defs>`,
  );
}

function promoTile(w, h, filled, accent) {
  return svg(
    w,
    h,
    filled
      ? `<rect width="${w}" height="${h}" fill="${accent}"/>
         <circle cx="${w * 0.78}" cy="${h * 0.5}" r="${h * 0.42}" fill="#fff" fill-opacity=".16"/>
         <circle cx="${w * 0.78}" cy="${h * 0.5}" r="${h * 0.28}" fill="#fff" fill-opacity=".2"/>`
      : `<rect width="${w}" height="${h}" fill="#fff"/>
         <rect x="0" y="${h * 0.24}" width="${w * 0.58}" height="${h * 0.3}" fill="${accent}"/>
         <circle cx="${w * 0.78}" cy="${h * 0.5}" r="${h * 0.34}" fill="${accent}" fill-opacity=".14"/>`,
  );
}

function brandMark(name, index) {
  // Cool-side hues only: a brand wall of 45 logos is the easiest place for a
  // stray brown or green to break the identity.
  const hues = ['#3f4652', '#2f6f9e', '#4a2e9c', '#0e7c86', '#742d8e', '#2b3440'];
  const fill = hues[index % hues.length];
  const initials = name.slice(0, 2).toUpperCase();
  return svg(
    220,
    90,
    `<rect width="220" height="90" fill="#fff"/>
     <rect x="12" y="26" width="38" height="38" rx="10" fill="${fill}"/>
     <text x="31" y="52" font-family="sans-serif" font-size="18" font-weight="800" fill="#fff" text-anchor="middle">${initials}</text>
     <text x="60" y="53" font-family="sans-serif" font-size="21" font-weight="700" fill="${fill}">${name}</text>`,
  );
}

/* ------------------------------------------------------------------ */

async function main() {
  const dirs = [
    'products',
    'products/cutout',
    'hero',
    'campaigns',
    'categories',
    'brands',
    'blog',
  ];
  for (const d of dirs) await mkdir(path.join(OUT, d), { recursive: true });

  let count = 0;

  // Products: every device in every finish -> 12 x 4 = 48 distinct images,
  // each also written as a transparent cutout for use on coloured surfaces.
  for (const device of Object.keys(DEVICES)) {
    for (const finish of FINISHES) {
      await writeFile(
        path.join(OUT, 'products', `${device}-${finish.name}.svg`),
        productSvg(device, finish),
        'utf8',
      );
      await writeFile(
        path.join(OUT, 'products', 'cutout', `${device}-${finish.name}.svg`),
        productSvg(device, finish, { transparent: true }),
        'utf8',
      );
      count += 2;
    }
  }

  // Hero slides — 1320 x 445, matching the measured hero box.
  /* SEENERGY palette. The identity runs teal → blue → indigo → purple, so the
     banner art stays on that arc: no green, no amber. Each triple is
     [gradient from, gradient to, accent] and every accent is a cool stop, which
     is what stops the hero from fighting the header's near-black chrome. */
  const heroes = [
    ['#0a1b3a', '#1c3f8f', '#35c6d8'], // teal-blue
    ['#161033', '#4a2e9c', '#9b6bff'], // indigo-violet
    ['#06282b', '#0e6f78', '#35e0d0'], // deep teal
  ];
  for (const [i, [a, b, accent]] of heroes.entries()) {
    await writeFile(
      path.join(OUT, 'hero', `hero-${i + 1}.svg`),
      techBanner(1320, 445, a, b, accent, i + 1),
      'utf8',
    );
    count += 1;
  }

  // Section banners — 1320 x 66, the measured section-header band.
  const sections = [
    ['all-in-one', '#1c1537', '#4a2e9c', '#9b6bff'],
    ['oto-teypler', '#101f3a', '#2e55c8', '#5ad2e6'],
    ['guvenlik', '#0a2429', '#0e7c86', '#35e0d0'],
    ['ses-sistemleri', '#1d1338', '#742d8e', '#c07ad8'],
  ];
  for (const [name, a, b, accent] of sections) {
    await writeFile(
      path.join(OUT, 'campaigns', `section-${name}.svg`),
      techBanner(1320, 66, a, b, accent, name.length),
      'utf8',
    );
    count += 1;
  }

  // Wide campaign banners — 1320 x 180.
  for (const [i, [a, b, accent]] of heroes.entries()) {
    await writeFile(
      path.join(OUT, 'campaigns', `wide-${i + 1}.svg`),
      techBanner(1320, 180, a, b, accent, i + 4),
      'utf8',
    );
    count += 1;
  }

  // Half-width trust banners — 650 x 150.
  for (const [i, [a, b, accent]] of heroes.slice(0, 2).entries()) {
    await writeFile(
      path.join(OUT, 'campaigns', `half-${i + 1}.svg`),
      techBanner(650, 150, a, b, accent, i + 9),
      'utf8',
    );
    count += 1;
  }

  // Category promo tiles — 313 x 175, alternating filled / outlined.
  const tiles = [
    'uydu-sistemleri',
    'ses-sistemleri',
    'led-aydinlatma',
    'ev-teknolojileri',
    'elektronik-malzemeler',
    'fener-isildak',
    'olcu-aletleri',
    'guvenlik-sistemleri',
  ];
  for (const [i, name] of tiles.entries()) {
    await writeFile(
      path.join(OUT, 'categories', `${name}.svg`),
      // Indigo, matching --color-brand: the filled tiles and the component's
      // own `bg-brand` fill have to be the same colour or the tile art shows
      // as a patch inside the tile.
      promoTile(313, 175, i % 2 === 0, '#4a2e9c'),
      'utf8',
    );
    count += 1;
  }

  // Blog cover images — 313 x 195.
  for (const [i, [a, b, accent]] of [...heroes, heroes[0]].entries()) {
    await writeFile(
      path.join(OUT, 'blog', `blog-${i + 1}.svg`),
      techBanner(313, 195, a, b, accent, i + 2),
      'utf8',
    );
    count += 1;
  }

  // Brand marks.
  const brands = [
    'Voltra', 'Nexora', 'Kablonis', 'Sunmax', 'Orbisat', 'Lumenta',
    'Akuform', 'Tekniva', 'Sonora', 'Provista', 'Elektroma', 'Digiwave',
    'Amperis', 'Cabletek', 'Vizyontek', 'Megavolt', 'Sesyapı', 'Ledora',
    'Kumandax', 'Servisan', 'Metrion', 'Bataryam', 'Antenix', 'Fotokam',
    'Powerin', 'Sinyalis', 'Tamirix', 'Optivolt', 'Rezonans', 'Devrelab',
    'Elektromar', 'Voltbir', 'Kabloteknik', 'Sesmar', 'Antenpro', 'Ledvolt',
    'Trafolux', 'Guvenix', 'Sarjmatik', 'Devreport', 'Termolab', 'Anahtarix',
    'Isiksan', 'Enerjix', 'Kontakform',
  ];
  for (const [i, name] of brands.entries()) {
    await writeFile(
      path.join(OUT, 'brands', `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.svg`),
      brandMark(name, i),
      'utf8',
    );
    count += 1;
  }

  process.stdout.write(`generated ${count} mock assets under ${OUT}/\n`);
}

main().catch((e) => {
  process.stderr.write(`${e.stack}\n`);
  process.exit(1);
});
