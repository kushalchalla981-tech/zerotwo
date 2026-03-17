const fs = require('fs');
const zlib = require('zlib');

const C = {
    skin: [255, 220, 190], skinS: [240, 200, 170],
    hair: [255, 170, 190], hairD: [220, 130, 150],
    suit: [180, 20, 30], suitD: [140, 15, 20], suitH: [200, 40, 50],
    white: [255, 255, 255], eye: [255, 255, 255], iris: [0, 180, 170], pupil: [15, 40, 40],
    horn: [120, 15, 20], mouth: [180, 70, 70], mouthD: [140, 40, 40], brow: [180, 100, 100]
};

function crc32(d) {
    let c = 0xFFFFFFFF, t = [];
    for (let n = 0; n < 256; n++) { let x = n; for (let k = 0; k < 8; k++) x = (x & 1) ? (0xEDB88320 ^ (x >>> 1)) : (x >>> 1); t[n] = x; }
    for (let i = 0; i < d.length; i++) c = t[(c ^ d[i]) & 0xFF] ^ (c >>> 8);
    return c ^ 0xFFFFFFFF;
}

function chunk(type, data) {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
    const crc = crc32(Buffer.concat([Buffer.from(type), data]));
    const cbuf = Buffer.alloc(4); cbuf.writeUInt32BE(crc >>> 0, 0);
    return Buffer.concat([len, Buffer.from(type), data, cbuf]);
}

function mkPNG(w, h, px) {
    const sig = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
    const ihdr = chunk('IHDR', Buffer.from([w>>24,w>>16,w>>8,w, h>>24,h>>16,h>>8,h, 8, 6, 0, 0, 0]));
    const raw = Buffer.alloc((w * 4 + 1) * h);
    for (let y = 0; y < h; y++) {
        raw[y * (w * 4 + 1)] = 0;
        for (let x = 0; x < w; x++) {
            const s = (y * w + x) * 4, d = y * (w * 4 + 1) + 1 + x * 4;
            raw[d] = px[s]; raw[d+1] = px[s+1]; raw[d+2] = px[s+2]; raw[d+3] = px[s+3];
        }
    }
    const idat = chunk('IDAT', zlib.deflateSync(raw, { level: 9 }));
    const iend = chunk('IEND', Buffer.alloc(0));
    return Buffer.concat([sig, ihdr, idat, iend]);
}

function set(px, x, y, w, h, r, g, b, a = 255) {
    if (x < 0 || x >= w || y < 0 || y >= h) return;
    const i = (y * w + x) * 4; px[i] = r; px[i+1] = g; px[i+2] = b; px[i+3] = a;
}

function fillE(px, w, h, cx, cy, rx, ry, r, g, b, a = 255) {
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++)
        if (((x-cx)/rx)**2 + ((y-cy)/ry)**2 <= 1) set(px, x, y, w, h, r, g, b, a);
}

function fillR(px, w, h, x1, y1, x2, y2, r, g, b, a = 255) {
    for (let y = Math.max(0,y1); y < Math.min(h,y2); y++)
        for (let x = Math.max(0,x1); x < Math.min(w,x2); x++) set(px, x, y, w, h, r, g, b, a);
}

function fillC(px, w, h, cx, cy, r, cr, cg, cb, a = 255) {
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++)
        if ((x-cx)**2 + (y-cy)**2 <= r*r) set(px, x, y, w, h, cr, cg, cb, a);
}

// HEAD
let px = new Uint8Array(800 * 900 * 4); px.fill(0);
fillE(px, 800, 900, 400, 450, 340, 400, ...C.skinS); fillE(px, 800, 900, 400, 440, 330, 390, ...C.skin);
fs.writeFileSync('assets/head/head_base_01.png', mkPNG(800, 900, px));

