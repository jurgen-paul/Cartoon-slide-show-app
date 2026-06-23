/**
 * Helper utility to rasterize dynamic SVG files on the browser client
 * utilizing modern canvas drawImage serialization safely.
 */

export async function rasterizeSvgToBlob(
  svgString: string,
  width: number = 800,
  height: number = 500
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Unable to request a 2D rendering context for canvas rasterizer'));
      return;
    }

    const img = new Image();
    
    // Create safe data url
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      try {
        // Draw plain default background first
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          URL.revokeObjectURL(url);
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Rendering of canvas to PNG Blob failed'));
          }
        }, 'image/png');
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };

    img.onerror = (error) => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load serialized SVG on browser rasterizer: ${error}`));
    };

    img.src = url;
  });
}
