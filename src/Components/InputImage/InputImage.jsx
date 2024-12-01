import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import pica from "pica";
import "./InputImage.css";

const InputImage = () => {
  const [imageUpload, setImageUpload] = useState(true);
  const [loading, setLoading] = useState(null);
  const [resizedImage, setResizedImage] = useState(null);

  const onDrop = useCallback((imageAccepted) => {
    const file = imageAccepted[0];

    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("wrong image format");
        return;
      }
      setImageUpload(false);
      setLoading(true);

      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const targetWidth = 1200;
          const aspectRatio = img.height / img.width;
          canvas.width = targetWidth;
          canvas.height = targetWidth * aspectRatio;

          const picaInstance = new pica();

          picaInstance
            .resize(img, canvas, {
              quality: 3,
              unsharpAmount: 120,
              unsharpRadius: 0.8,
              unsharpThreshold: 5,
            })
            .then((result) => picaInstance.toBlob(result, file.type))
            .then((blob) => {
              const resizedURL = URL.createObjectURL(blob);
              setResizedImage(resizedURL);
              setLoading(false);
              console.log("successfull");
            })
            .catch((error) => {
              console.error("pica error: ", error);
              setLoading(false);
            });
        };
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: null,
    multiple: false,
  });

  const handleCancel = () => {
    setImageUpload(true);
    setResizedImage(null);
    setLoading(false);
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
          <a
            href={resizedImage}
            download="resizedimage.jpeg"
            className="uploadButton"
          >
            Download
          </a>
        </div>
      )}
    </div>
  );
};

export default InputImage;
