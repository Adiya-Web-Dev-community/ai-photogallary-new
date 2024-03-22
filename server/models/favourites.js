const mongoose = require("mongoose");

const favourites_schema = new mongoose.Schema({
  email: { type: String },
  images: [{ type: String }],
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "event" },
});

favourite_model = mongoose.model("favourite-collection", favourites_schema);
module.exports = favourite_model;
