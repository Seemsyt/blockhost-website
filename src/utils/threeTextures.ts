import * as THREE from 'three';
import { BlockType } from '../types';

// Helper to create an offscreen canvas
function createPixelCanvas(size = 16): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  return [canvas, ctx];
}

// Generate procedurally authentic Minecraft textures
export function generateBlockTextures(type: BlockType): THREE.Material[] {
  const materials: THREE.Material[] = [];

  switch (type) {
    case 'grass': {
      // Right, Left, Top, Bottom, Front, Back
      const sideTex = createGrassSideTexture();
      const topTex = createGrassTopTexture();
      const bottomTex = createDirtTexture();

      const sideMat = new THREE.MeshStandardMaterial({ map: sideTex, roughness: 0.8 });
      const topMat = new THREE.MeshStandardMaterial({ map: topTex, roughness: 0.6 });
      const bottomMat = new THREE.MeshStandardMaterial({ map: bottomTex, roughness: 0.9 });

      return [sideMat, sideMat, topMat, bottomMat, sideMat, sideMat];
    }
    case 'dirt': {
      const dirtTex = createDirtTexture();
      const mat = new THREE.MeshStandardMaterial({ map: dirtTex, roughness: 0.9 });
      return [mat, mat, mat, mat, mat, mat];
    }
    case 'diamond_ore': {
      const oreTex = createDiamondOreTexture();
      const mat = new THREE.MeshStandardMaterial({ 
        map: oreTex, 
        roughness: 0.5,
        emissive: new THREE.Color(0x00ffff),
        emissiveIntensity: 0.15
      });
      return [mat, mat, mat, mat, mat, mat];
    }
    case 'tnt': {
      const tntSide = createTntSideTexture();
      const tntTop = createTntTopTexture();
      const tntBottom = createTntBottomTexture();

      const sideMat = new THREE.MeshStandardMaterial({ map: tntSide, roughness: 0.7 });
      const topMat = new THREE.MeshStandardMaterial({ map: tntTop, roughness: 0.7 });
      const bottomMat = new THREE.MeshStandardMaterial({ map: tntBottom, roughness: 0.7 });

      return [sideMat, sideMat, topMat, bottomMat, sideMat, sideMat];
    }
    case 'command_block': {
      const cmdTex = createCommandBlockTexture();
      const mat = new THREE.MeshStandardMaterial({ 
        map: cmdTex, 
        roughness: 0.4,
        emissive: new THREE.Color(0xec4899),
        emissiveIntensity: 0.25
      });
      return [mat, mat, mat, mat, mat, mat];
    }
    case 'netherite': {
      const nethTex = createNetheriteTexture();
      const mat = new THREE.MeshStandardMaterial({ 
        map: nethTex, 
        roughness: 0.3, 
        metalness: 0.8 
      });
      return [mat, mat, mat, mat, mat, mat];
    }
    case 'bedrock_block': {
      const bedTex = createBedrockTexture();
      const mat = new THREE.MeshStandardMaterial({ map: bedTex, roughness: 0.95 });
      return [mat, mat, mat, mat, mat, mat];
    }
    case 'lucky_block':
    default: {
      const luckyTex = createLuckyBlockTexture();
      const mat = new THREE.MeshStandardMaterial({ 
        map: luckyTex, 
        roughness: 0.3,
        emissive: new THREE.Color(0xffb703),
        emissiveIntensity: 0.2
      });
      return [mat, mat, mat, mat, mat, mat];
    }
  }
}

function wrapTexture(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// 1. Dirt Texture (16x16)
function createDirtTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = createPixelCanvas(16);
  const colors = ['#866043', '#725036', '#5c3e28', '#6b472e', '#966d4f', '#4e3320'];

  for (let x = 0; x < 16; x++) {
    for (let y = 0; y < 16; y++) {
      const noise = Math.floor(Math.random() * colors.length);
      ctx.fillStyle = colors[noise];
      ctx.fillRect(x, y, 1, 1);
    }
  }
  return wrapTexture(canvas);
}

