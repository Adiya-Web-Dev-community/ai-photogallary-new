import { useEffect, useState } from "react";
import axios from "../../helpers/axios";
import { useParams } from "react-router-dom";
import { FaFolder } from "react-icons/fa6";
import { MdArrowBackIos } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";

const FavouritsDashboard = () => {
  const [data, setData] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const { eventId } = useParams();
  console.log(selectedFolder);
  const fetchData = async () => {
    const token = localStorage.getItem("token");
    try {
      const resp = await axios.get(`/fetch-favourite-album/${eventId}`, {
        headers: {
          authorization: token,
        },
      });
      setData(resp.data.data);
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [eventId, selectedFolder]);

  const handleFolderClick = (folder) => {
    setSelectedFolder(folder);
    setSelectedImages([]);
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setModalVisible(true);
  };

  const handleCheckboxChange = (imageUrl) => {
    setSelectedImages((prevSelectedImages) =>
      prevSelectedImages.includes(imageUrl)
        ? prevSelectedImages.filter((img) => img !== imageUrl)
        : [...prevSelectedImages, imageUrl]
    );
  };

  const handleDeleteImages = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `/event/${eventId}/user-favourite-images`,
        {
          headers: {
            authorization: token,
          },
          data: {
            eventId: eventId,
            collectionId: selectedFolder._id,
            imageUrls: selectedImages,
          },
        }
      );
      console.log("SELECTED FOLDER", response.data.data);
      setSelectedFolder(response.data.data);
    } catch (error) {
      console.error("Error deleting images:", error);
      // Handle error cases
    }
  };

  // Filter out folders with no images
  const filteredData = data.filter(
    (folder) => folder.images && folder.images.length > 0
  );

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <div className="bg-stone-200 rounded-xl p-4 min-h-[60vh]">
      {selectedFolder ? (
        <>
          <div className="flex justify-between">
            <p
              onClick={() => setSelectedFolder(null)}
              className="px-2 py-1 flex w-fit cursor-pointer hover:text-blue-700 mb-2 font-semibold"
            >
              <MdArrowBackIos className="mt-1" />
              Go Back
            </p>
            <p
              onClick={handleDeleteImages}
              className="px-2 py-1 flex w-fit cursor-pointer hover:text-red-500 mb-2 font-semibold"
            >
              <RiDeleteBin6Line className="mt-1 " />
              <span className="ml-2">Delete Selected</span>
            </p>
          </div>
          <div className="image-container grid grid-cols-3 gap-2">
            {selectedFolder.images.map((image, index) => (
              <div
                key={index}
                className="relative w-auto h-56 group p-2 bg-white rounded-xl"
              >
                <label
                  htmlFor={`imageCheckbox-${index}`}
                  className="absolute top-3 left-4 z-10"
                >
                  <input
                    type="checkbox"
                    id={`imageCheckbox-${index}`}
                    className="w-4 h-4 rounded-lg cursor-pointer"
                    checked={selectedImages.includes(image)}
                    onChange={() => handleCheckboxChange(image)}
                  />
                </label>
                <img
                  key={index}
                  src={image}
                  alt={`Image ${index}`}
                  onClick={() => handleImageClick(image)}
                  className="folder-image"
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-zinc-200 p-3 rounded-lg">
          {filteredData.map((folder, index) => (
            <div
              className="p-3 bg-white rounded-lg"
              key={index}
              onClick={() => handleFolderClick(folder)}
              style={{
                marginTop: "5px",
                display: "flex",
                alignItems: "center",
                padding: "0px 10px",
                cursor: "pointer",
              }}
            >
              <FaFolder style={{ marginRight: "15px" }} />
              <span style={{ fontWeight: "500", fontSize: "15px" }}>
                {folder.email}
              </span>
            </div>
          ))}
        </div>
      )}
      {/* Modal for displaying the clicked image */}
      {modalVisible && (
        <div
          className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-white bg-opacity-75 z-[101]"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            <span
              className="block absolute top-2 right-2 text-gray-500 cursor-pointer"
              onClick={closeModal}
            >
              &times;
            </span>
            <div className="modal-content">
              <img
                src={selectedImageUrl}
                alt="Selected Image"
                className="max-w-5xl h-auto"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavouritsDashboard;
