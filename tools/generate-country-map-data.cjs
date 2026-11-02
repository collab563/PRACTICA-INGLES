// Convert Natural Earth's 10m Admin 0 Countries shapefile into a compact SVG
// path catalog for the offline Countries practice map.
// Source data: https://www.naturalearthdata.com/downloads/10m-cultural-vectors/10m-admin-0-countries/
// Natural Earth vector data is public domain.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const sourceDir = process.argv[2] || path.join(os.tmpdir(), 'ne-admin0-countries');
const outputPath = process.argv[3] || path.resolve(__dirname, '../site/data/country-map-data.js');
const shpPath = path.join(sourceDir, 'ne_10m_admin_0_countries.shp');
const dbfPath = path.join(sourceDir, 'ne_10m_admin_0_countries.dbf');
const width = 1200;
const height = 730;
const maxX = 2.5707963268;
const maxY = Math.PI / 2;
const mapScale = (width - 44) / (2 * maxX);
const xPadding = 22;
const yPadding = (height - 2 * maxY * mapScale) / 2;
const tolerance = 0.035;

if (!fs.existsSync(shpPath) || !fs.existsSync(dbfPath)) {
  throw new Error(`Natural Earth shapefile and DBF must be extracted in: ${sourceDir}`);
}

function project(longitude, latitude) {
  const lambda = longitude * Math.PI / 180;
  const phi = latitude * Math.PI / 180;
  const cosPhi = Math.cos(phi);
  const alpha = Math.acos(Math.max(-1, Math.min(1, cosPhi * Math.cos(lambda / 2))));
  const sinc = alpha < 1e-9 ? 1 : Math.sin(alpha) / alpha;
  const x = 0.5 * (lambda * (2 / Math.PI) + (2 * cosPhi * Math.sin(lambda / 2)) / sinc);
  const y = 0.5 * (phi + Math.sin(phi) / sinc);
  return [xPadding + (x + maxX) * mapScale, yPadding + (maxY - y) * mapScale];
}

function formatCoordinate(value) {
  const rounded = Math.round(value * 10) / 10;
  return Object.is(rounded, -0) ? '0' : String(rounded);
}

function distanceToSegmentSquared(point, start, end) {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  if (dx === 0 && dy === 0) return (point[0] - start[0]) ** 2 + (point[1] - start[1]) ** 2;
  const ratio = Math.max(0, Math.min(1,
    ((point[0] - start[0]) * dx + (point[1] - start[1]) * dy) / (dx * dx + dy * dy)));
  const x = start[0] + ratio * dx;
  const y = start[1] + ratio * dy;
  return (point[0] - x) ** 2 + (point[1] - y) ** 2;
}

function simplifyOpenLine(points, limitSquared) {
  if (points.length <= 3) return points;
  const keep = new Uint8Array(points.length);
  keep[0] = 1;
  keep[points.length - 1] = 1;
  const pending = [[0, points.length - 1]];
  while (pending.length) {
    const [startIndex, endIndex] = pending.pop();
    let largestDistance = limitSquared;
    let largestIndex = -1;
    for (let index = startIndex + 1; index < endIndex; index += 1) {
      const distance = distanceToSegmentSquared(points[index], points[startIndex], points[endIndex]);
      if (distance > largestDistance) {
        largestDistance = distance;
        largestIndex = index;
      }
    }
    if (largestIndex !== -1) {
      keep[largestIndex] = 1;
      pending.push([startIndex, largestIndex], [largestIndex, endIndex]);
    }
  }
  return points.filter((_, index) => keep[index]);
}

function simplifyRing(points) {
  if (points.length <= 5) return points;
  let farthestIndex = 1;
  let farthestDistance = -1;
  for (let index = 1; index < points.length - 1; index += 1) {
    const distance = (points[index][0] - points[0][0]) ** 2 + (points[index][1] - points[0][1]) ** 2;
    if (distance > farthestDistance) {
      farthestDistance = distance;
      farthestIndex = index;
    }
  }
  const firstArc = simplifyOpenLine(points.slice(0, farthestIndex + 1), tolerance ** 2);
  const secondArc = simplifyOpenLine(points.slice(farthestIndex), tolerance ** 2);
  const result = firstArc.concat(secondArc.slice(1));
  return result.length >= 4 ? result : points;
}

