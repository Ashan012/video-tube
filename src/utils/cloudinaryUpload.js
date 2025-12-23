import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export const cloudinaryUpload = async (file, type, folder) => {
  if (!file) throw new Error("No file provided");

  const buffer = Buffer.from(await file.arrayBuffer());

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder: folder || "userImage", resource_type: type || "image" },
        (error, result) => {
          if (error) return reject(error);
          if (!result?.secure_url)
            return reject(new Error("Cloudinary upload failed"));

          resolve(result);
        }
      )
      .end(buffer);
  });
};

export const cloudinaryDeleteResource = async (publicId, type) => {
  try {
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: type,
    });
    console.log(response);
    if (response) {
      return response;
    }
  } catch (error) {
    console.error("cloudinary delete error", error);
    throw error;
  }
};
export function extractPublicId(secureUrl) {
  if (!secureUrl) return null;

  const uploadIndex = secureUrl.indexOf("/upload/");
  if (uploadIndex === -1) return null;

  const path = secureUrl.substring(uploadIndex + 8); // after /upload/
  const pathWithoutVersion = path.replace(/^v\d+\//, "");
  const publicId = pathWithoutVersion.replace(/\.[^/.]+$/, "");

  return publicId;
}
