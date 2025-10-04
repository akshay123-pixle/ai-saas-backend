import cloudinary from "../utils/cloudinary.js";

// Upload image buffer to Cloudinary
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      (error, result) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        }

        return res.status(200).json({ url: result.secure_url });
      }
    );

    stream.end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
