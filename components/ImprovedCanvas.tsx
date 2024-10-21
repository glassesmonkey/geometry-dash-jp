import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'next-i18next'; 
interface ImprovedCanvasProps {
  canvasRatio: number;
  setCanvasRatio: (ratio: number) => void;
  originalPhoto: string | null;
  setOriginalPhoto: (photo: string | null) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  imagePosition?: string;
  onImageSizeChange: (size: { width: number; height: number }) => void;
  baseResolution: string;
  mode: 'speed' | 'highQuality';
  dragPosition: { top: number; left: number; bottom: number; right: number };
  onDragPositionChange: (newPosition: { top: number; left: number; bottom: number; right: number }) => void;
}

const ImprovedCanvas: React.FC<ImprovedCanvasProps> = ({
  canvasRatio,
  setCanvasRatio,
  originalPhoto,
  setOriginalPhoto,
  zoom,
  setZoom,
  imagePosition,
  onImageSizeChange,
  baseResolution,
  mode,
  dragPosition,
  onDragPositionChange,
}) => {
  const { t } = useTranslation('ai-expand-image');
  const [outerCanvasSize, setOuterCanvasSize] = useState({ width: 0, height: 0 });
  const [innerCanvasSize, setInnerCanvasSize] = useState({ width: 0, height: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [scaledImageSize, setScaledImageSize] = useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const memoizedOnImageSizeChange = useCallback(onImageSizeChange, [onImageSizeChange]);
  useEffect(() => {
    if (mode === 'highQuality' && imageRef.current) {
      const img = imageRef.current;
      const container = img.parentElement;
      if (container) {
        const imgRect = img.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        const newLeft = Math.round((containerRect.width - imgRect.width) / 2);
        const newTop = Math.round((containerRect.height - imgRect.height) / 2);
        const newRight = Math.round(containerRect.width - newLeft - imgRect.width);
        const newBottom = Math.round(containerRect.height - newTop - imgRect.height);
        
        onDragPositionChange({
          top: newTop,
          left: newLeft,
          bottom: newBottom,
          right: newRight
        });
      }
    }
  }, [mode, onDragPositionChange]);
  useEffect(() => {
    setZoom(100);
  }, [setZoom]);

  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const outerWidth = Math.min(containerWidth, 600);
        const outerHeight = outerWidth;
        setOuterCanvasSize({ width: outerWidth, height: outerHeight });

        let innerWidth, innerHeight;
        if (canvasRatio >= 1) {
          innerWidth = outerWidth;
          innerHeight = outerWidth / canvasRatio;
        } else {
          innerHeight = outerHeight;
          innerWidth = outerHeight * canvasRatio;
        }
        setInnerCanvasSize({ width: innerWidth, height: innerHeight });
      }
    };

    window.addEventListener('resize', updateCanvasSize);
    updateCanvasSize();

    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [canvasRatio]);

  useEffect(() => {
    if (imageRef.current) {
      const img = imageRef.current;
      if (img.complete) {
        handleImageLoad();
      } else {
        img.onload = handleImageLoad;
      }
    }
  }, [originalPhoto]);

  const handleImageLoad = () => {
    if (imageRef.current) {
      const { naturalWidth, naturalHeight } = imageRef.current;
      console.log("Image loaded, natural size:", { width: naturalWidth, height: naturalHeight });
      setImageSize({ width: naturalWidth, height: naturalHeight });
    }
  };

  useEffect(() => {
    if (imageSize.width && imageSize.height && innerCanvasSize.width && innerCanvasSize.height) {
      const [baseWidth, baseHeight] = baseResolution.split('x').map(Number);
      const imageRatio = imageSize.width / imageSize.height;
      const templateRatio = baseWidth / baseHeight;

      let fitWidth, fitHeight;

      if (imageRatio > templateRatio) {
        fitWidth = baseWidth;
        fitHeight = baseWidth / imageRatio;
      } else {
        fitHeight = baseHeight;
        fitWidth = baseHeight * imageRatio;
      }

      const scaleFactor = zoom / 100;
      const scaledWidth = fitWidth * scaleFactor;
      const scaledHeight = fitHeight * scaleFactor;

      console.log("Calculating scaled image size:", {
        imageSize,
        innerCanvasSize,
        baseResolution,
        zoom,
        fitWidth,
        fitHeight,
        scaledWidth,
        scaledHeight
      });

      if (Math.abs(scaledWidth - scaledImageSize.width) > 0.1 || 
          Math.abs(scaledHeight - scaledImageSize.height) > 0.1) {
        setScaledImageSize({ width: scaledWidth, height: scaledHeight });
        memoizedOnImageSizeChange({
          width: Math.round(scaledWidth),
          height: Math.round(scaledHeight)
        });
      }
    } else {
      console.log("Not calculating scaled image size:", {
        imageSize,
        innerCanvasSize,
        baseResolution,
        zoom
      });
    }
  }, [imageSize, innerCanvasSize, zoom, memoizedOnImageSizeChange, baseResolution, scaledImageSize]);

  const handleDragStart = useCallback((clientX: number, clientY: number) => {
    if (mode === 'highQuality' && imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      setIsDragging(true);
      setDragStart({
        x: clientX - rect.left,
        y: clientY - rect.top,
      });
    }
  }, [mode]);

  const handleDrag = useCallback((clientX: number, clientY: number) => {
    if (isDragging && imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      const containerRect = imageRef.current.parentElement?.getBoundingClientRect();
      
      if (containerRect) {
        const newLeft = Math.round(Math.max(0, Math.min(clientX - containerRect.left - dragStart.x, containerRect.width - rect.width)));
        const newTop = Math.round(Math.max(0, Math.min(clientY - containerRect.top - dragStart.y, containerRect.height - rect.height)));
        
        // 计算图片相对于画布的位置，并取整
        const newRight = Math.round(containerRect.width - newLeft - rect.width);
        const newBottom = Math.round(containerRect.height - newTop - rect.height);
        
        onDragPositionChange({
          top: newTop,
          left: newLeft,
          bottom: newBottom,
          right: newRight
        });
      }
    }
  }, [isDragging, dragStart, onDragPositionChange]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default behavior
    handleDragStart(e.clientX, e.clientY);
  }, [handleDragStart]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    e.preventDefault(); // Prevent default behavior
    handleDrag(e.clientX, e.clientY);
  }, [handleDrag]);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    e.preventDefault(); // Prevent default behavior
    handleDragEnd();
  }, [handleDragEnd]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault(); // Prevent default behavior
    const touch = e.touches[0];
    handleDragStart(touch.clientX, touch.clientY);
  }, [handleDragStart]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault(); // Prevent default behavior
    const touch = e.touches[0];
    handleDrag(touch.clientX, touch.clientY);
  }, [handleDrag]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    e.preventDefault(); // Prevent default behavior
    handleDragEnd();
  }, [handleDragEnd]);

  useEffect(() => {
    if (mode === 'highQuality') {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [mode, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  const getImagePosition = () => {
    if (mode === 'speed') {
      const scale = zoom / 100;
      let transform = `scale(${scale})`;
      let top = '50%';
      let left = '50%';
      let transformOrigin = 'center';

      switch (imagePosition) {
        case 'top-left':
          top = '0';
          left = '0';
          transform = `translate(0, 0) scale(${scale})`;
          transformOrigin = 'top left';
          break;
        case 'top-right':
          top = '0';
          left = '100%';
          transform = `translate(-100%, 0) scale(${scale})`;
          transformOrigin = 'top right';
          break;
        case 'bottom-left':
          top = '100%';
          left = '0';
          transform = `translate(0, -100%) scale(${scale})`;
          transformOrigin = 'bottom left';
          break;
        case 'bottom-right':
          top = '100%';
          left = '100%';
          transform = `translate(-100%, -100%) scale(${scale})`;
          transformOrigin = 'bottom right';
          break;
        default: // center
          transform = `translate(-50%, -50%) scale(${scale})`;
          break;
      }

      return {
        position: 'absolute' as 'absolute',
        top,
        left,
        transform,
        transformOrigin,
        maxWidth: '100%',
        maxHeight: '100%',
        width: 'auto',
        height: 'auto',
        transition: 'transform 0.3s ease, top 0.3s ease, left 0.3s ease'
      };
    } else {
      const scale = zoom / 100;
      return {
        position: 'absolute' as 'absolute',
        top: `${dragPosition.top}px`,
        left: `${dragPosition.left}px`,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        maxWidth: '100%',
        maxHeight: '100%',
        width: 'auto',
        height: 'auto',
        transition: isDragging ? 'none' : 'transform 0.3s ease',
        cursor: 'move',
        userSelect: 'none' as 'none',
        WebkitUserSelect: 'none' as 'none',
        touchAction: 'none',
      };
    }
  };

  return (
    <div className="space-y-4 flex flex-col items-center" ref={containerRef}>
      <div
        style={{
          width: `${outerCanvasSize.width}px`,
          height: `${outerCanvasSize.height}px`,
          position: 'relative',
          background: '#f0f0f0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        className="rounded-lg overflow-hidden"
      >
        <div
          style={{
            width: `${innerCanvasSize.width}px`,
            height: `${innerCanvasSize.height}px`,
            position: 'relative',
            background: `
              linear-gradient(45deg, #d0d0d0 25%, transparent 25%),
              linear-gradient(-45deg, #d0d0d0 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #d0d0d0 75%),
              linear-gradient(-45deg, transparent 75%, #d0d0d0 75%)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
            overflow: 'hidden',
          }}
        >
          {originalPhoto && (
            <img
              ref={imageRef}
              src={originalPhoto}
              alt="Uploaded image"
              style={getImagePosition()}
              onMouseDown={mode === 'highQuality' ? handleMouseDown : undefined}
              onTouchStart={mode === 'highQuality' ? handleTouchStart : undefined}
            />
          )}
        </div>
      </div>
      <div style={{
        width: `${innerCanvasSize.width}px`,
        maxWidth: `${outerCanvasSize.width}px`
      }}>
        <input
          type="range"
          min="1"
          max="100"
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-full"
        />
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mt-3 rounded-md shadow-sm">
          <p className="font-medium">
          {t('improvedCanvas.proTip')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImprovedCanvas;