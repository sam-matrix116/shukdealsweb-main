import imageCompression from "browser-image-compression";
async function imageCompressor(file) {
  const imageFile = file;

  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };
  try {
    const compressedFile = await imageCompression(imageFile, options);

    return compressedFile; // write your own logic
  } catch (error) {
    console.log(error);
  }
}

export { imageCompressor };