// 2. Grass Top Texture (16x16)
function createGrassTopTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = createPixelCanvas(16);
  const greens = ['#4c9b33', '#5ca93e', '#3d8628', '#64b644', '#387823', '#53a238'];

  for (let x = 0; x < 16; x++) {
    for (let y = 0; y < 16; y++) {
      const noise = Math.floor(Math.random() * greens.length);
      ctx.fillStyle = greens[noise];
      ctx.fillRect(x, y, 1, 1);
    }
  }
  return wrapTexture(canvas);
}

// 3. Grass Side (with dripping grass overhang)
function createGrassSideTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = createPixelCanvas(16);
  const dirtColors = ['#866043', '#725036', '#5c3e28', '#6b472e', '#4e3320'];
  const greens = ['#4c9b33', '#5ca93e', '#3d8628', '#64b644', '#387823'];

  // Fill base with dirt
  for (let x = 0; x < 16; x++) {
    for (let y = 0; y < 16; y++) {
      const noise = Math.floor(Math.random() * dirtColors.length);
      ctx.fillStyle = dirtColors[noise];
      ctx.fillRect(x, y, 1, 1);
    }
  }

  // Draw irregular grass drips on top 2-5 pixels
  const hangLengths = [3, 4, 3, 2, 4, 5, 3, 2, 3, 4, 5, 4, 3, 2, 4, 3];
  for (let x = 0; x < 16; x++) {
    const depth = hangLengths[x];
    for (let y = 0; y < depth; y++) {
      const noise = Math.floor(Math.random() * greens.length);
      ctx.fillStyle = greens[noise];
      ctx.fillRect(x, y, 1, 1);
    }
  }

  return wrapTexture(canvas);
}

// 4. Diamond Ore Texture
function createDiamondOreTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = createPixelCanvas(16);
  const stoneColors = ['#696969', '#787878', '#5a5a5a', '#8a8a8a', '#4f4f4f'];
  const diamondColors = ['#2cfbfc', '#55ffff', '#18d4d4', '#d0ffff', '#0fa8a8'];

  // Fill stone
  for (let x = 0; x < 16; x++) {
    for (let y = 0; y < 16; y++) {
      ctx.fillStyle = stoneColors[Math.floor(Math.random() * stoneColors.length)];
      ctx.fillRect(x, y, 1, 1);
    }
  }

  // Diamond Ore Clusters
  const gemPositions = [
    [3, 3], [4, 3], [3, 4], [4, 4], [5, 4],
    [10, 8], [11, 8], [10, 9], [11, 9], [12, 9], [11, 10],
    [4, 11], [5, 11], [5, 12], [6, 12],
    [11, 3], [12, 3], [12, 4]
  ];

  gemPositions.forEach(([x, y]) => {
    ctx.fillStyle = diamondColors[Math.floor(Math.random() * diamondColors.length)];
    ctx.fillRect(x, y, 1, 1);
  });

  return wrapTexture(canvas);
}

// 5. TNT Side Texture
function createTntSideTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = createPixelCanvas(16);
  const redColors = ['#d12d20', '#b82318', '#e3382c', '#a51c12'];
  const whiteColors = ['#e6e6e6', '#ffffff', '#cccccc'];

  // Background red
  for (let x = 0; x < 16; x++) {
    for (let y = 0; y < 16; y++) {
      ctx.fillStyle = redColors[Math.floor(Math.random() * redColors.length)];
      ctx.fillRect(x, y, 1, 1);
    }
  }

  // White band across y: 6 to 10
  for (let x = 0; x < 16; x++) {
    for (let y = 6; y <= 9; y++) {
      ctx.fillStyle = whiteColors[Math.floor(Math.random() * whiteColors.length)];
      ctx.fillRect(x, y, 1, 1);
    }
  }

  // Draw black TNT letters
  ctx.fillStyle = '#111111';
  // T
  ctx.fillRect(2, 6, 3, 1);
  ctx.fillRect(3, 7, 1, 3);

  // N
  ctx.fillRect(6, 6, 1, 4);
  ctx.fillRect(7, 7, 1, 1);
  ctx.fillRect(8, 8, 1, 1);
  ctx.fillRect(9, 6, 1, 4);

  // T
  ctx.fillRect(11, 6, 3, 1);
  ctx.fillRect(12, 7, 1, 3);

  return wrapTexture(canvas);
}

