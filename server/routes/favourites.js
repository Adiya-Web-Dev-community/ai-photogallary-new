const router = require("express").Router();
const middleware = require("../middleware/account");
const {
  create_account,
  add_images,
  fetchFavouriteImages,
  fetchFavouriteAlbumForPhotograpger,
} = require("../controller/favourites");

router.post("/signup-login", create_account);
router.put("/add-favourite-images", middleware, add_images);
router.get("/fetch-images", middleware, fetchFavouriteImages);
router.get(
  "/fetch-favourite-album/:eventId",
  fetchFavouriteAlbumForPhotograpger
);
module.exports = router;
