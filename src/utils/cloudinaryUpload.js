import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export const cloudinaryUpload = async (file) => {
  if (!file) throw new Error("No file provided");

  const buffer = Buffer.from(await file.arrayBuffer());

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder: "userImage", resource_type: "auto" },
        (error, result) => {
          if (error) return reject(error);
          if (!result?.secure_url)
            return reject(new Error("Cloudinary upload failed"));

          resolve(result.secure_url);
        }
      )
      .end(buffer);
  });
};
