const mongoose = requires("mongoose");

const collection_schema = new mongoose.Schema({});

const collection_model = mongoose.model("collection", collection_schema);
