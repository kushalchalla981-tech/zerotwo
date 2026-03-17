const fs = require('fs');
const zlib = require('zlib');

function crc32(data) {
    let crc = 0xFFFFFFFF;
    const table = [];
    for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) {
            c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
        }
        table[n] = c;
    }
    for (let i = 0; i < data.length; i++) {
        crc = table[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
    }
    return crc ^ 0xFFFFFFFF;
}

function createChunk(type, data) {
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length, 0);
    const typeBuffer = Buffer.from(type);
    const crcData = Buffer.concat([typeBuffer, data]);
    const crc = crc32(crcData);
    const crcBuffer = Buffer.alloc(4);
    crcBuffer.writeUInt32BE(crc >>> 0, 0);
    return Buffer.concat([length, typeBuffer, data, crcBuffer]);
}

function createPNG(width, height, pixelData) {
    const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
    const ihdrData = Buffer.alloc(13);
    ihdrData.writeUInt32BE(width, 0);
    ihdrData.writeUInt32BE(height, 4);
    ihdrData[8] = 8;
    ihdrData[9] = 6;
    ihdrData[10] = 0;
    ihdrData[11] = 0;
    ihdrData[12] = 0;
    const ihdr = createChunk('IHDR', ihdrData);
    const rawData = Buffer.alloc((width * 4 + 1) * height);
    for (let y = 0; y < height; y++) {
        rawData[y * (width * 4 + 1)] = 0;
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            const outIdx = y * (width * 4 + 1) + 1 + x * 4;
            rawData[outIdx] = pixelData[idx];
            rawData[outIdx + 1] = pixelData[idx + 1];
            rawData[outIdx + 2] = pixelData[idx + 2];
            rawData[outIdx + 3] = pixelData[idx + 3];
        }
    }
    const compressed = zlib.deflateSync(rawData, { level: 9 });
    const idat = createChunk('IDAT', compressed);
    const iend = createChunk('IEND', Buffer.alloc(0));
    return Buffer.concat([signature, ihdr, idat, iend]);
}

function drawOval(pixels, w, h, cx, cy, rx, ry, r, g, b, a) {
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const dx = (x - cx) / rx;
            const dy = (y - cy) / ry;
            if (dx * dx + dy * dy <= 1) {
                const idx = (y * w + x) * 4;
                pixels[idx] = r;
                pixels[idx + 1] = g;
                pixels[idx + 2] = b;
                pixels[idx + 3] = a;
            }
        }
    }
}

function drawCircle(pixels, w, h, cx, cy, radius, r, g, b, a) {
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const dx = x - cx;
            const dy = y - cy;
            if (dx * dx + dy * dy <= radius * radius) {
                const idx = (y * w + x) * 4;
                pixels[idx] = r;
                pixels[idx + 1] = g;
                pixels[idx + 2] = b;
                pixels[idx + 3] = a;
            }
        }
    }
}

function drawRect(pixels, w, h, x1, y1, x2, y2, r, g, b, a) {
    for (let y = y1; y < y2 && y < h; y++) {
        for (let x = x1; x < x2 && x < w; x++) {
            const idx = (y * w + x) * 4;
            pixels[idx] = r;
            pixels[idx + 1] = g;
            pixels[idx + 2] = b;
            pixels[idx + 3] = a;
        }
    }
}

const SKIN = [255, 220, 185, 255];
const PINK_HAIR = [255, 182, 193, 255];
const DARK_PINK = [255, 150, 170, 255];
const RED_SUIT = [200, 20, 30, 255];
const WHITE = [255, 255, 255, 255];
const TEAL_EYE = [0, 180, 180, 255];
const DARK_PUPIL = [20, 60, 60, 255];
const DARK_RED_HORN = [139, 20, 30, 255];
const LIGHT_RED = [220, 80, 90, 255];

// Head
let pixels = new Uint8Array(900 * 1100 * 4);
pixels.fill(0);
drawOval(pixels, 900, 1100, 450, 550, 380, 480, ...SKIN);
fs.writeFileSync('assets/head/head_base_01.png', createPNG(900, 1100, pixels));
console.log('head');