function dbfRows(buffer) {
  const count = buffer.readUInt32LE(4);
  const headerLength = buffer.readUInt16LE(8);
  const rowLength = buffer.readUInt16LE(10);
  const fields = [];
  let offset = 32;
  while (offset < headerLength && buffer[offset] !== 0x0D) {
    const field = buffer.subarray(offset, offset + 32);
    const name = field.subarray(0, 11).toString('ascii').split('\0')[0];
    fields.push({ name, length: field[16] });
    offset += 32;
  }
  const starts = new Map();
  let fieldOffset = 1;
  for (const field of fields) {
    starts.set(field.name, { offset: fieldOffset, length: field.length });
    fieldOffset += field.length;
  }
  const wantedFields = ['ADMIN', 'ISO_A2_EH', 'ISO_A2'];
  const rows = [];
  for (let index = 0; index < count; index += 1) {
    const row = buffer.subarray(headerLength + index * rowLength, headerLength + (index + 1) * rowLength);
    const values = {};
    for (const name of wantedFields) {
      const field = starts.get(name);
      values[name] = field
        ? row.subarray(field.offset, field.offset + field.length).toString('utf8').replace(/\0/g, '').trim()
        : '';
    }
    rows.push(values);
  }
  return rows;
}

function shapePath(record) {
  const type = record.readInt32LE(0);
  if (type === 0) return '';
  if (type !== 5 && type !== 15 && type !== 25) return '';
  const partCount = record.readInt32LE(36);
  const pointCount = record.readInt32LE(40);
  const partsOffset = 44;
  const pointsOffset = partsOffset + partCount * 4;
  const partStarts = [];
  for (let index = 0; index < partCount; index += 1) partStarts.push(record.readInt32LE(partsOffset + index * 4));
  const parts = [];
  for (let partIndex = 0; partIndex < partCount; partIndex += 1) {
    const start = partStarts[partIndex];
    const end = partIndex + 1 < partCount ? partStarts[partIndex + 1] : pointCount;
    const ring = [];
    for (let pointIndex = start; pointIndex < end; pointIndex += 1) {
      const position = pointsOffset + pointIndex * 16;
      ring.push([record.readDoubleLE(position), record.readDoubleLE(position + 8)]);
    }
    if (ring.length < 4) continue;
    const simplified = simplifyRing(ring);
    const projected = simplified.map(point => project(point[0], point[1]));
    parts.push(`M${projected.map(point => `${formatCoordinate(point[0])},${formatCoordinate(point[1])}`).join('L')}Z`);
  }
  return parts.join('');
}

const rows = dbfRows(fs.readFileSync(dbfPath));
const shapeBuffer = fs.readFileSync(shpPath);
const features = [];
let recordOffset = 100;
let shapeIndex = 0;
while (recordOffset + 8 <= shapeBuffer.length) {
  const contentLength = shapeBuffer.readInt32BE(recordOffset + 4) * 2;
  const record = shapeBuffer.subarray(recordOffset + 8, recordOffset + 8 + contentLength);
  const row = rows[shapeIndex];
  const code = row?.ISO_A2_EH || row?.ISO_A2 || '';
  const pathData = shapePath(record);
  if (/^[A-Z]{2}$/.test(code) && pathData) features.push({ code, d: pathData });
  recordOffset += 8 + contentLength;
  shapeIndex += 1;
}

// Natural Earth's small-scale admin-0 layer does not provide separate polygons
// for these small dependencies, so show their approximate locations as zoomable
// highlighted markers instead of colouring a parent country.
const fallbackCoordinates = {
  BQ: [[-68.28, 12.17], [-62.98, 17.48], [-63.05, 17.63]],
  BV: [[3.35, -54.42]],
  CC: [[96.83, -12.17]],
  CX: [[105.63, -10.48]],
  GF: [[-53.2, 3.9]],
  GP: [[-61.55, 16.25]],
  MQ: [[-61.02, 14.64]],
  RE: [[55.53, -21.12]],
  SJ: [[18, 76], [-8.3, 71]],
  TK: [[-171.85, -9.2], [-171.7, -9.2], [-172.5, -9.2]],
  YT: [[45.17, -12.83]],
};
const flagsDirectory = path.resolve(__dirname, '../site/images/flags');
const flagCodes = fs.readdirSync(flagsDirectory).filter(file => file.endsWith('.svg')).map(file => file.slice(0, 2).toUpperCase());
const codesWithPolygons = new Set(features.map(feature => feature.code));
const fallbackPoints = {};
for (const code of flagCodes) {
  if (codesWithPolygons.has(code) || !fallbackCoordinates[code]) continue;
  fallbackPoints[code] = fallbackCoordinates[code].map(([longitude, latitude]) => project(longitude, latitude));
}

const output = `// Generated from Natural Earth 10m Admin 0 Countries v5.1.1 (public domain).\n// Regenerate with tools/generate-country-map-data.cjs and the extracted source shapefile.\nglobalThis.CountryMapData = ${JSON.stringify({ viewBox: `0 0 ${width} ${height}`, features, fallbackPoints })};\n`;
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, output, 'utf8');
console.log(`Wrote ${features.length} country shapes and ${Object.keys(fallbackPoints).length} fallback locations to ${outputPath}`);
