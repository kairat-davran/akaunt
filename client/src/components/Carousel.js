import React from 'react'
import { useSelector } from 'react-redux';

const Carousel = ({ images, id }) => {
  const isActive = (index) => (index === 0 ? "active" : "");
  const theme = useSelector((state) => state.theme);

  return (
    <div
      id={`image${id}`}
      className="carousel slide"
      data-ride="carousel"
      style={{ height: '500px', overflow: 'hidden' }}
    >
      <ol className="carousel-indicators" style={{ zIndex: 1 }}>
        {images?.map((img, index) => (
          <li key={index} data-target={`#image${id}`} data-slide-to={index} className={isActive(index)} />
        ))}
      </ol>

      <div className="carousel-inner" style={{ height: '100%' }}>
        {images?.map((img, index) => {
          const src = img?.url || img?.uri || '';
          const isVideo = src.match(/\.(mp4|webm|ogg)$/i);

          return (
            <div key={index} className={`carousel-item ${isActive(index)}`} style={{ height: '100%' }}>
              {isVideo ? (
                <video
                  controls
                  className="d-block w-100"
                  style={{
                    height: '100%',
                    objectFit: 'contain',
                    filter: theme ? 'invert(1)' : 'invert(0)',
                  }}
                >
                  <source src={src} />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={src}
                  className="d-block w-100"
                  alt={`carousel-media-${index}`}
                  style={{
                    height: '100%',
                    objectFit: 'contain',
                    filter: theme ? 'invert(1)' : 'invert(0)',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {images?.length > 1 && (
        <>
          <a className="carousel-control-prev" href={`#image${id}`} role="button" data-slide="prev" style={{ width: '5%' }}>
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="sr-only">Previous</span>
          </a>

          <a className="carousel-control-next" href={`#image${id}`} role="button" data-slide="next" style={{ width: '5%' }}>
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="sr-only">Next</span>
          </a>
        </>
      )}
    </div>
  );
};

export default Carousel;