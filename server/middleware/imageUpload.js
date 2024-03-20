const multer = require("multer");
const path = require("path");
const Event = require("../models/event");
const sharp = require("sharp");

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const eventId = req.params.id;
    const category = req.params.category;

    if (!eventId || !category) {
      return cb(
        new Error("Event ID and category must be provided in the request body")
      );
    }

    const uploadPath = path.join(
      __dirname,
      "..",
      "..",
      "database",
      "events",
      eventId.toString(),
      category
    );

    // Save the image path to the event document
    try {
      const eventDocument = await Event.findById(eventId);
      if (!eventDocument) {
        return cb(new Error("Event not found"));
      }
      eventDocument.imagePaths.push({ category, path: uploadPath });
      await eventDocument.save();
    } catch (error) {
      return cb(error);
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname); // Appending unique prefix to the filename
  },
});

const uploadImg = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
  limits: { fileSize: 1024 * 1024 * 10 }, // Limit set to 10 MB
}).array("images", 50);

const compressImages = async (req, res, next) => {
  try {
    if (req.files) {
      // Use req.files instead of req.file
      const compressedFiles = [];
      for (const f of req.files) {
        // Iterate through req.files
        if (f.size > 1024 * 1024 * 1.5) {
          // Check if the file size exceeds 1.5MB
          // Compress the image
          const compressedImage = await sharp(f.buffer)
            .jpeg({ quality: 90, progressive: true })
            .toBuffer();
          const compressedSize = compressedImage.length;
          if (compressedSize <= 1024 * 1024 * 1.5) {
            // Ensure the compressed image is within 1.5MB
            // Replace the original file with the compressed one
            f.buffer = compressedImage;
            f.size = compressedSize;
            compressedFiles.push(f);
          }
        }
      }
      // Replace original files with compressed ones
      req.files = [
        ...req.files.filter((f) => !compressedFiles.includes(f)),
        ...compressedFiles,
      ];
    }
    next();
  } catch (error) {
    console.error("Error during compression and replacement:", error);
    throw error;
  }
};

module.exports = { uploadImg, compressImages };
