// import { useState } from "react";
// import "./ShowImages.css"; // Import CSS file for styling

// const ShowImages = () => {
//   const [imageUrls, setImageUrls] = useState([
// "https://dummyimage.com/1050x550/8a8a8a/fff",
// "https://dummyimage.com/1080x1250/8a8a8a/fff",
// "https://dummyimage.com/250x250/8a8a8a/fff",
// "https://dummyimage.com/250x250/8a8a8a/fff",
//   ]);
//   const [imageUrls, setImageUrls] = useState([]);

//   // State to manage the modal visibility and the selected image URL
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedImageUrl, setSelectedImageUrl] = useState("");

//   // Function to handle image click and open modal
//   const handleImageClick = (imageUrl) => {
//     setSelectedImageUrl(imageUrl);
//     setModalVisible(true);
//   };

//   // Function to close the modal
//   const closeModal = () => {
//     setModalVisible(false);
//     setSelectedImageUrl("");
//   };

//   return (
//     <div>
//       {/* <h2>Images</h2> */}
//       {/* Mapping over imageUrls and rendering images */}
//       {imageUrls.length === 0 ? (
//         <p
//           style={{
//             fontSize: "1.5rem",
//             fontWeight: "800",
//             marginTop: "1.5rem",
//             marginBottom: "2rem",
//             textAlign: "center",
//             color: "#1f282f",
//           }}
//         >
//           No Images Available
//         </p>
//       ) : (
//         <div className="image-container">
//           {imageUrls.map((imageUrl, index) => (
//             <img
//               key={index}
//               src={imageUrl}
//               alt={`Image ${index + 1}`}
//               onClick={() => handleImageClick(imageUrl)}
//               className="image-thumbnail"
//             />
//           ))}
//         </div>
//       )}

//       {/* Modal for displaying the clicked image */}
//       {modalVisible && (
//         <div className="modal" onClick={closeModal}>
//           <span className="close" onClick={closeModal}>
//             &times;
//           </span>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <img src={selectedImageUrl} alt="Selected Image" />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ShowImages;
//============================================
import { useState, useEffect } from "react";
import { FaRegHeart, FaRegShareSquare } from "react-icons/fa";
import { MdOutlineFileDownload } from "react-icons/md";
import copy from "clipboard-copy";
import "./ShowImages.css"; // Import CSS file for styling
import axios from "../../../helpers/axios";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

