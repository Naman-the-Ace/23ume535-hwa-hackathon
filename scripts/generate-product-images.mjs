import { mkdir, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const OUT = path.resolve("public/images/product");
const TMP = path.resolve(".image-build");
const AMP = String.fromCharCode(38) + "amp;";

const P = {
  cream: "#F1EEE1",
  creamLight: "#FBFAF5",
  creamHi: "#FFFDF7",
  creamShade: "#DAD4C2",
  creamDeep: "#C5BEAA",
  sage: "#9FB08A",
  sageDeep: "#6B8A67",
  sageLight: "#C6D1B6",
  sagePale: "#E6EBDD",
  coral: "#E76F51",
  coralDeep: "#BF5439",
  coralLight: "#F4A38D",
  coralPale: "#FBDDD3",
  green: "#2D3A2E",
  greenMid: "#3A4839",
  greenSoft: "#4C5B4C",
  fur: "#D8B489",
  furLight: "#EBD2AF",
  furShade: "#B9946B",
  amber: "#E6C284",
};

function defs(id) {
  return `
<linearGradient id="${id}-bg" x1="0" y1="0" x2="0.3" y2="1">
  <stop offset="0%" stop-color="#FDFCF8"/>
  <stop offset="52%" stop-color="#F5F2E8"/>
  <stop offset="100%" stop-color="#E9E4D4"/>
</linearGradient>
<radialGradient id="${id}-halo" cx="0.5" cy="0.42" r="0.62">
  <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.98"/>
  <stop offset="55%" stop-color="${P.sagePale}" stop-opacity="0.5"/>
  <stop offset="100%" stop-color="${P.sagePale}" stop-opacity="0"/>
</radialGradient>
<radialGradient id="${id}-shadow" cx="0.5" cy="0.5" r="0.5">
  <stop offset="0%" stop-color="#26332A" stop-opacity="0.32"/>
  <stop offset="52%" stop-color="#26332A" stop-opacity="0.12"/>
  <stop offset="100%" stop-color="#26332A" stop-opacity="0"/>
</radialGradient>
<linearGradient id="${id}-body" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0%" stop-color="${P.creamDeep}"/>
  <stop offset="10%" stop-color="${P.creamShade}"/>
  <stop offset="34%" stop-color="${P.creamHi}"/>
  <stop offset="66%" stop-color="${P.cream}"/>
  <stop offset="88%" stop-color="${P.creamShade}"/>
  <stop offset="100%" stop-color="${P.creamDeep}"/>
</linearGradient>
<linearGradient id="${id}-base" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0%" stop-color="#1D291F"/>
  <stop offset="26%" stop-color="${P.greenMid}"/>
  <stop offset="58%" stop-color="${P.greenSoft}"/>
  <stop offset="100%" stop-color="#1A251C"/>
</linearGradient>
<linearGradient id="${id}-top" x1="0.08" y1="0" x2="0.92" y2="1">
  <stop offset="0%" stop-color="${P.creamHi}"/>
  <stop offset="48%" stop-color="${P.creamLight}"/>
  <stop offset="100%" stop-color="${P.creamShade}"/>
</linearGradient>
<linearGradient id="${id}-sage" x1="0.15" y1="0" x2="0.5" y2="1">
  <stop offset="0%" stop-color="${P.sageLight}"/>
  <stop offset="52%" stop-color="${P.sage}"/>
  <stop offset="100%" stop-color="${P.sageDeep}"/>
</linearGradient>
<radialGradient id="${id}-coral" cx="0.36" cy="0.28" r="0.8">
  <stop offset="0%" stop-color="${P.coralLight}"/>
  <stop offset="46%" stop-color="${P.coral}"/>
  <stop offset="100%" stop-color="${P.coralDeep}"/>
</radialGradient>
<linearGradient id="${id}-coralSide" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0%" stop-color="${P.coralDeep}"/>
  <stop offset="42%" stop-color="${P.coral}"/>
  <stop offset="100%" stop-color="${P.coralLight}"/>
</linearGradient>
<linearGradient id="${id}-fur" x1="0.1" y1="0" x2="0.6" y2="1">
  <stop offset="0%" stop-color="${P.furLight}"/>
  <stop offset="58%" stop-color="${P.fur}"/>
  <stop offset="100%" stop-color="${P.furShade}"/>
</linearGradient>
<linearGradient id="${id}-floor" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0%" stop-color="${P.sagePale}" stop-opacity="0.95"/>
  <stop offset="100%" stop-color="${P.sageLight}" stop-opacity="0.55"/>
</linearGradient>`;
}

function studio(id, w, h, opts = {}) {
  const { halo = true, floor = true } = opts;
  return `
<rect width="${w}" height="${h}" fill="url(#${id}-bg)"/>
${halo ? `<ellipse cx="${w * 0.5}" cy="${h * 0.42}" rx="${w * 0.46}" ry="${h * 0.46}" fill="url(#${id}-halo)"/>` : ""}
${floor ? `<path d="M0,${h * 0.76} q${w * 0.5},-54 ${w},0 v${h * 0.24} h-${w} z" fill="url(#${id}-floor)"/>` : ""}`;
}

function ridges(x0, x1, y, count, color, op, w, h) {
  let s = "";
  const step = (x1 - x0) / (count - 1);
  for (let i = 0; i < count; i++) {
    const x = x0 + step * i;
    s += `<rect x="${(x - w / 2).toFixed(1)}" y="${y}" width="${w}" height="${h}" rx="${(w / 2).toFixed(1)}" fill="${color}" opacity="${op}"/>`;
  }
  return s;
}

function dots(cx, cy, rx, ry, count, color, op, r) {
  let s = "";
  for (let i = 0; i < count; i++) {
    const t = (i / (count - 1)) * Math.PI * 2;
    s += `<ellipse cx="${(cx + Math.cos(t) * rx).toFixed(1)}" cy="${(cy + Math.sin(t) * ry).toFixed(1)}" rx="${r}" ry="${(r * 0.6).toFixed(1)}" fill="${color}" opacity="${op}"/>`;
  }
  return s;
}

function basePlinth(id) {
  return `
<g>
  <ellipse cx="0" cy="4" rx="238" ry="56" fill="#16211A" opacity="0.9"/>
  <path d="M-238,-74 L-238,-10 A238,56 0 0 0 238,-10 L238,-74 Z" fill="url(#${id}-base)"/>
  ${ridges(-192, 192, -58, 19, "#141E17", 0.45, 9, 26)}
  <path d="M-238,-74 a238,56 0 0 1 476,0" fill="none" stroke="${P.sage}" stroke-opacity="0.4" stroke-width="3"/>
  <path d="M-232,-40 q232,26 464,0" fill="none" stroke="#0F1711" stroke-opacity="0.3" stroke-width="2"/>
</g>`;
}

function housingBody(id) {
  return `
<g>
  <path d="M-250,-400 L-233,-86 A233,58 0 0 0 233,-86 L250,-400 Z" fill="url(#${id}-body)"/>
  <path d="M-250,-400 L-233,-86" fill="none" stroke="${P.creamDeep}" stroke-width="3" opacity="0.45"/>
  <path d="M250,-400 L233,-86" fill="none" stroke="${P.creamDeep}" stroke-width="4" opacity="0.55"/>
  <path d="M-196,-330 q-14,120 -4,222" fill="none" stroke="#FFFFFF" stroke-width="28" stroke-linecap="round" opacity="0.4"/>
  <path d="M176,-340 q16,116 6,216" fill="none" stroke="${P.creamDeep}" stroke-width="22" stroke-linecap="round" opacity="0.22"/>
</g>`;
}

function topRim(id) {
  return `
<g>
  <ellipse cx="0" cy="-400" rx="250" ry="70" fill="url(#${id}-top)"/>
  <ellipse cx="0" cy="-400" rx="250" ry="70" fill="none" stroke="${P.creamDeep}" stroke-width="3" opacity="0.6"/>
  <ellipse cx="0" cy="-398" rx="220" ry="58" fill="none" stroke="${P.creamShade}" stroke-width="2.5" opacity="0.75"/>
  <path d="M-214,-448 a250,70 0 0 1 150,-52" fill="none" stroke="#FFFFFF" stroke-width="6" opacity="0.5" stroke-linecap="round"/>
</g>`;
}

function frontVent(id) {
  return `
<g transform="translate(-118 -252)">
  <rect x="-32" y="-64" width="64" height="128" rx="32" fill="${P.green}" opacity="0.14"/>
  <rect x="-27" y="-59" width="54" height="118" rx="27" fill="url(#${id}-coralSide)"/>
  <rect x="-15" y="-46" width="17" height="92" rx="8.5" fill="#FFFFFF" opacity="0.3"/>
  <rect x="-19" y="-32" width="38" height="8" rx="4" fill="${P.coralDeep}" opacity="0.35"/>
  <rect x="-19" y="-10" width="38" height="8" rx="4" fill="${P.coralDeep}" opacity="0.35"/>
  <rect x="-19" y="12" width="38" height="8" rx="4" fill="${P.coralDeep}" opacity="0.35"/>
</g>`;
}

function scentChamber(id, cx, cy, s) {
  return `
<g transform="translate(${cx} ${cy}) scale(${s})">
  <ellipse cx="0" cy="10" rx="64" ry="34" fill="${P.green}" opacity="0.16"/>
  <ellipse cx="0" cy="0" rx="59" ry="33" fill="url(#${id}-coral)"/>
  <ellipse cx="-8" cy="-9" rx="40" ry="20" fill="${P.coralLight}" opacity="0.5"/>
  ${dots(0, 0, 30, 16, 7, P.coralDeep, 0.42, 4.6)}
  <ellipse cx="-18" cy="-12" rx="12" ry="5.5" fill="#FFFFFF" opacity="0.55"/>
</g>`;
}

function sageKnob(id, cx, cy, s) {
  return `
<g transform="translate(${cx} ${cy}) scale(${s})">
  <ellipse cx="0" cy="7" rx="28" ry="15" fill="${P.green}" opacity="0.2"/>
  <ellipse cx="0" cy="0" rx="26" ry="14" fill="url(#${id}-sage)"/>
  <ellipse cx="-7" cy="-4" rx="13" ry="6" fill="${P.sageLight}" opacity="0.85"/>
  <rect x="-3" y="-7" width="6" height="11" rx="3" fill="${P.green}" opacity="0.32"/>
</g>`;
}

function sliderBar(id, cx, cy, s, knobA, knobB) {
  return `
<g transform="translate(${cx} ${cy}) scale(${s})">
  <rect x="-146" y="-18" width="292" height="36" rx="18" fill="${P.creamDeep}" opacity="0.4"/>
  <rect x="-146" y="-21" width="292" height="36" rx="18" fill="${P.creamHi}" stroke="${P.creamShade}" stroke-width="2.5"/>
  <rect x="-136" y="-12" width="272" height="5" rx="2.5" fill="${P.creamShade}" opacity="0.7"/>
  ${sageKnob(id, knobA, 0, 1)}
  ${sageKnob(id, knobB, 0, 1)}
</g>`;
}

function gateTeeth(cx, cy, s, color) {
  let out = "";
  for (let i = 0; i < 7; i++) {
    out += `<rect x="${-66 + i * 22 - 9}" y="-9" width="18" height="18" rx="5" fill="${color}"/>`;
  }
  return `<g transform="translate(${cx} ${cy}) scale(${s})">${out}</g>`;
}

function controlPad(id, cx, cy, s) {
  return `
<g transform="translate(${cx} ${cy}) scale(${s})">
  <rect x="-52" y="-30" width="104" height="60" rx="20" fill="${P.sagePale}" stroke="${P.sageDeep}" stroke-width="3" opacity="0.95"/>
  <rect x="-34" y="-12" width="68" height="10" rx="5" fill="${P.sageDeep}" opacity="0.55"/>
  <rect x="-34" y="4" width="68" height="10" rx="5" fill="${P.sageDeep}" opacity="0.32"/>
</g>`;
}

function productHero(id, opts = {}) {
  const { knobA = -62, knobB = 62, paw = null } = opts;
  return `
<g>
  ${housingBody(id)}
  ${frontVent(id)}
  ${topRim(id)}
  <g transform="translate(14 -4) rotate(-6)">
    ${sliderBar(id, 20, -400, 0.86, knobA, knobB)}
    ${railPaw(paw)}
    ${scentChamber(id, -165, -418, 0.92)}
    ${controlPad(id, 196, -406, 0.66)}
    ${gateTeeth(56, -330, 1, P.sageDeep)}
  </g>
  ${basePlinth(id)}
</g>`;
}

function productSide(id) {
  return `
<g>
  ${housingBody(id)}
  ${frontVent(id)}
  ${topRim(id)}
  <g transform="translate(14 -4) rotate(-4)">
    <rect x="40" y="-424" width="150" height="34" rx="17" fill="${P.creamHi}" stroke="${P.creamShade}" stroke-width="2.5"/>
    ${sageKnob(id, 72, -407, 0.95)}
    ${scentChamber(id, 150, -402, 0.62)}
  </g>
  ${gateTeeth(96, -336, 0.9, P.sageDeep)}
  ${basePlinth(id)}
</g>`;
}

function productTop(id, opts = {}) {
  const { knobA = -58, knobB = 58 } = opts;
  return `
<g>
  <circle cx="0" cy="0" r="314" fill="url(#${id}-base)"/>
  <circle cx="0" cy="0" r="314" fill="none" stroke="#141E17" stroke-width="4" opacity="0.55"/>
  <path d="M-314,0 a314,314 0 0 1 190,-246" fill="none" stroke="#6E8F69" stroke-width="7" opacity="0.45" stroke-linecap="round"/>
  <circle cx="0" cy="0" r="292" fill="${P.creamDeep}"/>
  <circle cx="0" cy="0" r="284" fill="url(#${id}-top)"/>
  <circle cx="0" cy="0" r="284" fill="none" stroke="${P.creamShade}" stroke-width="4" opacity="0.75"/>
  <circle cx="0" cy="0" r="248" fill="none" stroke="${P.creamShade}" stroke-width="3" opacity="0.6"/>
  <path d="M-268,-86 a284,284 0 0 1 150,-220" fill="none" stroke="#FFFFFF" stroke-width="15" opacity="0.55" stroke-linecap="round"/>
  <g>
    <rect x="-98" y="-200" width="196" height="400" rx="36" fill="${P.creamDeep}" opacity="0.45"/>
    <rect x="-98" y="-200" width="196" height="400" rx="36" fill="${P.creamHi}" stroke="${P.creamShade}" stroke-width="3"/>
    <rect x="-74" y="-176" width="148" height="10" rx="5" fill="${P.creamShade}" opacity="0.75"/>
    <rect x="-74" y="166" width="148" height="10" rx="5" fill="${P.creamShade}" opacity="0.75"/>
    <g transform="translate(0 ${knobA})">
      <circle cx="0" cy="4" r="48" fill="${P.green}" opacity="0.12"/>
      <circle cx="0" cy="0" r="45" fill="url(#${id}-sage)"/>
      <circle cx="-13" cy="-15" r="16" fill="${P.sageLight}" opacity="0.85"/>
      <rect x="-7" y="-28" width="14" height="22" rx="7" fill="${P.green}" opacity="0.28"/>
    </g>
    <g transform="translate(0 ${knobB})">
      <circle cx="0" cy="4" r="48" fill="${P.green}" opacity="0.12"/>
      <circle cx="0" cy="0" r="45" fill="url(#${id}-sage)"/>
      <circle cx="-13" cy="-15" r="16" fill="${P.sageLight}" opacity="0.85"/>
      <rect x="-7" y="-28" width="14" height="22" rx="7" fill="${P.green}" opacity="0.28"/>
    </g>
  </g>
  <g transform="translate(-158 -128)">
    <circle cx="0" cy="10" r="76" fill="${P.green}" opacity="0.14"/>
    <circle cx="0" cy="0" r="72" fill="url(#${id}-coral)"/>
    <circle cx="-16" cy="-18" r="31" fill="${P.coralLight}" opacity="0.5"/>
    ${dots(0, 0, 39, 39, 9, P.coralDeep, 0.4, 6.2)}
    <circle cx="-24" cy="-26" r="13" fill="#FFFFFF" opacity="0.45"/>
  </g>
  <g transform="translate(158 -124)">
    <rect x="-52" y="-32" width="104" height="64" rx="20" fill="${P.sagePale}" stroke="${P.sageDeep}" stroke-width="3"/>
    <rect x="-34" y="-14" width="68" height="10" rx="5" fill="${P.sageDeep}" opacity="0.55"/>
    <rect x="-34" y="4" width="68" height="10" rx="5" fill="${P.sageDeep}" opacity="0.32"/>
  </g>
  <g transform="translate(0 198)">
    <rect x="-96" y="-26" width="192" height="52" rx="18" fill="${P.green}" opacity="0.1"/>
    ${Array.from({ length: 7 }, (_, i) => `<rect x="${-78 + i * 25}" y="-14" width="18" height="28" rx="7" fill="${P.sageDeep}"/>`).join("")}
  </g>
</g>`;
}

function productCutaway(id) {
  return `
<g>
  <path d="M-250,-400 L-233,-86 A233,58 0 0 0 233,-86 L250,-400 Z" fill="${P.creamShade}"/>
  <path d="M-250,-400 L-233,-86 A233,58 0 0 0 233,-86 L250,-400 Z" fill="none" stroke="${P.creamDeep}" stroke-width="3" opacity="0.6"/>
  <path d="M-118,-400 L-108,-92 A108,58 0 0 0 108,-92 L118,-400 Z" fill="${P.green}"/>
  <path d="M-118,-400 L-108,-92 A108,58 0 0 0 108,-92 L118,-400 Z" fill="none" stroke="${P.creamHi}" stroke-width="4" opacity="0.45"/>
  <g transform="translate(0 -258)">
    <rect x="-74" y="-86" width="148" height="168" rx="24" fill="${P.amber}" opacity="0.22"/>
    <rect x="-74" y="-86" width="148" height="168" rx="24" fill="none" stroke="${P.coralDeep}" stroke-width="3" opacity="0.75"/>
    ${Array.from({ length: 9 }, (_, i) => `<circle cx="${-44 + (i % 3) * 44}" cy="${-56 + Math.floor(i / 3) * 44}" r="13" fill="${P.amber}" opacity="0.95"/>`).join("")}
  </g>
  <g transform="translate(0 -140)">
    <rect x="-84" y="-13" width="168" height="26" rx="13" fill="url(#${id}-sage)"/>
    <rect x="-72" y="-32" width="144" height="11" rx="5.5" fill="${P.creamShade}" opacity="0.75"/>
  </g>
  <g transform="translate(0 -62)">
    <rect x="-80" y="-16" width="160" height="32" rx="14" fill="url(#${id}-sage)"/>
    <circle cx="-48" cy="0" r="21" fill="${P.sageDeep}"/>
    <circle cx="48" cy="0" r="21" fill="${P.sageDeep}"/>
    <circle cx="-53" cy="-5" r="6" fill="${P.sageLight}" opacity="0.6"/>
    <circle cx="43" cy="-5" r="6" fill="${P.sageLight}" opacity="0.6"/>
  </g>
  <g transform="translate(150 -244)">
    <rect x="-48" y="-132" width="96" height="264" rx="30" fill="url(#${id}-coralSide)"/>
    <rect x="-26" y="-104" width="18" height="208" rx="9" fill="#FFFFFF" opacity="0.28"/>
    ${Array.from({ length: 5 }, (_, i) => `<rect x="-22" y="${-78 + i * 40}" width="44" height="8" rx="4" fill="${P.coralDeep}" opacity="0.32"/>`).join("")}
  </g>
  ${frontVent(id)}
  ${topRim(id)}
  <g transform="translate(14 -4) rotate(-6)">
    ${sliderBar(id, 48, -400, 1, 120, -40)}
    ${scentChamber(id, -165, -418, 0.85)}
    ${gateTeeth(56, -330, 1, P.sageDeep)}
  </g>
  ${basePlinth(id)}
</g>`;
}

function dogHeadProfile(opts = {}) {
  const { x = 0, y = 0, s = 1, rot = 0, flip = false, headOnly = false } = opts;
  const silhouette = headOnly
    ? `M-40,-150
       C-12,-172 42,-170 78,-146
       C122,-126 162,-100 198,-70
       C210,-60 212,-42 200,-33
       C180,-19 150,-24 122,-40
       C104,-50 86,-55 68,-54
       C66,-4 74,44 90,88
       C100,116 94,144 70,154
       C42,165 10,153 -8,124
       C-30,90 -36,50 -28,12
       C-22,-18 -26,-42 -36,-66
       C-42,-86 -44,-124 -40,-150 Z`
    : `M-40,-150
       C-12,-172 42,-170 78,-146
       C122,-126 162,-100 198,-70
       C210,-60 212,-42 200,-33
       C180,-19 150,-24 122,-40
       C104,-50 86,-55 68,-54
       C60,-18 66,16 90,50
       C120,94 140,166 146,252
       L-292,252
       C-278,178 -252,118 -210,70
       C-170,24 -124,-16 -92,-62
       C-74,-88 -60,-126 -40,-150 Z`;
  const leg = headOnly
    ? ""
    : `<path d="M84,46 C114,100 148,150 192,198 C218,224 240,254 246,284 L204,294 C194,258 174,230 150,206 C110,166 82,116 62,66 Z" fill="${P.fur}"/>
       <path d="M100,64 C126,108 156,152 196,198 C216,220 232,244 238,270" fill="none" stroke="${P.furShade}" stroke-width="11" opacity="0.38" stroke-linecap="round"/>`;
  const backShade = headOnly
    ? ""
    : `<path d="M-206,72 C-160,114 -112,184 -94,252 L-292,252 C-278,178 -252,118 -206,72 Z" fill="${P.furShade}" opacity="0.26"/>`;
  return `
  <g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s}) rotate(${rot})">
    <path d="${silhouette}" fill="url(#dog-fur)"/>
    ${backShade}
    ${leg}
    <path d="M-16,-150 C-56,-140 -80,-98 -70,-46 C-46,-70 -24,-108 -6,-142 Z" fill="${P.furShade}"/>
    <path d="M-26,-142 C-48,-130 -62,-106 -58,-74 C-46,-92 -34,-116 -22,-138 Z" fill="#E8B49E" opacity="0.78"/>
    <path d="M92,-96 C136,-100 172,-82 198,-58 C176,-32 138,-24 108,-36 C104,-58 98,-78 92,-96 Z" fill="${P.furLight}" opacity="0.72"/>
    <path d="M54,-132 q18,-10 34,-2" fill="none" stroke="${P.furShade}" stroke-width="6" opacity="0.45" stroke-linecap="round"/>
    <ellipse cx="70" cy="-112" rx="10" ry="12" fill="${P.green}"/>
    <circle cx="73" cy="-116" r="3.4" fill="#FFFFFF" opacity="0.9"/>
    <ellipse cx="197" cy="-54" rx="17" ry="14" fill="${P.green}"/>
    <ellipse cx="191" cy="-60" rx="6" ry="4" fill="#FFFFFF" opacity="0.32"/>
    <path d="M188,-30 q16,12 2,28" fill="none" stroke="${P.coralDeep}" stroke-width="6" stroke-linecap="round" opacity="0.8"/>
    <path d="M182,-20 q10,18 0,28 q-13,-3 -10,-17 z" fill="${P.coral}"/>
  </g>`;
}

function dogPaw(opts = {}) {
  const { x = 0, y = 0, s = 1, rot = 0, flip = false } = opts;
  return `
  <g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s}) rotate(${rot})">
    <ellipse cx="0" cy="24" rx="60" ry="44" fill="url(#dog-fur)"/>
    <ellipse cx="-33" cy="-24" rx="18" ry="23" fill="${P.fur}"/>
    <ellipse cx="-5" cy="-38" rx="18" ry="24" fill="${P.fur}"/>
    <ellipse cx="24" cy="-34" rx="17" ry="22" fill="${P.fur}"/>
    <ellipse cx="47" cy="-14" rx="15" ry="19" fill="${P.fur}"/>
    <ellipse cx="0" cy="32" rx="32" ry="24" fill="${P.furShade}" opacity="0.45"/>
    <ellipse cx="-6" cy="28" rx="13" ry="10" fill="${P.coralDeep}" opacity="0.22"/>
  </g>`;
}

function railPaw(paw) {
  if (!paw) return "";
  const { dx = 0, s = 1, rot = 0 } = paw;
  return dogPaw({ x: 48 + dx, y: -400 - 21 - 68 * s, s, rot });
}

function dogDefs(id) {
  return `<linearGradient id="dog-fur" x1="0.1" y1="0" x2="0.6" y2="1">
    <stop offset="0%" stop-color="${P.furLight}"/>
    <stop offset="58%" stop-color="${P.fur}"/>
    <stop offset="100%" stop-color="${P.furShade}"/>
  </linearGradient>`;
}

function sceneHero() {
  const id = "hero";
  const w = 1600;
  const h = 1200;
  const body = `
${studio(id, w, h)}
<circle cx="${w * 0.78}" cy="${h * 0.2}" r="165" fill="${P.sagePale}" opacity="0.65"/>
<circle cx="${w * 0.15}" cy="${h * 0.78}" r="108" fill="${P.coralPale}" opacity="0.6"/>
<ellipse cx="${w * 0.52}" cy="${h * 0.885}" rx="400" ry="54" fill="url(#${id}-shadow)"/>
<g transform="translate(${w * 0.52} ${h * 0.88}) scale(1.42)">
  ${productHero(id)}
</g>`;
  return svgWrap(w, h, body, defs(id) + dogDefs(id));
}

function sceneTop() {
  const id = "top";
  const w = 1400;
  const h = 1400;
  const body = `
${studio(id, w, h, { floor: false })}
<ellipse cx="${w / 2}" cy="${h * 0.845}" rx="486" ry="44" fill="url(#${id}-shadow)"/>
<g transform="translate(${w / 2} ${h * 0.44}) scale(1.72)">
  ${productTop(id)}
</g>`;
  return svgWrap(w, h, body, defs(id) + dogDefs(id));
}

function sceneSide() {
  const id = "side";
  const w = 1600;
  const h = 1100;
  const body = `
${studio(id, w, h)}
<ellipse cx="${w * 0.5}" cy="${h * 0.885}" rx="400" ry="50" fill="url(#${id}-shadow)"/>
<g transform="translate(${w * 0.5} ${h * 0.88}) scale(1.3)">
  ${productSide(id)}
</g>`;
  return svgWrap(w, h, body, defs(id) + dogDefs(id));
}

function sceneCutaway() {
  const id = "cut";
  const w = 1600;
  const h = 1200;
  const label = (x, y, title, sub, color) => `
<text x="${x}" y="${y}" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="25" font-weight="700" fill="${color}" letter-spacing="1.4">${title}</text>
<text x="${x}" y="${y + 30}" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="18" font-weight="500" fill="${color}" opacity="0.74">${sub}</text>`;
  const body = `
${studio(id, w, h, { floor: false })}
<rect width="${w}" height="${h}" fill="${P.green}" opacity="0.04"/>
<g transform="translate(${w * 0.42} ${h * 0.88}) scale(1.24)">
  ${productCutaway(id)}
</g>
<g>
  <path d="M880,560 h210" stroke="${P.green}" stroke-width="2.5" opacity="0.45"/>
  <circle cx="880" cy="560" r="6" fill="${P.green}" opacity="0.55"/>
  ${label(1104, 556, "TREAT CHAMBER", "Portion held until release", P.green)}
  <path d="M880,760 h210" stroke="${P.green}" stroke-width="2.5" opacity="0.45"/>
  <circle cx="880" cy="760" r="6" fill="${P.green}" opacity="0.55"/>
  ${label(1104, 756, "SLIDER RAIL", "Paw-and-nose travel path", P.green)}
  <path d="M880,840 h210" stroke="${P.green}" stroke-width="2.5" opacity="0.45"/>
  <circle cx="880" cy="840" r="6" fill="${P.green}" opacity="0.55"/>
  ${label(1104, 836, "RELEASE GATE", "Opens only when aligned", P.green)}
  <path d="M560,470 h120 v-150" stroke="${P.coralDeep}" stroke-width="2.5" opacity="0.4" fill="none"/>
  <circle cx="560" cy="470" r="6" fill="${P.coralDeep}" opacity="0.5"/>
  ${label(694, 268, "SCENT CHAMBER", "Coral scent + treat window", P.coralDeep)}
</g>`;
  return svgWrap(w, h, body, defs(id) + dogDefs(id));
}

function sceneInUse() {
  const id = "use";
  const w = 1600;
  const h = 1200;
  const body = `
${studio(id, w, h, { halo: true, floor: false })}
<path d="M0,${h * 0.74} q${w * 0.5},-70 ${w},0 v${h * 0.26} h-${w} z" fill="url(#${id}-floor)"/>
<circle cx="${w * 0.1}" cy="${h * 0.18}" r="130" fill="${P.coralPale}" opacity="0.55"/>
<circle cx="${w * 0.9}" cy="${h * 0.13}" r="96" fill="${P.sagePale}" opacity="0.8"/>
<ellipse cx="${w * 0.66}" cy="${h * 0.875}" rx="330" ry="46" fill="url(#${id}-shadow)"/>
<g transform="translate(${w * 0.68} ${h * 0.875}) scale(1.06)">
  ${productHero(id, { knobA: -20, knobB: 104 })}
</g>
<ellipse cx="300" cy="944" rx="252" ry="32" fill="#26332A" opacity="0.13"/>
<ellipse cx="748" cy="1122" rx="82" ry="17" fill="#26332A" opacity="0.16"/>
<g transform="translate(455 590) scale(1.42) rotate(4)">
  ${dogHeadProfile({ x: 0, y: 0 })}
</g>
<g opacity="0.6" transform="translate(786 542)">
  <path d="M0,0 q40,-30 96,-4" fill="none" stroke="${P.coralDeep}" stroke-width="6" stroke-linecap="round" stroke-dasharray="12 16"/>
  <path d="M6,32 q44,-28 100,-2" fill="none" stroke="${P.coralDeep}" stroke-width="6" stroke-linecap="round" stroke-dasharray="12 16" opacity="0.65"/>
</g>`;
  return svgWrap(w, h, body, defs(id) + dogDefs(id));
}

function mechanismDefs(id) {
  return [1, 2, 3]
    .map(
      (n) =>
        `<clipPath id="${id}-panel${n}"><rect x="-252" y="150" width="504" height="636" rx="34"/></clipPath>`
    )
    .join("");
}

function sceneMechanism() {
  const id = "mech";
  const w = 1800;
  const h = 940;
  const panel = (cx, num, title, sub, inner) => `
<g transform="translate(${cx} 0)">
  <rect x="-252" y="150" width="504" height="636" rx="34" fill="#FFFFFF" opacity="0.7"/>
  <rect x="-252" y="150" width="504" height="636" rx="34" fill="none" stroke="${P.creamShade}" stroke-width="3"/>
  <g clip-path="url(#${id}-panel${num})">${inner}</g>
  <circle cx="-198" cy="206" r="30" fill="${P.green}"/>
  <text x="-198" y="218" text-anchor="middle" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="28" font-weight="700" fill="#FFFFFF">${num}</text>
  <text x="0" y="846" text-anchor="middle" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="32" font-weight="700" fill="${P.green}" letter-spacing="1.4">${title}</text>
  <text x="0" y="880" text-anchor="middle" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="20" font-weight="500" fill="${P.green}" opacity="0.7">${sub}</text>
</g>`;
  const arrow = (x1, x2, y) => `
<g opacity="0.55">
  <path d="M${x1},${y} h${x2 - x1 - 28}" stroke="${P.sageDeep}" stroke-width="6" stroke-linecap="round"/>
  <path d="M${x2 - 32},${y - 14} l32,14 l-32,14 z" fill="${P.sageDeep}"/>
</g>`;
  const body = `
${studio(id, w, h, { halo: false, floor: false })}
<text x="${w / 2}" y="86" text-anchor="middle" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="38" font-weight="700" fill="${P.green}" letter-spacing="3">THREE PROPOSED STAGES</text>
<text x="${w / 2}" y="122" text-anchor="middle" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="20" font-weight="500" fill="${P.green}" opacity="0.66">SniffShift concept sequence — performance not yet verified</text>
${panel(300, "01", `SNIFF ${AMP} LOCATE`, "Dog finds the coral scent chamber", `
  <g transform="translate(0 740) scale(0.72)">
    ${productHero(id)}
  </g>
  <g transform="translate(-255 462) scale(0.36) rotate(-4)">
    ${dogHeadProfile({ x: 0, y: 0, headOnly: true })}
  </g>
  <g opacity="0.55">
    <circle cx="-128" cy="392" r="5" fill="${P.coralDeep}"/>
    <circle cx="-108" cy="368" r="4" fill="${P.coralDeep}"/>
    <circle cx="-86" cy="350" r="3" fill="${P.coralDeep}"/>
  </g>`)}
${arrow(540, 660, 460)}
${panel(900, "02", `SHIFT ${AMP} ALIGN`, "Paw and nose move the sage sliders", `
  <g transform="translate(0 740) scale(0.72)">
    ${productHero(id, { knobA: -90, knobB: 90, paw: { dx: 0, s: 0.95, rot: -14 } })}
  </g>
  <g opacity="0.7">
    <path d="M164,386 h64" stroke="${P.sageDeep}" stroke-width="6" stroke-linecap="round"/>
    <path d="M100,372 l-26,14 l26,14 z" fill="${P.sageDeep}"/>
  </g>`)}
${arrow(1140, 1260, 460)}
${panel(1500, "03", `WAIT ${AMP} RELEASE`, "Gate opens and the portion drops out", `
  <g transform="translate(0 740) scale(0.72)">
    ${productHero(id, { knobA: -20, knobB: 104 })}
  </g>
  <g opacity="0.5" transform="translate(150 320)">
    <circle cx="0" cy="0" r="50" fill="none" stroke="${P.green}" stroke-width="5"/>
    <path d="M0,-25 v29 l21,13" fill="none" stroke="${P.green}" stroke-width="5" stroke-linecap="round"/>
  </g>
  <circle cx="52" cy="688" r="7" fill="${P.amber}"/>
  <circle cx="70" cy="708" r="6" fill="${P.amber}"/>
  <g transform="translate(60 742)">
    <ellipse cx="0" cy="6" rx="62" ry="16" fill="#26332A" opacity="0.14"/>
    <path d="M-54,-22 q54,46 108,0 q8,56 -54,56 q-62,0 -54,-56 z" fill="${P.coralPale}" stroke="${P.coralDeep}" stroke-width="4"/>
    <circle cx="-20" cy="2" r="12" fill="${P.amber}"/>
    <circle cx="14" cy="14" r="10" fill="${P.amber}"/>
    <circle cx="24" cy="-12" r="9" fill="${P.amber}"/>
  </g>`)}`;
  return svgWrap(w, h, body, defs(id) + dogDefs(id) + mechanismDefs(id));
}

function svgWrap(w, h, body, defsBlock) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs>${defsBlock}</defs>
${body}
</svg>`;
}

const SCENES = [
  { name: "hero", svg: sceneHero(), w: 1600, h: 1200 },
  { name: "top", svg: sceneTop(), w: 1400, h: 1400 },
  { name: "side", svg: sceneSide(), w: 1600, h: 1100 },
  { name: "cutaway", svg: sceneCutaway(), w: 1600, h: 1200 },
  { name: "in-use", svg: sceneInUse(), w: 1600, h: 1200 },
  { name: "mechanism", svg: sceneMechanism(), w: 1800, h: 940 },
];

async function main() {
  await rm(TMP, { recursive: true, force: true });
  await mkdir(TMP, { recursive: true });
  await mkdir(OUT, { recursive: true });

  for (const scene of SCENES) {
    const svgPath = path.join(TMP, `${scene.name}.svg`);
    await writeFile(svgPath, scene.svg, "utf8");
    const png = await sharp(Buffer.from(scene.svg), { density: 220 })
      .resize(scene.w, scene.h, { fit: "fill" })
      .png({ compressionLevel: 9 })
      .toBuffer();
    await sharp(png).toFile(path.join(OUT, `${scene.name}.png`));
    await sharp(png).webp({ quality: 88, effort: 6 }).toFile(path.join(OUT, `${scene.name}.webp`));
    await sharp(png).avif({ quality: 62, effort: 6 }).toFile(path.join(OUT, `${scene.name}.avif`));
    const smallW = Math.round(scene.w * 0.5);
    const smallH = Math.round(scene.h * 0.5);
    const small = await sharp(png).resize(smallW, smallH, { fit: "fill" }).png().toBuffer();
    await sharp(small).webp({ quality: 84, effort: 6 }).toFile(path.join(OUT, `${scene.name}-sm.webp`));
    await sharp(small).avif({ quality: 58, effort: 6 }).toFile(path.join(OUT, `${scene.name}-sm.avif`));
    console.log(`rendered ${scene.name} ${scene.w}x${scene.h}`);
  }
  await rm(TMP, { recursive: true, force: true });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
