import React, { useState, memo } from 'react';

export const ProductImage = memo(({ 
  src, 
  alt, 
  className, 
  fallbackSrc = "https://www.svgrepo.com/show/508699/landscape-placeholder.svg",
  loading = "lazy"
}) => {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  React.useEffect(() => {
    setImgSrc(src || fallbackSrc);
    setIsLoading(true);
  }, [src, fallbackSrc]);

  return (
    <div className="relative">
      {isLoading && (
        <div className={`absolute inset-0 bg-gray-200 animate-pulse ${className}`} />
      )}
      <img
        src={imgSrc}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onError={handleError}
        onLoad={handleLoad}
        loading={loading}
      />
    </div>
  );
});

ProductImage.displayName = 'ProductImage';