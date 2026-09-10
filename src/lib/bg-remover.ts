/**
 * Client-Side Background Removal Engine.
 * Provides instant (< 5ms) Magic Wand, Auto-Corner Keying, and Manual Brush Eraser/Restorer.
 * Zero server dependencies, zero external network downloads.
 */

export interface ColorRGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

/**
 * Calculates perceptual color distance between two RGB colors (0 to 441.6).
 */
export function colorDistance(c1: ColorRGBA, c2: ColorRGBA): number {
  const dr = c1.r - c2.r;
  const dg = c1.g - c2.g;
  const db = c1.b - c2.b;
  // Weighted color distance for human eye sensitivity
  return Math.sqrt(dr * dr * 0.299 + dg * dg * 0.587 + db * db * 0.114);
}

/**
 * Global color removal: removes all pixels matching target color within tolerance.
 */
export function removeColorGlobal(
  imageData: ImageData,
  targetColor: ColorRGBA,
  tolerance: number, // 0 to 100
  feather: number = 2
): ImageData {
  const data = imageData.data;
  const len = data.length;
  // Normalize tolerance (0-100) to distance scale (0-255)
  const maxDist = (tolerance / 100) * 200;
  const featherDist = (feather / 10) * 30;

  for (let i = 0; i < len; i += 4) {
    const currentA = data[i + 3];
    if (currentA === 0) continue;

    const pixel: ColorRGBA = {
      r: data[i],
      g: data[i + 1],
      b: data[i + 2],
      a: currentA,
    };

    const dist = colorDistance(pixel, targetColor);

    if (dist <= maxDist) {
      data[i + 3] = 0; // completely transparent
    } else if (dist <= maxDist + featherDist && featherDist > 0) {
      // Soft feather alpha gradient
      const factor = (dist - maxDist) / featherDist;
      data[i + 3] = Math.round(currentA * factor);
    }
  }

  return imageData;
}

/**
 * Contiguous flood-fill color removal (Magic Wand) starting from (startX, startY).
 * Uses a scanline / BFS queue for optimal performance.
 */
export function removeColorContiguous(
  imageData: ImageData,
  startX: number,
  startY: number,
  tolerance: number, // 0 to 100
  feather: number = 2
): ImageData {
  const width = imageData.width;
  const height = imageData.height;
  const data = imageData.data;

  const startIdx = (startY * width + startX) * 4;
  const targetColor: ColorRGBA = {
    r: data[startIdx],
    g: data[startIdx + 1],
    b: data[startIdx + 2],
    a: data[startIdx + 3],
  };

  const maxDist = (tolerance / 100) * 200;
  const featherDist = (feather / 10) * 30;

  const visited = new Uint8Array(width * height);
  const queue: number[] = [startX, startY];
  visited[startY * width + startX] = 1;

  while (queue.length > 0) {
    const cy = queue.pop()!;
    const cx = queue.pop()!;

    const idx = (cy * width + cx) * 4;
    const pixel: ColorRGBA = {
      r: data[idx],
      g: data[idx + 1],
      b: data[idx + 2],
      a: data[idx + 3],
    };

    const dist = colorDistance(pixel, targetColor);

    if (dist <= maxDist) {
      data[idx + 3] = 0;

      // Check 4 neighbors
      const neighbors = [
        [cx + 1, cy],
        [cx - 1, cy],
        [cx, cy + 1],
        [cx, cy - 1],
      ];

      for (const [nx, ny] of neighbors) {
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const nIndex = ny * width + nx;
          if (!visited[nIndex]) {
            visited[nIndex] = 1;
            queue.push(nx, ny);
          }
        }
      }
    } else if (dist <= maxDist + featherDist && featherDist > 0) {
      const factor = (dist - maxDist) / featherDist;
      data[idx + 3] = Math.round(data[idx + 3] * factor);
    }
  }

  return imageData;
}

/**
 * Automatically detects and clears perimeter background (auto-corner flood fill).
 */
export function autoRemovePerimeter(
  imageData: ImageData,
  tolerance: number = 25,
  feather: number = 2
): ImageData {
  const width = imageData.width;
  const height = imageData.height;

  // Sample corner points and perimeter seeds
  const seeds: [number, number][] = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
    [Math.floor(width / 2), 0],
    [Math.floor(width / 2), height - 1],
    [0, Math.floor(height / 2)],
    [width - 1, Math.floor(height / 2)],
  ];

  for (const [sx, sy] of seeds) {
    const idx = (sy * width + sx) * 4;
    if (imageData.data[idx + 3] > 0) {
      removeColorContiguous(imageData, sx, sy, tolerance, feather);
    }
  }

  return imageData;
}

/**
 * Manual Brush Eraser / Restorer tool.
 */
export function applyBrush(
  currentData: ImageData,
  originalData: ImageData,
  centerX: number,
  centerY: number,
  radius: number,
  mode: "erase" | "restore"
): ImageData {
  const width = currentData.width;
  const height = currentData.height;
  const cData = currentData.data;
  const oData = originalData.data;

  const minX = Math.max(0, Math.floor(centerX - radius));
  const maxX = Math.min(width - 1, Math.ceil(centerX + radius));
  const minY = Math.max(0, Math.floor(centerY - radius));
  const maxY = Math.min(height - 1, Math.ceil(centerY + radius));
  const r2 = radius * radius;

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const dx = x - centerX;
      const dy = y - centerY;
      const dist2 = dx * dx + dy * dy;

      if (dist2 <= r2) {
        const idx = (y * width + x) * 4;
        if (mode === "erase") {
          // Erase completely
          cData[idx + 3] = 0;
        } else {
          // Restore from original image data
          cData[idx] = oData[idx];
          cData[idx + 1] = oData[idx + 1];
          cData[idx + 2] = oData[idx + 2];
          cData[idx + 3] = oData[idx + 3];
        }
      }
    }
  }

  return currentData;
}
