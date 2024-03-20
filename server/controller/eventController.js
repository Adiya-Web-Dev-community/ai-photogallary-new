const DashBoard = require("../models/dashboard");
const Event = require("../models/event");
const User = require("../models/user");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const generateOTP = require("../helpers/otpHelper.js").generateOTP;
const {
  eventConfirmation,
  sendEventMails,
  sendEventInfo,
} = require("../helpers/emailHelper.js");
const QRCode = require("qrcode");
const Jimp = require("jimp");
const axios = require("axios");
const Collection = require("../models/collection.js");

// Get all events
const getEvents = async (req, res) => {
  try {
    const user = await User.findById(req.accountId);

    const status = req.query.status;
    const query = {
      dashboardId: user.dashboardId,
    };

    if (status !== "") {
      query.status = status;
    }

    const events = await Event.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Events fetched successfully",
      success: true,
      data: events,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// Get a single event
const getEvent = async (req, res) => {
  try {
    const user = await User.findById(req.accountId);
    const event = await Event.findById(req.params.id);
    return res.status(200).json({
      message: "Event fetched successfully",
      success: true,
      data: event,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
      msg: error.message,
    });
  }
};

// To add an event
// const addEvent = async (req, res) => {
//     try {
//         const userid = req.accountId;
//         const user = await User.findById(userid).populate({
//             path: "dashboardId",
//         });

//         const event = await Event.create({
//             ...req.body,
//             dashboardId: user.dashboardId,
//         });

//         let faceSearchLink = `http://localhost:5173/face-search/event/${event._id}`;
//         let link = `http://localhost:5173/full-event-access/${event._id}`;
//         event.link = link;
//         event.faceSearchLink = faceSearchLink;
//         const qrCode = await QRCode.toDataURL(link);
//         const faceQrCode = await QRCode.toDataURL(faceSearchLink);
//         event.faceQrCode = faceQrCode;
//         event.qrCode = qrCode;

//         event.fullAccessPin = generateOTP();
//         event.faceSearchPin = generateOTP();

//         // Creating folder for database
//         const databaseDir = path.join(__dirname, "..", "..", "database");
//         const eventDir = path.join(databaseDir, "events", event._id.toString());
//         fs.mkdirSync(eventDir);

//         await event.save();
//         eventConfirmation(
//             event.eventHost.email,
//             event.eventHost.name,
//             event.name,
//             event.qrCode,
//             event.link,
//             event.faceSearchLink,
//             event.faceQrCode
//         );

//         return res.status(200).json({
//             message: "Event added successfully",
//             success: true,
//             event,
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             message: "Failed to add event",
//             success: false,
//         });
//     }
// };

const addEvent = async (req, res) => {
  console.log(req.body);
  try {
    const userid = req.accountId;
    const user = await User.findById(userid).populate({
      path: "dashboardId",
    });

    const event = await Event.create({
      ...req.body,
      dashboardId: user.dashboardId,
    });
    let faceSearchLink = `http://localhost:5173/face-search/event/${event._id}`;
    let link = `http://localhost:5173/full-event-access/${event._id}`;
    event.link = link;
    event.faceSearchLink = faceSearchLink;
    const qrCode = await QRCode.toDataURL(link);
    const faceQrCode = await QRCode.toDataURL(faceSearchLink);
    event.faceQrCode = faceQrCode;
    event.qrCode = qrCode;

    event.fullAccessPin = generateOTP();
    event.faceSearchPin = generateOTP();

    await event.save();
    eventConfirmation(
      event.eventHost.email,
      event.eventHost.name,
      event.name,
      event.qrCode,
      event.link,
      event.faceSearchLink,
      event.faceQrCode
    );

    return res.status(200).json({
      message: "Event added successfully",
      success: true,
      event,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to add event",
      success: false,
    });
  }
};

// To update an event
const updateEvent = async (req, res) => {
  try {
    const userid = req.accountId;
    const user = await User.findById(userid);

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
      },
      {
        new: true,
      }
    );
    return res.status(200).json({
      message: "Event updated successfully",
      success: true,
      data: event,
    });
  } catch (error) {
    return res.status(500).json({
      console: error.message,
      message: "Failed to update event",
      success: false,
    });
  }
};

