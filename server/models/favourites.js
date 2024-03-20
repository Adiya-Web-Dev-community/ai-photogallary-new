const mongoose = require("mongoose");

const favourites_schema = new mongoose.Schema({
  email: { type: String },
  images: [{ type: String }],
});

favourite_model = mongoose.model("favourite-collection", favourites_schema);
module.exports = favourite_model;