// EYES
px = new Uint8Array(200 * 110 * 4); px.fill(0);
fillE(px, 200, 110, 100, 55, 85, 50, ...C.white);
fs.writeFileSync('assets/eyes/eye_left_base_01.png', mkPNG(200, 110, px));
fs.writeFileSync('assets/eyes/eye_right_base_01.png', mkPNG(200, 110, px));

// PUPILS
px = new Uint8Array(60 * 60 * 4); px.fill(0);
fillC(px, 60, 60, 30, 30, 25, ...C.iris); fillC(px, 60, 60, 30, 30, 12, ...C.pupil); fillC(px, 60, 60, 22, 22, 4, 255, 255, 255, 180);
fs.writeFileSync('assets/pupils/pupil_left_01.png', mkPNG(60, 60, px));
fs.writeFileSync('assets/pupils/pupil_right_01.png', mkPNG(60, 60, px));

// EYELIDS
for (const [nm, h] of [['open',50],['half',25],['closed',2]]) {
    px = new Uint8Array(200 * 55 * 4); px.fill(0);
    if (h > 1) fillR(px, 200, 55, 15, 0, 185, h, ...C.skin);
    fs.writeFileSync(`assets/eyelids/eyelid_upper_left_${nm}_01.png`, mkPNG(200, 55, px));
    fs.writeFileSync(`assets/eyelids/eyelid_upper_right_${nm}_01.png`, mkPNG(200, 55, px));
    px = new Uint8Array(200 * 55 * 4); px.fill(0);
    if (h > 1) fillR(px, 200, 55, 15, 55-h, 185, 55, ...C.skin);
    fs.writeFileSync(`assets/eyelids/eyelid_lower_left_${nm}_01.png`, mkPNG(200, 55, px));
    fs.writeFileSync(`assets/eyelids/eyelid_lower_right_${nm}_01.png`, mkPNG(200, 55, px));
}

// EYEBROWS
px = new Uint8Array(160 * 45 * 4); px.fill(0);
fillE(px, 160, 45, 80, 22, 60, 12, ...C.brow);
fs.writeFileSync('assets/eyebrows/eyebrow_left_neutral_01.png', mkPNG(160, 45, px));
fs.writeFileSync('assets/eyebrows/eyebrow_right_neutral_01.png', mkPNG(160, 45, px));
px = new Uint8Array(160 * 45 * 4); px.fill(0);
fillE(px, 160, 45, 80, 28, 60, 12, 140, 60, 60);
fs.writeFileSync('assets/eyebrows/eyebrow_left_angry_01.png', mkPNG(160, 45, px));
fs.writeFileSync('assets/eyebrows/eyebrow_right_angry_01.png', mkPNG(160, 45, px));
px = new Uint8Array(160 * 45 * 4); px.fill(0);
fillE(px, 160, 45, 80, 15, 60, 10, 200, 160, 160);
fs.writeFileSync('assets/eyebrows/eyebrow_left_happy_01.png', mkPNG(160, 45, px));
fs.writeFileSync('assets/eyebrows/eyebrow_right_happy_01.png', mkPNG(160, 45, px));

// MOUTH
px = new Uint8Array(150 * 70 * 4); px.fill(0);
fillR(px, 150, 70, 50, 30, 100, 40, ...C.mouth);
fs.writeFileSync('assets/mouth/mouth_neutral_01.png', mkPNG(150, 70, px));
px = new Uint8Array(150 * 70 * 4); px.fill(0);
fillC(px, 150, 70, 75, 35, 25, ...C.mouth);
fs.writeFileSync('assets/mouth/mouth_happy_01.png', mkPNG(150, 70, px));
px = new Uint8Array(150 * 70 * 4); px.fill(0);
fillR(px, 150, 70, 50, 35, 100, 45, ...C.mouthD);
fs.writeFileSync('assets/mouth/mouth_annoyed_01.png', mkPNG(150, 70, px));