const shareWithClient = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.send({ success: false, msg: "Cannot find eventId" });
  }

  const { fullEventAccess, faceSearchAccess, shareViaEmail, emailsArray } =
    req.body;
  try {
    const isEvent = await Event.findOne({ _id: id });
    if (!isEvent) {
      return res.send({
        success: false,
        msg: "Cannot find event with this id",
      });
    } else {
      (isEvent.fullEventAccess = fullEventAccess),
        (isEvent.faceSearchAccess = faceSearchAccess);
      if (shareViaEmail) {
        if (!Array.isArray(emailsArray)) {
          return res.send({ success: false, msg: "images array is invalid" });
        }
        isEvent.emailsArray = emailsArray;
        await isEvent.save();
        if (isEvent.emailsArray.length) {
          isEvent.emailsArray.forEach((email) => {
            sendEventInfo(email, isEvent);
          });
        }
      }
      return res.send({
        success: true,
        msg: "Your setting has been saved successfully",
        isEvent,
      });
    }
  } catch (err) {
    return res.send({ success: false, msg: err.message });
  }
};

// To delete an event
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      message: "Event deleted successfully",
      success: true,
      data: event,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete event",
      success: false,
    });
  }
};

const addYoutubeLinks = async (req, res) => {
  try {
    const eventId = req.params.id;
    const { videoLinks } = req.body;

    if (
      !Array.isArray(videoLinks) ||
      videoLinks.some((video) => !video.title || !video.link)
    ) {
      return res.status(400).json({ message: "Invalid videoLinks data" });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    event.videoLinks = [...event.videoLinks, ...videoLinks];

    await event.save();
    return res
      .status(200)
      .json({ message: "YouTube links added successfully", data: event });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteYoutubeLinks = async (req, res) => {
  try {
    const eventId = req.params.id;
    const linkId = req.params.linkId;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.videoLinks = event.videoLinks.filter(
      (video) => video._id.toString() !== linkId
    );

    await event.save();

    return res.status(200).json({
      message: "YouTube link deleted successfully",
      data: event,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getYoutubeLinks = async (req, res) => {
  try {
    const eventId = req.params.id;
    console.log(eventId);
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.status(200).json({ data: event.videoLinks });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateYoutubeLinks = async (req, res) => {
  try {
    const eventId = req.params.id;
    const linkId = req.params.linkId;
    const updatedFields = req.body;
    console.log("Received updatedFields:", updatedFields);

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const linkIndex = event.videoLinks.findIndex(
      (link) => link._id.toString() === linkId
    );

    if (linkIndex === -1) {
      return res.status(404).json({ message: "YouTube link not found" });
    }

    const updatedLink = {
      ...event.videoLinks[linkIndex],
      ...updatedFields,
    };
    event.videoLinks[linkIndex] = updatedLink;

    await event.save();

    return res.status(200).json({
      message: "YouTube link updated successfully",
      data: event,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const addImages = async (req, res) => {
  const { eventId, collectionId, imagesArray } = req.body;

  try {
    if (collectionId) {
      const isCollection = await Collection.findOne({
        $and: [{ eventId: eventId }, { _id: collectionId }],
      });
      if (isCollection) {
        if (!imagesArray) {
          return res.send({ success: false, msg: "Cannot find image array" });
        }
        if (
          !Array.isArray(imagesArray) ||
          imagesArray.some((image) => typeof image !== "string")
        ) {
          return res.status(400).json({ message: "Invalid imagesArray data" });
        } else {
          isCollection.imageArr = [...isCollection.imageArr, ...imagesArray];
          await isCollection.save();
          return res.send({
            success: true,
            msg: "Images uploaded",
            isCollection,
          });
        }
      } else {
        const collection = await Collection.create({
          ...req.body,
          eventId: eventId,
        });
        res.send({
          success: true,
          msg: "New collection created",
          collection: collection,
        });
      }
    } else {
      if (!eventId) {
        return res.send({ success: false, message: "Cannot find event Id" });
      }
      const collection = await Collection.create({
        ...req.body,
        eventId: eventId,
      });
      res.send({
        success: true,
        msg: "New collection created",
        collection: collection,
      });
    }
  } catch (err) {
    return res.send({ success: false, message: err.message });
  }
  // const collection = await Collection.findOne({
  //   $and: [{ eventId: eventId }, { _id: collectionId }],
  // });
  // console.log(collection);
  // try {
  //   const { imagesArray } = req.body;

  //   if (
  //     !Array.isArray(imagesArray) ||
  //     imagesArray.some((image) => typeof image !== "string")
  //   ) {
  //     return res.status(400).json({ message: "Invalid imagesArray data" });
  //   }

  //   const event = await Event.findById(eventId);

  //   if (!event) {
  //     return res.status(404).json({ message: "Event not found" });
  //   }

  //   event.imagesArray = event.imagesArray.concat(imagesArray);

  //   await event.save();

  //   return res
  //     .status(200)
  //     .json({ message: "Images added successfully", data: event });
  // } catch (error) {
  //   return res.status(500).json({ message: "Internal Server Error" });
  // }
};

const getCollectionsOfEvent = async (req, res) => {
  const { eventId } = req.params;
  if (!eventId) {
    return res.send({ success: false, msg: "cannot find eventId" });
  }
  try {
    const allCollections = await Collection.find({ eventId: eventId });
    return res.send({
      success: true,
      arr: allCollections,
      length: allCollections.length,
    });
  } catch (err) {
    return res.send({ success: false, msg: err.message });
  }
};

const deleteImages = async (req, res) => {
  try {
    const eventId = req.params.id;
    const { imageUrls } = req.body;

    if (
      !Array.isArray(imageUrls) ||
      imageUrls.some((url) => typeof url !== "string")
    ) {
      return res.status(400).json({ message: "Invalid imageUrls data" });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.imagesArray = event.imagesArray.filter(
      (image) => !imageUrls.includes(image)
    );

    await event.save();

    return res
      .status(200)
      .json({ message: "Images deleted successfully", data: event });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getImagesArray = async (req, res) => {
  console.log("query", req.query);
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;

    const startIndex = (page - 1) * pageSize;

    const paginatedImages = event.imagesArray.slice(
      startIndex,
      startIndex + pageSize
    );

    return res.status(200).json({
      imagesArray: paginatedImages,
      currentPage: page,
      totalPages: Math.ceil(event.imagesArray.length / pageSize),
      imagesPerPage: pageSize,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const addWatermarkInImages = async (req, res) => {
  try {
    const { imagesArray, watermarkUrl } = req.body;
    const eventId = req.params.id;

    if (!Array.isArray(imagesArray) || typeof watermarkUrl !== "string") {
      return res.status(400).json({ error: "Invalid input data" });
    }

    const watermarkedImagesArray = [];

    for (const imageUrl of imagesArray) {
      const watermarkedImage = await addWatermarkToImage(
        imageUrl,
        watermarkUrl
      );
      watermarkedImagesArray.push(watermarkedImage);
    }

    // Update the event's imagesArray in the database
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Update the imagesArray with the watermarked images
    event.imagesArray = watermarkedImagesArray;

    // Save the updated event
    await event.save();

    return res
      .status(200)
      .json({ message: "Watermark added successfully", data: event });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

async function addWatermarkToImage(imageUrl, watermarkUrl) {
  try {
    const originalImage = await Jimp.read(imageUrl);
    const watermark = await Jimp.read(watermarkUrl);

    // Resize the watermark to fit a percentage of the original image
    watermark.resize(originalImage.getWidth() * 0.2, Jimp.AUTO);

    // Calculate the position to place the watermark (e.g., bottom right corner)
    const x = originalImage.getWidth() - watermark.getWidth() - 10;
    const y = originalImage.getHeight() - watermark.getHeight() - 10;

    // Compose the images by overlaying the watermark
    originalImage.composite(watermark, x, y, {
      mode: Jimp.BLEND_SOURCE_OVER,
      opacitySource: 0.5, // Adjust the watermark opacity as needed
    });

    // Convert the image to base64
    const base64data = await originalImage.getBase64Async(Jimp.AUTO);
    const img = await imgResize(base64data);
    return img.toString();
  } catch (error) {
    throw new Error(`Error adding watermark: ${error.message}`);
  }
}

const sendEmails = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);

    const emailsArray = event.emailsArray;
    emailsArray.forEach((email) => {
      sendEventMails(email, event.description, event.pin, event.pin);
    });
    return res.status(200).json({
      message:
        "Emails sent successfully. Check your spam folder if you don't see it in your inbox. Thank you!",
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const pinValidate = async (req, res) => {
  console.log(req.body);
  try {
    console.log(req.params.id);
    const eventId = req.params.id;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    if (event.fullEventAccess === false) {
      return res.status(400).json({ error: "Event is not published" });
    }
    if (event.pin === req.body.pin) {
      return res.status(200).json({
        success: true,
        message: "Pin validated successfully",
        data: {
          eventName: event.eventName,
          eventId: eventId,
        },
      });
    } else {
      return res.status(400).json({ error: "Invalid pin" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getClientImagesArray = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 9;

    const startIndex = (page - 1) * pageSize;

    const paginatedImages = event.imagesArray.slice(
      startIndex,
      startIndex + pageSize
    );

    return res.status(200).json({
      imagesArray: paginatedImages,
      currentPage: page,
      totalPages: Math.ceil(event.imagesArray.length / pageSize),
      imagesPerPage: pageSize,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getClientYoutubeLinks = async (req, res) => {
  try {
    const eventId = req.params.id;
    console.log(eventId);
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.status(200).json({ data: event.videoLinks });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all folder name
function getFolderNamesInDirectory(directoryPath) {
  try {
    const filesAndFolders = fs.readdirSync(directoryPath);

    const folderNames = filesAndFolders.filter((item) => {
      const itemPath = path.join(directoryPath, item);
      return fs.statSync(itemPath).isDirectory();
    });

    return folderNames;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Create new image category folder in dir
const createNewImageCategory = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);
    const eventDirectory = path.join(
      __dirname,
      "..",
      "..",
      "database",
      "events",
      `${event._id}`
    );

    if (!fs.existsSync(eventDirectory)) {
      return res.status(404).json({ error: "Event directory not found" });
    }

    const existingFolders = getFolderNamesInDirectory(eventDirectory);

    const category = req.body.category;
    if (existingFolders.includes(category)) {
      return res.status(400).json({ error: "Category already exists" });
    }

    const categoryDirectory = path.join(eventDirectory, category);
    fs.mkdirSync(categoryDirectory);

    return res.status(200).json({ message: "Category created successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all images catgeory folders
// const getImagesCategories = async (req, res) => {
//   try {
//     const eventId = req.params.id;
//     const event = await Event.findById(eventId);
//     const eventDirectory = path.join(
//       __dirname,
//       "..",
//       "..",
//       "database",
//       "events",
//       `${event._id}`
//     );

//     if (!fs.existsSync(eventDirectory)) {
//       return res.status(404).json({ error: "Event directory not found" });
//     }
//     const existingFolders = getFolderNamesInDirectory(eventDirectory);
//     return res.status(200).json({ message: "Category created successfully" });
//   } catch (error) {
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// Delete Image Category
const deleteImageCategory = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Directory path for the event
    const eventDirectory = path.join(
      __dirname,
      "..",
      "..",
      "database",
      "events",
      `${event._id}`
    );

    if (!fs.existsSync(eventDirectory)) {
      return res.status(404).json({ error: "Event directory not found" });
    }

    const category = req.body.category;

    const categoryDirectory = path.join(eventDirectory, category);

    if (!fs.existsSync(categoryDirectory)) {
      return res.status(404).json({ error: "Category directory not found" });
    }

    deleteFolder(categoryDirectory);

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const deleteFolder = (folderPath) => {
  try {
    if (fs.existsSync(folderPath)) {
      fs.rmdirSync(folderPath, { recursive: true });
      console.log(`Folder deleted: ${folderPath}`);
    } else {
      console.log(`Folder does not exist: ${folderPath}`);
    }
  } catch (error) {
    console.error(`Error deleting folder: ${error}`);
  }
};

const uploadImage = async (req, res) => {
  try {
    const eventId = req.params.id;
    console.log(`Uploading images for event: ${eventId}`);
    res.status(200).json({ message: "Images uploaded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllImages = async (req, res) => {
  try {
    const eventId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const pageSize = 20;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const offset = (page - 1) * pageSize;

    let imagesForPage = [];

    for (
      let i = offset;
      i < offset + pageSize && i < event.imagePaths.length;
      i++
    ) {
      const imagePathObj = event.imagePaths[i];
      const category = imagePathObj.category;
      const imagePath = imagePathObj.path;

      if (fs.existsSync(imagePath)) {
        imagesForPage.push({ category, path: imagePath });
      }
    }

    const totalImages = event.imagePaths.length;
    const totalPages = Math.ceil(totalImages / pageSize);

    const paginationInfo = {
      currentPage: page,
      totalPages: totalPages,
      totalImages: totalImages,
    };

    res.status(200).json({ images: imagesForPage, pagination: paginationInfo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteImagesOfEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const { imagePaths } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    for (const imagePath of imagePaths) {
      event.imagePaths = event.imagePaths.filter(
        (img) => img.path !== imagePath
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await event.save();

    res.status(200).json({ message: "Images deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
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
  sendEmails,
  getClientImagesArray,
  pinValidate,
  getClientYoutubeLinks,
  createNewImageCategory,
  deleteImageCategory,
  uploadImage,
  getAllImages,
  deleteImagesOfEvent,
  getCollectionsOfEvent,
  shareWithClient,
};
