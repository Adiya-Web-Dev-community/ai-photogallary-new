const express = require("express");
const router = express.Router();

const middleware = require("../middleware/account");

const {
  getEvents,
  getEvent,
  addEvent,
  updateEvent,
  deleteEvent,
  addYoutubeLinks,
  getYoutubeLinks,
  updateYoutubeLinks,
  deleteYoutubeLinks,
  addImages,
  deleteImages,
  getImagesArray,
  addWatermarkInImages,
  getClientImagesArray,
  pinValidate,
  getClientYoutubeLinks,

  createNewImageCategory,
  deleteImageCategory,
  uploadImage,
  getAllImages,
  getCollectionsOfEvent,
  shareWithClient,
} = require("../controller/eventController");

const { uploadImg, compressImages } = require("../middleware/imageUpload");

// Get all events
router.get("/events", middleware, getEvents);

// Get a single event
router.get("/event/:id", getEvent);

// Create an event
router.post("/event", middleware, addEvent);

// Create a sub event

// Update a event
router.put("/event/:id", middleware, updateEvent);

router.put("/share-with-client/:id", shareWithClient);

// Get a subevent

// Delete a subevent

// // Fetech all sub events
// router.get("/subevents/:id", middleware, getAllSubEvents)

// Delete a event
router.delete("/event/:id", middleware, deleteEvent);

// Update youtube links
router.put("/event/:id/youtube-links/:linkId", middleware, updateYoutubeLinks);

// Add youtube links
router.post("/event/:id/youtube-links", middleware, addYoutubeLinks);

// Get youtube links
router.get("/event/:id/youtube-links", middleware, getYoutubeLinks);

// Delete youtube links
router.delete(
  "/event/:id/youtube-links/:linkId",
  middleware,
  deleteYoutubeLinks
);

router.get("/event/:id/event-images", middleware, getImagesArray);

router.post("/add-images", addImages);

router.get("/get-all-collections/:eventId", getCollectionsOfEvent);

router.put(
  "/event/:id/event-images/add-watermark",
  middleware,
  addWatermarkInImages
);

router.delete("/event/:id/event-images", middleware, deleteImages);

// Client side apis
router.post("/:eventName/event-access/:id", pinValidate);

router.get("/event/images/show-all/:id", getClientImagesArray);

router.get("/event/videos/show-all/:id", getClientYoutubeLinks);

router.post("/event/create-image-category/:id", createNewImageCategory);

router.delete("/event/delete-image-category/:id", deleteImageCategory);

router.post(
  "/event/upload-image/category/:id/:category",
  uploadImg,
  compressImages,
  uploadImage
);

router.get("/event/:id/category", getAllImages);
module.exports = router;
