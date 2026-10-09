import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';

const getCroppedImg = async (imageSrc, pixelCrop, rotation = 0) => {
  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', (error) => reject(error));
    img.src = imageSrc;
  });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const maxSize = Math.max(image.width, image.height);
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

  canvas.width = safeArea;
  canvas.height = safeArea;

  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.translate(-safeArea / 2, -safeArea / 2);

  ctx.drawImage(
    image,
    safeArea / 2 - image.width / 2,
    safeArea / 2 - image.height / 2
  );

  const data = ctx.getImageData(0, 0, safeArea, safeArea);
  
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.putImageData(
    data,
    Math.round(0 - safeArea / 2 + image.width / 2 - pixelCrop.x),
    Math.round(0 - safeArea / 2 + image.height / 2 - pixelCrop.y)
  );

  return new Promise((resolve) => {
    canvas.toBlob((file) => {
      resolve(URL.createObjectURL(file));
    }, 'image/jpeg');
  });
};

const PhotoCropper = ({ imageSrc, onCropCompleteHandler, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
      onCropCompleteHandler(croppedImage);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.9)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', flex: 1 }}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={3 / 4}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
          onRotationChange={setRotation}
        />
      </div>
      <div style={{ padding: '20px', background: '#0a0a0f', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'center' }}>
          <label style={{ width: '80px', color: 'var(--fg)' }}>Zoom</label>
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            onChange={(e) => setZoom(e.target.value)}
            style={{ flex: 1 }}
          />
        </div>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'center' }}>
          <label style={{ width: '80px', color: 'var(--fg)' }}>Tilt</label>
          <input
            type="range"
            value={rotation}
            min={-180}
            max={180}
            step={1}
            onChange={(e) => setRotation(e.target.value)}
            style={{ flex: 1 }}
          />
        </div>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'flex-end' }}>
          <button className="btn-outline" onClick={onCancel}>Cancel</button>
          <button className="btn-primary" onClick={handleSave}><span>Save Crop</span></button>
        </div>
      </div>
    </div>
  );
};

export default PhotoCropper;