// Eyes
pixels = new Uint8Array(220 * 120 * 4);
pixels.fill(0);
drawOval(pixels, 220, 120, 110, 60, 90, 50, 255, 255, 255, 255);
fs.writeFileSync('assets/eyes/eye_left_base_01.png', createPNG(220, 120, pixels));
fs.writeFileSync('assets/eyes/eye_right_base_01.png', createPNG(220, 120, pixels));
console.log('eyes');

// Pupils
pixels = new Uint8Array(60 * 60 * 4);
pixels.fill(0);
drawCircle(pixels, 60, 60, 30, 30, 22, ...TEAL_EYE);
drawCircle(pixels, 60, 60, 30, 30, 12, ...DARK_PUPIL);
fs.writeFileSync('assets/pupils/pupil_left_01.png', createPNG(60, 60, pixels));
fs.writeFileSync('assets/pupils/pupil_right_01.png', createPNG(60, 60, pixels));
console.log('pupils');

// Eyelids
for (const [name, open] of [['open', 60], ['half', 30], ['closed', 10]]) {
    pixels = new Uint8Array(220 * 60 * 4);
    pixels.fill(0);
    if (open > 5) drawRect(pixels, 220, 60, 20, 0, 200, open, ...SKIN);
    else drawRect(pixels, 220, 60, 20, 25, 200, 35, ...SKIN);
    fs.writeFileSync('assets/eyelids/eyelid_upper_left_' + name + '_01.png', createPNG(220, 60, pixels));
    fs.writeFileSync('assets/eyelids/eyelid_upper_right_' + name + '_01.png', createPNG(220, 60, pixels));
    pixels = new Uint8Array(220 * 60 * 4);
    pixels.fill(0);
    if (open > 5) drawRect(pixels, 220, 60, 20, 60 - open, 200, 60, ...SKIN);
    fs.writeFileSync('assets/eyelids/eyelid_lower_left_' + name + '_01.png', createPNG(220, 60, pixels));
    fs.writeFileSync('assets/eyelids/eyelid_lower_right_' + name + '_01.png', createPNG(220, 60, pixels));
}
console.log('eyelids');

// Eyebrows
pixels = new Uint8Array(180 * 60 * 4);
pixels.fill(0);
drawRect(pixels, 180, 60, 20, 20, 160, 35, 180, 120, 120, 255);
fs.writeFileSync('assets/eyebrows/eyebrow_left_neutral_01.png', createPNG(180, 60, pixels));
drawRect(pixels, 180, 60, 20, 25, 160, 40, 160, 80, 80, 255);
fs.writeFileSync('assets/eyebrows/eyebrow_left_angry_01.png', createPNG(180, 60, pixels));
drawRect(pixels, 180, 60, 20, 15, 160, 30, 200, 160, 160, 255);
fs.writeFileSync('assets/eyebrows/eyebrow_left_happy_01.png', createPNG(180, 60, pixels));
fs.writeFileSync('assets/eyebrows/eyebrow_right_neutral_01.png', createPNG(180, 60, pixels));
fs.writeFileSync('assets/eyebrows/eyebrow_right_angry_01.png', createPNG(180, 60, pixels));
fs.writeFileSync('assets/eyebrows/eyebrow_right_happy_01.png', createPNG(180, 60, pixels));
console.log('eyebrows');

// Mouth
pixels = new Uint8Array(180 * 100 * 4);
pixels.fill(0);
drawRect(pixels, 180, 100, 60, 45, 120, 55, 180, 80, 80, 255);
fs.writeFileSync('assets/mouth/mouth_neutral_01.png', createPNG(180, 100, pixels));
drawOval(pixels, 180, 100, 90, 55, 30, 15, 200, 100, 100, 255);
fs.writeFileSync('assets/mouth/mouth_happy_01.png', createPNG(180, 100, pixels));
drawRect(pixels, 180, 100, 60, 50, 120, 60, 160, 60, 60, 255);
fs.writeFileSync('assets/mouth/mouth_annoyed_01.png', createPNG(180, 100, pixels));
console.log('mouth');

