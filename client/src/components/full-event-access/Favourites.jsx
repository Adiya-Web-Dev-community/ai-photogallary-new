import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../helpers/axios";
import { MdArrowBackIos } from "react-icons/md";

const Favourites = ({ setShowFavourites }) => {
  const navigate = useNavigate();
  const { id } = useParams();
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
    <div className="mb-[10rem] h-auto mt-4 w-full">
      <div className="mx-20">
        <p
          className="px-2 flex gap-1 cursor-pointer"
          onClick={() => setShowFavourites(false)}
        >
          <MdArrowBackIos className="mt-1" />
          <span>BACK</span>
        </p>
        <h1 className="text-2xl font-bold mb-4 mt-4">My Favourites</h1>
        <div className="grid grid-cols-4 gap-2 ">
          {imagesArray?.length ? (
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
            ))
          ) : (
            <p className="mt-5 text-center font-bold text-md text-gray-400">
              You have not added any images to favourite
            </p>
          )}
        </div>
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
