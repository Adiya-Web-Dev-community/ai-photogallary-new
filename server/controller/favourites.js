const Favourites = require("../models/favourites");
const jwt = require("jsonwebtoken");

//create account using email or login
const create_account = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.send({ success: false, msg: "Email not required" });
  }
  try {
    const isAccount = await Favourites.findOne({ email: email });
    if (!isAccount) {
      const newAccount = await Favourites.create(req.body);
      const token = jwt.sign({ _id: newAccount._id }, process.env.SECRET_KEY, {
        expiresIn: "1d",
      });
      return res.send({
        success: true,
        msg: "New Account created",
        account: newAccount,
        token: token,
      });
    }
    const token = jwt.sign({ _id: isAccount._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    return res.send({
      success: true,
      msg: "Existing account",
      account: isAccount,
      token: token,
    });
  } catch (err) {
    return res.send({ success: false, msg: err.message });
  }
};

//add new images
const add_images = async (req, res) => {
  const { imageLink } = req.body;
  if (!imageLink) {
    return res.send({ success: false, msg: "Cannot find image link" });
  }
  try {
    const isAccount = await Favourites.findOne({ _id: req.accountId });
    if (!isAccount) {
      return res.send({
        success: false,
        msg: "Cannot find account with give id",
      });
    }
    isAccount.images.push(imageLink);
    await isAccount.save();
    return res.send({
      success: true,
      msg: "Image added to favourite",
      account: isAccount,
    });
  } catch (err) {
    return res.send({ success: false, msg: `err:${err.message}` });
  }
};

//fetch images
const fetchFavouriteImages = async (req, res) => {
  try {
    const account = await Favourites.findOne({ _id: req.accountId });
    return res.send({ success: true, data: account });
  } catch (err) {
    return res.send({ success: false, msg: `err: ${err.message}` });
  }
};

module.exports = { create_account, add_images, fetchFavouriteImages };
