import { useEffect, useState } from "react";
import axios from "../../helpers/axios";

const Favourites = () => {
  const [token, setToken] = useState(localStorage.getItem("fav-token"));
  const [imagesArray, setImagesArray] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get("/fetch-images", {
          headers: {
            authorization: `${token}`,
          },
        });

        if (response.data.success) {
          setImagesArray(response.data.data.images);
        } else {
          console.error("Error fetching images:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    if (token) {
      fetchImages();
    }
  }, [token]);

  const openModal = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage("");
  };

  return (
    <div className="mx-20 h-auto mt-4">
      <h1 className="text-2xl font-bold mb-4">My Favourites</h1>
      <div className="grid grid-cols-4 gap-2">
        {imagesArray &&
          imagesArray.map((image, i) => (
            <div key={`${i + 1}`} className="relative group">
              <img
                key={`${i + 1}`}
                src={image}
                alt={image.description}
                className="w-auto h-56 rounded-lg cursor-pointer"
                onClick={() => openModal(image)}
              />
            </div>
          ))}
      </div>
      {modalVisible && (
        <div
          className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-75"
          onClick={closeModal}
        >
          <div className="max-w-screen-lg bg-white rounded-lg overflow-hidden">
            <button
              className="absolute top-2 right-2 text-white  rounded-full w-8 h-8 flex items-center justify-center focus:outline-none"
              onClick={closeModal}
            >
              X
            </button>
            <img
              src={selectedImage}
              alt="Selected Image"
              className="max-w-6xl z-10"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Favourites;
