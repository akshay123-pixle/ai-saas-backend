import multer from "multer";

// Use memory storage (no saving to disk)
const storage = multer.memoryStorage();

export const upload = multer({ storage });