// TNT Top
function createTntTopTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = createPixelCanvas(16);
  const redColors = ['#d12d20', '#b82318', '#e3382c'];
  for (let x = 0; x < 16; x++) {
    for (let y = 0; y < 16; y++) {
      ctx.fillStyle = redColors[Math.floor(Math.random() * redColors.length)];
      ctx.fillRect(x, y, 1, 1);
    }
  }
  // Fuse center
  ctx.fillStyle = '#4a3219';
  ctx.fillRect(7, 7, 2, 2);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(7, 7, 1, 1);
  return wrapTexture(canvas);
}

// TNT Bottom
function createTntBottomTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = createPixelCanvas(16);
  const redColors = ['#d12d20', '#b82318', '#a51c12'];
  for (let x = 0; x < 16; x++) {
    for (let y = 0; y < 16; y++) {
      ctx.fillStyle = redColors[Math.floor(Math.random() * redColors.length)];
      ctx.fillRect(x, y, 1, 1);
    }
  }
  return wrapTexture(canvas);
}

// 6. Command Block
function createCommandBlockTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = createPixelCanvas(16);
  const base = ['#c97b47', '#b56736', '#9c5225', '#db8e5c'];
  for (let x = 0; x < 16; x++) {
    for (let y = 0; y < 16; y++) {
      ctx.fillStyle = base[Math.floor(Math.random() * base.length)];
      ctx.fillRect(x, y, 1, 1);
    }
  }

  // Draw technical core ring
  ctx.fillStyle = '#222222';
  ctx.fillRect(4, 4, 8, 8);
  ctx.fillStyle = '#4fd1c5';
  ctx.fillRect(5, 5, 6, 6);
  ctx.fillStyle = '#99f6e4';
  ctx.fillRect(7, 7, 2, 2);

  // Screws at 4 corners
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(1, 1, 2, 2);
  ctx.fillRect(13, 1, 2, 2);
  ctx.fillRect(1, 13, 2, 2);
  ctx.fillRect(13, 13, 2, 2);

  return wrapTexture(canvas);
}

// 7. Netherite Block
function createNetheriteTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = createPixelCanvas(16);
  const colors = ['#383236', '#474045', '#2a2529', '#544c52', '#1f1b1e'];
  for (let x = 0; x < 16; x++) {
    for (let y = 0; y < 16; y++) {
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.fillRect(x, y, 1, 1);
    }
  }
  // Metallic cross plate seams
  ctx.fillStyle = '#181417';
  ctx.fillRect(0, 7, 16, 2);
  ctx.fillRect(7, 0, 2, 16);
  return wrapTexture(canvas);
}

// 8. Bedrock
function createBedrockTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = createPixelCanvas(16);
  const colors = ['#111111', '#262626', '#3b3b3b', '#525252', '#080808'];
  for (let x = 0; x < 16; x++) {
    for (let y = 0; y < 16; y++) {
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.fillRect(x, y, 1, 1);
    }
  }
  return wrapTexture(canvas);
}

// 9. Lucky Block
function createLuckyBlockTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = createPixelCanvas(16);
  const gold = ['#f59e0b', '#d97706', '#fbbf24', '#b45309'];
  for (let x = 0; x < 16; x++) {
    for (let y = 0; y < 16; y++) {
      ctx.fillStyle = gold[Math.floor(Math.random() * gold.length)];
      ctx.fillRect(x, y, 1, 1);
    }
  }
  // Bevel border
  ctx.fillStyle = '#92400e';
  ctx.strokeRect(0.5, 0.5, 15, 15);

  // Question mark
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(6, 3, 4, 1);
  ctx.fillRect(9, 4, 2, 2);
  ctx.fillRect(7, 6, 3, 2);
  ctx.fillRect(7, 9, 2, 2);
  ctx.fillRect(7, 12, 2, 2);

  return wrapTexture(canvas);
}
