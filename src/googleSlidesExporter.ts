/**
 * Helper utility to export our cartoon scenes to Google Slides
 * Uploads rendered frame blobs to Google Drive, sets permissions,
 * creates a Slides deck, and embeds each frame as a full-bleed vector image.
 */

// Helper: manual multipart base64 upload to Google Drive
export async function uploadFrameToDrive(blob: Blob, filename: string, accessToken: string): Promise<string> {
  const metadata = {
    name: filename,
    mimeType: 'image/png',
    description: 'Rendered Scene from Cartoon Slideshow Studio'
  };

  const boundary = 'cartoon_avatar_boundary_123';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelim = `\r\n--${boundary}--`;

  // Read Blob to Base64 in-browser
  const base64Data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const resultStr = reader.result as string;
      const base64 = resultStr.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(blob);
  });

  const metadataPart = 'Content-Type: application/json; charset=UTF-8\r\n\r\n' + JSON.stringify(metadata) + '\r\n';
  const mediaPart = 'Content-Type: image/png\r\nContent-Transfer-Encoding: base64\r\n\r\n' + base64Data + '\r\n';

  const multipartBody = delimiter + metadataPart + delimiter + mediaPart + closeDelim;

  const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`
    },
    body: multipartBody
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google Drive upload failed: ${errorText}`);
  }

  const data = await response.json();
  return data.id as string;
}

// Helper: share file on Drive so the Slides renderer service can access and load the image
export async function setFilePublicReader(fileId: string, accessToken: string): Promise<void> {
  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      role: 'reader',
      type: 'anyone'
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    console.warn(`Failed to set file permissions. Slides service might face download issues: ${errText}`);
  }
}

// MAIN FUNCTION: EXPORT storyboard layers array
export async function createGoogleSlidesPresentation(
  title: string,
  framesBlobs: Blob[],
  accessToken: string,
  onProgress?: (step: string, percent: number) => void
): Promise<{ presentationId: string; presentationUrl: string }> {
  try {
    // Step 1: Create a brand new Presentation
    onProgress?.('Creating empty Google Slides presentation...', 10);
    const presTitle = title || 'My Cartoon Story';
    const presResponse = await fetch('https://slides.googleapis.com/v1/presentations', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: presTitle })
    });

    if (!presResponse.ok) {
      const err = await presResponse.text();
      throw new Error(`Failed to create presentation: ${err}`);
    }

    const presentation = await presResponse.json();
    const presentationId = presentation.presentationId;
    const defaultSlideId = presentation.slides?.[0]?.objectId;

    // Step 2: Upload all frames to Google Drive & grant permissions
    const driveFileIds: string[] = [];
    const totalFrames = framesBlobs.length;

    for (let i = 0; i < totalFrames; i++) {
      const blob = framesBlobs[i];
      const percent = 10 + Math.floor((i / totalFrames) * 60); // 10% to 70% progress bar
      onProgress?.(`Uploading Cartoon Frame ${i + 1} of ${totalFrames} to Google Drive...`, percent);
      
      const fileName = `${presTitle.toLowerCase().replace(/\s+/g, '_')}_frame_${i + 1}.png`;
      const fileId = await uploadFrameToDrive(blob, fileName, accessToken);
      
      // Make read-accessible so Slides can display it
      await setFilePublicReader(fileId, accessToken);
      driveFileIds.push(fileId);
    }

    // Step 3: Add slides and insert images in a batch update
    onProgress?.('Generating storyboard and aligning vector images...', 80);
    const requests: any[] = [];

    // Append our customized slides with the corresponding image
    driveFileIds.forEach((fileId, index) => {
      const slideId = `slide_frame_custom_${index}_${Date.now().toString().slice(-4)}`;
      
      // Request 1: Create slide
      requests.push({
        createSlide: {
          objectId: slideId,
          insertionIndex: index, // insert starting from the beginning
          slideLayoutReference: { predefinedLayout: 'BLANK' }
        }
      });

      // Request 2: Create full-bleed image on the slide (size matches widescreen aspect ratio: 720 x 405 points)
      requests.push({
        createImage: {
          elementProperties: {
            pageObjectId: slideId,
            size: {
              width: { magnitude: 720, unit: 'PT' },
              height: { magnitude: 405, unit: 'PT' }
            },
            transform: {
              scaleX: 1,
              scaleY: 1,
              translateX: 0,
              translateY: 0,
              unit: 'PT'
            }
          },
          url: `https://docs.google.com/uc?id=${fileId}&export=download`
        }
      });
    });

    // Request 3: Delete the default initial title slide
    if (defaultSlideId) {
      requests.push({
        deleteObject: {
          objectId: defaultSlideId
        }
      });
    }

    onProgress?.('Sending updates to Google Slides services...', 90);
    const batchUpdateResponse = await fetch(`https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ requests })
    });

    if (!batchUpdateResponse.ok) {
      const err = await batchUpdateResponse.text();
      throw new Error(`Failed to insert scenes into slides: ${err}`);
    }

    onProgress?.('Presentation generated successfully!', 100);
    return {
      presentationId,
      presentationUrl: `https://docs.google.com/presentation/d/${presentationId}/edit`
    };

  } catch (err: any) {
    console.error('Google Slides integration error:', err);
    throw err;
  }
}
