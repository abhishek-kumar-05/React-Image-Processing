import sharp from "sharp";
import fs from "fs";

async function resizeImage(
  inputPath,
  outputPath,
  height,
  width,
  quality,
  format
) {
  try {
    if (!fs.existsSync(inputPath)) {
      console.log("Input path does not exist");
      return;
    }

    let transformer = sharp(inputPath).resize({ width: width, height: height });
    transformer = transformer[format]({ quality: quality });
    transformer.toFile(`${outputPath}.${format}`, (err, info) => {
      if (err) {
        console.log("Error occured while resizing image", err);
      } else {
        console.log("Image resized successfully", info);
      }
    });
  } catch (error) {
    console.log("Error occured while resizing image", error);
  }
}

const imagePath = "/Users/abhishek/Desktop/img.jpg";
const outputPath = "/Users/abhishek/Desktop/output2";
const width = 3986;
const height = 5979;
const format = "png";
const quality = 1;

resizeImage(imagePath, outputPath, height, width, quality, format);
