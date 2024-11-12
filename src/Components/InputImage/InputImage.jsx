import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

import "./InputImage.css";

const InputImage = () => {
  const [imageSrc, setImageSrc] = useState(null);

  const onDrop = useCallback((imageAccepted) => {
    const file = imageAccepted[0];

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleCancel = () => {
    setImageSrc(null);
  };

  return (
    <div {...getRootProps()} className="Container">
      {!imageSrc && (
        <>
          <input {...getInputProps()} />
          <p>
            {isDragActive
              ? "Drop the image..."
              : "Drag and drop image or browse to upload"}
          </p>
          <button type="" className="uploadButton">
            Upload
          </button>
        </>
      )}

      {imageSrc && (
        <div className="inputImageHolder">
          <div className="previewHeader">
            <div className="cancelButtonContainer">
              <i
                onClick={handleCancel}
                className="fa-solid fa-xmark cancelButton "
              ></i>
            </div>
            <p>Preview : </p>
          </div>
          <img
            src={imageSrc}
            alt="Input Image Preview"
            className="uploadedImage"
          />
        </div>
      )}
    </div>
  );
};

export default InputImage;