const ShowImages = ({ event }) => {
  const { id } = useParams();
  const [imageData, setImageData] = useState([]);
  const [eventData, setEventData] = useState(event);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("");

  const getImagesCollections = () => {
    axios.get(`/get-all-collections/${id}`).then((res) => {
      setImageData(res.data.arr);
      setActiveTab(res.data.arr[0]?.name);
      console.log("COLLECTIONS", res.data);
    });
  };

  useEffect(() => {
    getImagesCollections();
  }, []);

  const handleImageClick = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImageUrl("");
  };

  const handleShareClick = (link) => {
    copy(link); // Copy the link
    setCopied(true); // Set copied state to true
    setTimeout(() => {
      setCopied(false); // Reset copied state after 2 seconds
    }, 1000);
  };

  const handleAddToFavorites = (imageLink) => {
    copy(imageLink);
    const token = localStorage.getItem("fav-token");
    if (token) {
      axios
        .put(
          "/add-favourite-images",
          { imageLink },
          { headers: { Authorization: `${token}` } }
        )
        .then((res) => {
          toast.success("Image added to favourite");
          console.log("Image added to favorites:", res.data);
        })
        .catch((error) => {
          // Handle error
          console.error("Error adding image to favorites:", error);
        });
    } else {
      console.error("Token not found!");
    }
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div className="mt-10">
      <div className="flex mx-24">
        {imageData &&
          imageData.map((collection, index) => (
            <div key={index}>
              <div
                key={index}
                className={` pr-16 text-md font-semibold cursor-pointer ${
                  activeTab === collection.name
                    ? "text-blue-700 font-bold"
                    : "text-gray-500"
                } `}
                onClick={() => handleTabClick(collection.name)}
              >
                {collection.name.toUpperCase()}
              </div>
            </div>
          ))}
      </div>
      <div className="image-container py-10 mx-20 h-auto ">
        {imageData &&
          imageData.map((collection) => (
            <div
              key={collection._id}
              className={`grid grid-cols-4 gap-2 z-10 ${
                activeTab !== collection.name ? "hidden" : ""
              }`}
            >
              {activeTab === collection.name &&
                collection.imageArr.map((image, i) => (
                  <div
                    key={i}
                    className="relative w-auto h-56 group"
                    // style={{ margin: "3px", height: "236.7px" }}
                  >
                    <img
                      src={image}
                      alt={`Image ${i + 1}`}
                      onClick={() => handleImageClick(image)}
                      // style={{ height: "236.7px", width: "355px" }}
                    />

                    <div className="hidden  group-hover:flex absolute bottom-0 right-0 z-2 w-full">
                      <button
                        type="button"
                        className="actions-button sm:h-[48px] pb-[10px] pl-[10px] pr-[10px] sm:pt-[5px] sm:pb-[1.25rem] sm:pl-[5px] sm:pr-[1.25rem] w-full"
                      >
                        <div className="relative flex justify-between sm:justify-end items-center">
                          <span
                            className="sm:ml-[20px]"
                            title="Share photo"
                            onClick={() => handleShareClick(image)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 96 110"
                              fill="none"
                            >
                              <path
                                d="M81.0937 79.918L81.0923 79.9111H80.6822C76.5061 79.9111 72.7421 81.6535 70.0474 84.4304L29.4984 58.8416C29.9137 57.4851 30.1451 56.0467 30.1451 54.5537C30.1451 53.057 29.9121 51.6175 29.4959 50.2589L69.5002 24.9925C72.2189 28.1092 76.223 30.0851 80.6827 30.0851C88.8536 30.0851 95.5 23.4499 95.5 15.29C95.5 7.13225 88.8517 0.5 80.6827 0.5C72.5073 0.5 65.8554 7.1339 65.8554 15.29C65.8554 16.505 66.0157 17.6798 66.2951 18.8035L25.9555 44.2803C23.2613 41.5017 19.4942 39.7588 15.3173 39.7588C7.14643 39.7588 0.5 46.394 0.5 54.5531C0.5 62.7084 7.14842 69.3399 15.3173 69.3399C19.4949 69.3399 23.262 67.596 25.9562 64.8191L66.505 90.4078C66.088 91.7682 65.8543 93.2109 65.8543 94.71C65.8543 102.868 72.5063 109.5 80.6816 109.5C88.8524 109.5 95.4989 102.866 95.4989 94.71C95.4998 86.6876 89.0753 80.1362 81.0937 79.918ZM80.6822 7.44025C85.0187 7.44025 88.5453 10.963 88.5453 15.2898C88.5453 19.621 85.0183 23.1444 80.6822 23.1444C76.3404 23.1444 72.8091 19.6196 72.8091 15.2898C72.8091 10.9636 76.3401 7.44025 80.6822 7.44025ZM15.3177 62.3994C10.981 62.3994 7.45461 58.8788 7.45461 54.5531C7.45461 50.2235 10.9816 46.6993 15.3177 46.6993C19.6595 46.6993 23.1908 50.2241 23.1908 54.5531C23.1908 58.8782 19.66 62.3994 15.3177 62.3994ZM80.6822 102.559C76.3402 102.559 72.8091 99.0358 72.8091 94.7096C72.8091 90.3778 76.3406 86.8516 80.6822 86.8516C85.0183 86.8516 88.5453 90.3772 88.5453 94.7096C88.5453 99.0363 85.0185 102.559 80.6822 102.559Z"
                                fill="#eee"
                                stroke="#eee"
                              ></path>
                            </svg>
                            {/* Show copied link message */}
                            {copied && (
                              <div className="absolute bottom-7 left-5/6 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded-lg">
                                Link Copied!
                              </div>
                            )}
                          </span>
                          <span className="sm:ml-[20px]" title="Download photo">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 74 113"
                              width="20"
                              height="20"
                            >
                              <path
                                d="M34.559 92.3938C34.713 92.5478 34.8827 92.686 35.0635 92.8065L35.3028 92.9391L35.5819 93.0717L35.9009 93.1784L36.193 93.2711L36.1939 93.2711C36.6326 93.361 37.0842 93.361 37.5228 93.2711L37.8149 93.1784L38.1339 93.0717L38.4659 92.8992L38.7051 92.7666L38.7061 92.7666C38.8878 92.6461 39.0566 92.5079 39.2115 92.354L63.4329 68.1729C64.733 66.8737 64.733 64.7658 63.4329 63.4668C62.1337 62.1676 60.0267 62.1676 58.7268 63.4668L40.2349 81.9725L40.2349 3.3235C40.2349 1.48832 38.7465 -2.61322e-05 36.9113 -2.62927e-05C35.0762 -2.64531e-05 33.5878 1.48832 33.5878 3.3235L33.5878 81.9725L15.0959 63.4799C13.7958 62.1807 11.6888 62.1807 10.3898 63.4799C9.0897 64.78 9.0897 66.887 10.3898 68.186L34.559 92.3938Z"
                                fill="#eee"
                              ></path>
                              <path
                                d="M3.67645 112.987L70.1471 112.987C71.9776 112.987 73.4632 111.507 73.4706 109.676L73.4706 90.6392C73.4706 88.8031 71.9822 87.3157 70.1471 87.3157C68.3119 87.3157 66.8235 88.8031 66.8235 90.6392L66.8235 106.34L6.99998 106.34L6.99998 90.6392C6.99998 88.8031 5.51163 87.3157 3.67645 87.3157C1.84127 87.3157 0.352922 88.8031 0.352922 90.6392L0.35292 109.676C0.360339 111.507 1.84592 112.987 3.67645 112.987Z"
                                fill="#eee"
                              ></path>
                            </svg>
                          </span>
                          <span className="sm:ml-[20px]" title="Add to ">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.5"
                              stroke="white"
                              width="24"
                              height="24"
                              onClick={() => handleAddToFavorites(image)}
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                              ></path>
                            </svg>
                          </span>
                        </div>
                      </button>
                    </div>

                    {/* <div className="px-3 py-2 hidden group-hover:flex absolute bottom-0 right-0 z-2 w-full ml-auto text-white text-xl gap-2">
              <FaRegShareSquare className="" />
              <FaRegHeart className="" />
              <MdOutlineFileDownload className="" />
            </div> */}
                  </div>
                ))}
            </div>
          ))}
      </div>

      {/* Modal for displaying the clicked image */}
      {modalVisible && (
        <div
          className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-white bg-opacity-75 z-40"
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

export default ShowImages;