// HAIR BACK
px = new Uint8Array(1200 * 1800 * 4); px.fill(0);
fillE(px, 1200, 1800, 600, 900, 520, 800, ...C.hairD); fillE(px, 1200, 1800, 600, 850, 480, 750, ...C.hair);
fs.writeFileSync('assets/hair/hair_back_base_01.png', mkPNG(1200, 1800, px));

// HAIR FRONT
px = new Uint8Array(1000 * 1200 * 4); px.fill(0);
fillE(px, 1000, 1200, 500, 600, 420, 500, ...C.hairD); fillE(px, 1000, 1200, 500, 580, 400, 470, ...C.hair);
fillE(px, 1000, 1200, 180, 700, 100, 300, ...C.hair); fillE(px, 1000, 1200, 820, 700, 100, 300, ...C.hair);
fs.writeFileSync('assets/hair/hair_front_base_01.png', mkPNG(1000, 1200, px));

px = new Uint8Array(250 * 800 * 4); px.fill(0);
fillE(px, 250, 800, 125, 400, 100, 350, ...C.hairD); fillE(px, 250, 800, 125, 380, 90, 320, ...C.hair);
fs.writeFileSync('assets/hair/hair_side_left_01.png', mkPNG(250, 800, px));
fs.writeFileSync('assets/hair/hair_side_right_01.png', mkPNG(250, 800, px));

// HORNS
px = new Uint8Array(100 * 150 * 4); px.fill(0);
fillE(px, 100, 150, 50, 75, 35, 60, ...C.horn);
fs.writeFileSync('assets/horns/horn_left_01.png', mkPNG(100, 150, px));
fs.writeFileSync('assets/horns/horn_right_01.png', mkPNG(100, 150, px));

// BODY
px = new Uint8Array(800 * 1400 * 4); px.fill(0);
fillE(px, 800, 1400, 400, 700, 320, 600, ...C.suitD); fillE(px, 800, 1400, 400, 680, 300, 560, ...C.suit);
fillR(px, 800, 1400, 280, 350, 360, 550, ...C.white); fillR(px, 800, 1400, 440, 350, 520, 550, ...C.white);
fillR(px, 800, 1400, 350, 700, 450, 720, ...C.suitH);
fs.writeFileSync('assets/body/body_torso_base_01.png', mkPNG(800, 1400, px));

// NECK
px = new Uint8Array(180 * 250 * 4); px.fill(0);
fillE(px, 180, 250, 90, 125, 70, 110, ...C.skinS); fillE(px, 180, 250, 90, 120, 65, 100, ...C.skin);
fs.writeFileSync('assets/body/body_neck_01.png', mkPNG(180, 250, px));

// BODY DETAILS
px = new Uint8Array(800 * 1400 * 4); px.fill(0);
fillR(px, 800, 1400, 280, 350, 360, 550, ...C.white); fillR(px, 800, 1400, 440, 350, 520, 550, ...C.white);
fillR(px, 800, 1400, 360, 700, 440, 720, ...C.suitH);
fs.writeFileSync('assets/body/body_overlay_details_01.png', mkPNG(800, 1400, px));

// ARMS
px = new Uint8Array(250 * 1200 * 4); px.fill(0);
fillE(px, 250, 1200, 125, 600, 90, 500, ...C.suitD); fillE(px, 250, 1200, 125, 580, 80, 460, ...C.suit);
fs.writeFileSync('assets/arms/arm_left_base_01.png', mkPNG(250, 1200, px));
fs.writeFileSync('assets/arms/arm_right_base_01.png', mkPNG(250, 1200, px));

// LEGS
px = new Uint8Array(350 * 1600 * 4); px.fill(0);
fillE(px, 350, 1600, 175, 800, 120, 700, ...C.suitD); fillE(px, 350, 1600, 175, 780, 110, 650, ...C.suit);
fs.writeFileSync('assets/legs/leg_left_base_01.png', mkPNG(350, 1600, px));
fs.writeFileSync('assets/legs/leg_right_base_01.png', mkPNG(350, 1600, px));

console.log('All Zero Two assets created!');
