import React, { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import axios from "../../../helpers/axios";

const AllImagesContainer = ({
  eventData,
  setOpenImagesCorousalModal,
  setSelectedImage,
  paginationData,
  setPageNo,
  eventId,
  categoryId,
  setImagesData,
}) => {
  const [selectedImages, setSelectedImages] = useState([]);
  console.log("ALLIMAGECONTAINER_CATEGORI ID", categoryId);
  const handleImagesOnClick = (idx) => {
    setOpenImagesCorousalModal(true);
    setSelectedImage(idx);
  };

  const handleCheckboxChange = (idx) => {
    if (selectedImages.includes(idx)) {
      setSelectedImages(selectedImages.filter((imageIdx) => imageIdx !== idx));
    } else {
      setSelectedImages([...selectedImages, idx]);
    }
  };
  const handleDeleteImages = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`/event/${eventId}/event-images`, {
        headers: {
          authorization: token,
        },
        data: {
          eventId: eventId,
          collectionId: categoryId,
          imageUrls: selectedImages,
        },
      });
      console.log("ALLIMAGE RESSSSSS", response.data);
      setImagesData(response.data.data.imageArr);
      // Handle success or error response accordingly
    } catch (error) {
      console.error("Error deleting images:", error);
    }
  };

  return (
    <div className="px-2 w-full">
      {/* image list */}

      {eventData && !eventData.length ? (
        <div className="w-full h-full flex justify-center items-center ">
          <h3 className="w-full text-center font-bold mt-[10rem] text-xl text-gray-400">
            No Images uploaded for this event
          </h3>
        </div>
      ) : (
        <>
          <p
            onClick={handleDeleteImages}
            className="px-2 flex ml-auto w-fit cursor-pointer hover:text-red-500 mb-2 font-semibold"
          >
            <RiDeleteBin6Line className="mt-1 " />
            <span className="ml-2">Delete Selected</span>
          </p>
          <div className="min-h-[60vh] grid grid-cols-3 w-full  gap-2 p-4">
            {eventData &&
              eventData.map((image, idx) => (
                <div
                  key={idx}
                  className="relative p-2 w-auto h-56 bg-white rounded-lg"
                >
                  <img
                    src={image}
                    alt="image"
                    className="w-full h-full bg-cover rounded-lg"
                    onClick={() => handleImagesOnClick(image)}
                  />
                  <input
                    type="checkbox"
                    checked={selectedImages.includes(image)}
                    onChange={() => handleCheckboxChange(image)}
                    className="absolute top-3 left-3 w-4 h-4 cursor-pointer"
                  />
                </div>
              ))}
          </div>
        </>
      )}

      {/* pagination buttons */}
      <div className="flex justify-center items-center py-10">
        <div className="flex justify-cenetr items-center gap-3">
          {[...Array(paginationData?.totalPages)].map((_, i) => {
            return (
              <p
                onClick={() => setPageNo(i + 1)}
                key={i}
                className="bg-gray-300 pt-[3px] w-[2rem] h-[2rem] rounded-md text-center cursor-pointer hover:bg-gray-700 hover:text-white"
              >
                {i + 1}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AllImagesContainer;
