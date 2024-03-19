const mongoose = requires("mongoose");

const collection_schema = new mongoose.Schema({
  name: { type: String },
  imageArr: [{ type: String }],
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "event" },
});

const collection_model = mongoose.model("collection", collection_schema);