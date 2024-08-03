import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";
// Main function to handle the download and upload process
export const uploadImageToGetUrl = async (
  imageUrl: string,
): Promise<string | undefined> => {
  const filename = path.basename(imageUrl);
  const localFilePath = path.join(__dirname, filename);

  try {
    await downloadImage(imageUrl, localFilePath);

    console.log("Uploading image to the server...");
    const uploadResponse = await uploadImage(localFilePath);
    console.log("Image uploaded:", uploadResponse);

    const imageUrlOnServer = `${process.env.BACKEND_SERVICE_URL}/images/${uploadResponse}`;
    console.log("Uploaded image URL:", imageUrlOnServer);

    return imageUrlOnServer;
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Clean up the local file after upload
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
  }
};

// Function to download the image and save it locally
const downloadImage = async (url: string, filepath: string): Promise<void> => {
  const response = await axios.get(url, { responseType: "stream" });
  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
};

// Function to upload the image to the server
const uploadImage = async (filepath: string): Promise<string> => {
  const form = new FormData();
  form.append("image", fs.createReadStream(filepath));

  const response = await axios.post(
    process.env.BACKEND_SERVICE_URL + "/upload",
    form,
    {
      headers: {
        ...form.getHeaders(),
      },
      timeout: 5000,
    },
  );

  return response.data;
};
//
// // Replace with your image URL
// // const imageUrl = "https://www.memeclub.ai/images/bg/door.png";
// const imageUrl =
//   "https://pbs.twimg.com/profile_images/1807946252543578112/YG4PCpcl_400x400.jpg";
//
// handleImageUpload(imageUrl);