// Hair Back
pixels = new Uint8Array(1400 * 2000 * 4);
pixels.fill(0);
drawOval(pixels, 1400, 2000, 700, 1000, 600, 900, ...PINK_HAIR);
drawOval(pixels, 1400, 2000, 700, 1500, 500, 600, ...DARK_PINK);
fs.writeFileSync('assets/hair/hair_back_base_01.png', createPNG(1400, 2000, pixels));
console.log('hair back');

// Hair Front
pixels = new Uint8Array(1200 * 1400 * 4);
pixels.fill(0);
drawOval(pixels, 1200, 1400, 600, 700, 500, 600, ...PINK_HAIR);
drawOval(pixels, 1200, 1400, 250, 900, 120, 350, ...PINK_HAIR);
drawOval(pixels, 1200, 1400, 950, 900, 120, 350, ...PINK_HAIR);
fs.writeFileSync('assets/hair/hair_front_base_01.png', createPNG(1200, 1400, pixels));
drawOval(pixels, 300, 900, 150, 450, 100, 400, ...PINK_HAIR);
fs.writeFileSync('assets/hair/hair_side_left_01.png', createPNG(300, 900, pixels));
fs.writeFileSync('assets/hair/hair_side_right_01.png', createPNG(300, 900, pixels));
console.log('hair front/sides');

// Horns
pixels = new Uint8Array(120 * 180 * 4);
pixels.fill(0);
drawOval(pixels, 120, 180, 60, 90, 40, 70, ...DARK_RED_HORN);
fs.writeFileSync('assets/horns/horn_left_01.png', createPNG(120, 180, pixels));
fs.writeFileSync('assets/horns/horn_right_01.png', createPNG(120, 180, pixels));
console.log('horns');

// Body
pixels = new Uint8Array(1000 * 1600 * 4);
pixels.fill(0);
drawOval(pixels, 1000, 1600, 500, 800, 400, 700, ...RED_SUIT);
drawRect(pixels, 1000, 1600, 350, 400, 450, 600, ...WHITE);
drawRect(pixels, 1000, 1600, 550, 400, 650, 600, ...WHITE);
fs.writeFileSync('assets/body/body_torso_base_01.png', createPNG(1000, 1600, pixels));
console.log('body');

// Neck
pixels = new Uint8Array(200 * 300 * 4);
pixels.fill(0);
drawRect(pixels, 200, 300, 50, 0, 150, 300, ...SKIN);
fs.writeFileSync('assets/body/body_neck_01.png', createPNG(200, 300, pixels));
console.log('neck');

// Body Details
pixels = new Uint8Array(1000 * 1600 * 4);
pixels.fill(0);
drawRect(pixels, 1000, 1600, 350, 400, 450, 600, ...WHITE);
drawRect(pixels, 1000, 1600, 550, 400, 650, 600, ...WHITE);
drawRect(pixels, 1000, 1600, 420, 800, 580, 820, ...LIGHT_RED);
fs.writeFileSync('assets/body/body_overlay_details_01.png', createPNG(1000, 1600, pixels));
console.log('body details');

// Arms
pixels = new Uint8Array(300 * 1400 * 4);
pixels.fill(0);
drawOval(pixels, 300, 1400, 150, 700, 100, 600, ...RED_SUIT);
fs.writeFileSync('assets/arms/arm_left_base_01.png', createPNG(300, 1400, pixels));
fs.writeFileSync('assets/arms/arm_right_base_01.png', createPNG(300, 1400, pixels));
console.log('arms');

// Legs
pixels = new Uint8Array(400 * 1800 * 4);
pixels.fill(0);
drawOval(pixels, 400, 1800, 200, 900, 140, 800, ...RED_SUIT);
fs.writeFileSync('assets/legs/leg_left_base_01.png', createPNG(400, 1800, pixels));
fs.writeFileSync('assets/legs/leg_right_base_01.png', createPNG(400, 1800, pixels));
console.log('legs');

console.log('All Zero Two themed assets created!');
