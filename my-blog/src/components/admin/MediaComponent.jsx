// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { getAllMedia } from "../../services/MediaService";

const MediaComponent = () => {
  const [mediaList, setMediaList] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  useEffect(() => {
    getAllMedia()
      .then((response) => setMediaList(response.data))
      .catch((error) => console.error("Error loading images:", error));
  }, []);

  // Mở ảnh trong popup
  const openImage = (index) => {
    setSelectedImageIndex(index);
  };

  // Đóng popup ảnh
  const closeImage = () => {
    setSelectedImageIndex(null);
  };

  // Chuyển sang ảnh tiếp theo
  const nextImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prevIndex) => (prevIndex + 1) % mediaList.length);
    }
  };

  // Chuyển sang ảnh trước đó
  const prevImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(
        (prevIndex) => (prevIndex - 1 + mediaList.length) % mediaList.length
      );
    }
  };

  return (
    <div className="content">
      <div className="row mt-5">
        <div className="container">
          <div className="table-title text-center fw-bold">MEDIA TABLE</div>
          <div className="table">
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0px" }}>
              {mediaList.map((media, index) => (
                <div key={media.id} style={{ width: "150px" }}>
                  <div
                    className="d-flex align-items-center justify-content-center border bg-light fw-bold"
                    style={{
                      width: "150px",
                      height: "150px",
                      borderRadius: "5px",
                      padding: "0",
                      margin: "0",
                      cursor: "pointer",
                    }}
                    onClick={() => openImage(index)}
                  >
                    <img
                      src={media.filePath}
                      alt={media.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "5px",
                        display: "block",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Popup hiển thị ảnh khi click */}
      {selectedImageIndex !== null && (
        <div className="popup-overlay" onClick={closeImage}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-button" onClick={closeImage}>
              &times;
            </span>
            <button className="prev-button" onClick={prevImage}>
              &#10094;
            </button>
            <img
              src={mediaList[selectedImageIndex].filePath}
              alt="Selected"
              className="popup-image"
            />
            <button className="next-button" onClick={nextImage}>
              &#10095;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaComponent;
