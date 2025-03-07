import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import pica from "pica";
import "./InputImage.css";
import debounce from "lodash.debounce";

const InputImage = () => {
  const [imageUpload, setImageUpload] = useState(true);
  const [loading, setLoading] = useState(null);
  const [resizedImage, setResizedImage] = useState(null);
  const [imageSize, setImageSize] = useState(null);

  const [height, setHeight] = useState(null);
  const [width, setWidth] = useState(null);
  const [quality, setQuality] = useState(0.5);
  const [qualityValue, setQualityValue] = useState(50);
  const [format, setFormat] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);

  const onDrop = useCallback((imageAccepted) => {
    const file = imageAccepted[0];

    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("wrong image format");
        return;
      }
      setImageUpload(false);
      setLoading(true);
      setFormat(file.type);

      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
        img.onload = () => {
          setHeight(img.height);
          setWidth(img.width);
          setOriginalImage(img);
        };
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const compressImage = useCallback(
    (img) => {
      if (!img) return;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const picaInstance = new pica();

      picaInstance
        .resize(img, canvas, {
          quality: 3,
          unsharpAmount: 120,
          unsharpRadius: 0.8,
          unsharpThreshold: 5,
        })
        .then((result) => picaInstance.toBlob(result, format, quality))
        .then((blob) => {
          const resizedURL = URL.createObjectURL(blob);
          setResizedImage(resizedURL);
          setLoading(false);

          let fileSize = blob.size;
          let formattedSize;
          if (fileSize < 1024 * 1024) {
            const fileSizeKB = (fileSize / 1024).toFixed(2);
            formattedSize = `${fileSizeKB} KB`;
          } else {
            const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);
            formattedSize = `${fileSizeMB} MB`;
          }

          setImageSize(formattedSize);

          console.log("successfull");
        })
        .catch((error) => {
          console.error("pica error: ", error);
          setLoading(false);
        });
    },
    [height, width, quality, format]
  );

  useEffect(() => {
    if (originalImage) {
      setLoading(true);
      const debouncedCompress = debounce((image) => compressImage(image), 1000);
      debouncedCompress(originalImage);
      return () => {
        debouncedCompress.cancel();
      };
    }
  }, [originalImage, compressImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: null,
    multiple: false,
  });

  const handleCancel = () => {
    setOriginalImage(null);
    setImageUpload(true);
    setResizedImage(null);
    setLoading(false);
    setQuality(0.5);
    setQualityValue(50);
  };

  return (
    <div {...getRootProps()} className="Container">
      {imageUpload && (
        <>
          <input {...getInputProps()} />
          <p aria-live="polite">
            {isDragActive
              ? "Drop the image..."
              : "Drag and drop image or browse to upload"}
          </p>
          <button type="" className="uploadButton">
            Upload
          </button>
        </>
      )}

      {loading && <div className="loadingSpinner"></div>}

      {resizedImage && (
        <div className="inputImageHolder">
          <div className="previewHeader">
            <div className="cancelButtonContainer">
              <i
                onClick={handleCancel}
                className="fa-solid fa-xmark cancelButton "
              ></i>
            </div>
            <p>Resized Image: </p>
          </div>
          <img
            src={resizedImage}
            alt="Resized Image"
            className="uploadedImage"
          />
          <div className="customSetting">
            <div className="fieldGroup">
              <label htmlFor="height">Height: </label>
              <input
                type="number"
                name="height"
                id="height"
                value={height}
                onChange={(e) => {
                  setHeight(e.target.value);
                }}
              />
            </div>
            <div className="fieldGroup">
              <label htmlFor="width">Width: </label>
              <input
                type="number"
                name="width"
                id="width"
                value={width}
                onChange={(e) => {
                  setWidth(e.target.value);
                }}
              />
            </div>
            <div className="fieldGroup">
              <label htmlFor="quality">Quality: </label>
              <div className="inputRangeHolder">
                <input
                  type="range"
                  name="quality"
                  id="quality"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={quality}
                  onChange={(e) => {
                    setQuality(parseFloat(e.target.value));
                    setQualityValue(Math.round(e.target.value * 100));
                  }}
                />
                <span>{qualityValue}%</span>
              </div>
            </div>
            <div className="fieldGroup">
              <label htmlFor="imageFormat">Format: </label>
              <select
                name="imageFormat"
                id="imageFormat"
                value={format}
                onChange={(e) => {
                  setFormat(e.target.value);
                }}
              >
                <option value="image/jpeg">JPEG</option>
                <option value="image/png">PNG</option>
                <option value="image/webp">WEBP</option>
              </select>
            </div>
          </div>
          <a
            href={resizedImage}
            download={`Image.${format.split("/")[1]}`}
            className="uploadButton"
          >
            Download ({imageSize})
          </a>
        </div>
      )}
    </div>
  );
};

export default InputImage;
