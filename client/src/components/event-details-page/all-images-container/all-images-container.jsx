const AllImagesContainer = ({
  eventData,
  setOpenImagesCorousalModal,
  setSelectedImage,
  paginationData,
  setPageNo,
}) => {
  const handleImagesOnClick = (idx) => {
    setOpenImagesCorousalModal(true);
    setSelectedImage(idx);
  };

  return (
    <div className="px-2 w-full">
      {/* image list */}

      {!eventData.length ? (
        <div className="w-full h-full flex justify-center items-center ">
          <h3 className="w-full text-center font-bold mt-[10rem] text-xl text-gray-400">
            No Images uplaoded for this event
          </h3>
        </div>
      ) : (
        <div className=" h-[23rem] grid grid-cols-4 w-full  gap-4 justify-center items-center space-y-2">
          {eventData.map((image, idx) => (
            <img
              key={idx}
              src={image}
              alt="image"
              className="w-[14rem] h-[10rem]"
              onClick={() => handleImagesOnClick(image)}
            />
          ))}
        </div>
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
