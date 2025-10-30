/**
 * Unity Canvas Screenshot Capture
 * F6 key captures the Unity canvas and downloads as JPEG
 * Future: Upload to Google Cloud Storage
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    captureKey: 'F6',
    imageFormat: 'image/jpeg',
    imageQuality: 0.95,
    filePrefix: 'screenshot_'
  };

  /**
   * Get formatted timestamp for filename
   * @returns {string} Timestamp in format YYYY-MM-DD_HH-mm-ss
   */
  function getTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
  }

  /**
   * Capture Unity canvas and convert to JPEG blob
   * Unity WebGL requires capturing on the next animation frame to get the rendered content
   * @param {HTMLCanvasElement} canvas - Unity canvas element
   * @returns {Promise<Blob>} JPEG image blob
   */
  function captureCanvas(canvas) {
    return new Promise((resolve, reject) => {
      // Use requestAnimationFrame to capture after Unity renders the current frame
      requestAnimationFrame(() => {
        // Wait one more frame to ensure rendering is complete
        requestAnimationFrame(() => {
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Failed to capture canvas'));
              }
            },
            CONFIG.imageFormat,
            CONFIG.imageQuality
          );
        });
      });
    });
  }

  /**
   * Download blob as file
   * @param {Blob} blob - Image blob
   * @param {string} filename - Download filename
   */
  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up object URL
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }

  /**
   * Upload to Google Cloud Storage (Future implementation)
   * @param {Blob} blob - Image blob
   * @param {string} filename - Filename for storage
   * @returns {Promise<string>} Cloud Storage URL
   */
  async function uploadToCloudStorage(blob, filename) {
    // TODO: Implement Google Cloud Storage upload
    // 1. Get signed upload URL from backend
    // 2. Upload blob to GCS
    // 3. Return public URL

    console.log('[Future] Upload to Cloud Storage:', filename, blob.size, 'bytes');

    // Example implementation structure:
    // const uploadUrl = await fetch('/api/get-upload-url', {
    //   method: 'POST',
    //   body: JSON.stringify({ filename })
    // }).then(r => r.json());
    //
    // await fetch(uploadUrl, {
    //   method: 'PUT',
    //   body: blob,
    //   headers: { 'Content-Type': CONFIG.imageFormat }
    // });
    //
    // return uploadUrl.replace(/\?.*$/, ''); // Remove query params for public URL

    return Promise.resolve('https://storage.googleapis.com/bucket-name/' + filename);
  }

  /**
   * Handle screenshot capture
   */
  async function handleScreenshot() {
    const canvas = document.querySelector('#unity-canvas');

    if (!canvas) {
      console.error('Unity canvas not found');
      return;
    }

    try {
      console.log('Capturing screenshot...');

      // Capture canvas as JPEG
      const blob = await captureCanvas(canvas);
      const filename = `${CONFIG.filePrefix}${getTimestamp()}.jpg`;

      console.log(`Screenshot captured: ${filename} (${blob.size} bytes)`);

      // Download locally
      downloadBlob(blob, filename);

      // Future: Upload to Cloud Storage
      // const cloudUrl = await uploadToCloudStorage(blob, filename);
      // console.log('Uploaded to Cloud Storage:', cloudUrl);

    } catch (error) {
      console.error('Screenshot failed:', error);
    }
  }

  /**
   * Initialize screenshot functionality
   */
  function init() {
    console.log('Screenshot module initialized. Press F6 to capture Unity canvas.');

    // Listen for F6 key
    document.addEventListener('keydown', (event) => {
      if (event.key === CONFIG.captureKey && !event.repeat) {
        event.preventDefault();
        handleScreenshot();
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
