import "./EventDetailsPage.css";
import { CiEdit } from "react-icons/ci";
import { ImBin } from "react-icons/im";
import { useEffect, useState } from "react";
import { Modal, Box } from "@mui/material";
import AddVideoLinkModal from "./add-video-link-modal/add-video-link-modal";
import axios from "../../helpers/axios";
import { useParams, useNavigate } from "react-router-dom";
import AddImageModal from "./add-image-modal/add-image-modal";
import AllImagesContainer from "./all-images-container/all-images-container";
import AllVideosContainer from "./all-videos-container/all-videos-container";
import UnpublishedImagesContainer from "./unpublished-images-container/unpublished-images-container";
import { toast } from "react-hot-toast";
import ImagesCorousal from "./unpublished-images-container/images-corousal/images-corousal";
import ImageCategory from "./ImageCategory";

const EventDetailsPage = () => {
  const { eventName, eventId } = useParams();
  const token = localStorage.getItem("token");
  const [containerRendering, setContainerRendering] = useState("allImages");
  const [eventData, setEventData] = useState([]);
  const [isEditData, setIsEditData] = useState({
    isEdit: false,
    data: {},
  });
  const [selectedImage, setSelectedImage] = useState("");
  const [paginationData, setPaginationData] = useState({});
  const [categoryId, setCategroyId] = useState("");

  const [allImages, setAllImages] = useState([]);
  const navigate = useNavigate();

  //fetch event details
  const [eventDetails, setEventDetails] = useState({});

  const getData = async (param, callBack) => {
    try {
      const resp = await axios.get(param);
      // console.log("data", resp.data.data);
      callBack(resp.data.data);
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  };

  const fetchEventDetails = async () => {
    getData(`/event/${eventId}`, setEventDetails);
  };

  useEffect(() => {
    fetchEventDetails();
  }, []);

  const handleEventStatus = async () => {
    let Estatus;
    if (eventDetails?.status === "published") {
      Estatus = "unpublished";
    } else if (eventDetails?.status === "unpublished") {
      Estatus = "published";
    }
    console.log(Estatus);
    try {
      axios
        .put(
          `/event/${eventId}`,
          { status: Estatus },
          { headers: { authorization: token } }
        )
        .then((res) => {
          console.log("sattus", res);
          if (res.data.success) {
            fetchEventDetails();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
    fetchEventDetails();
  };

  //delete event
  const handleDelete = async () => {
    try {
      const resp = await axios.delete(`/event/${eventId}`);
      if (resp.data.success) {
        navigate("/all-events-list");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const [pageNo, setPageNo] = useState(paginationData?.currentPage || 1);

  const getAllThePostImage = async () => {
    getData(`/event/${eventId}/event-images?page=${pageNo}`, setAllImages);
  };

  //when page no changes fetch images
  useEffect(() => {
    getAllThePostImage();
  }, [pageNo]);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    bgcolor: "#ffff",
    borderRadius: "3px",
    boxShadow: "inset 1px 1px 5px -1px rgba(0,0,0,0.5)",
    p: 4,
  };

  const [imagesCorousalArr, setImagesCorousalArr] = useState([]);
  const [imageIndex, setImageIndex] = useState();
  const [openImagesCorousalModal, setOpenImagesCorousalModal] = useState(false);
  const handleOpenImagesCorousalModal = () => setOpenImagesCorousalModal(true);
  const handleCloseImagesCorousalModal = () =>
    setOpenImagesCorousalModal(false);

  const [videoLinkArr, setVideoLinkArr] = useState([]);
  // console.log(videoLinkArr);
  const [openVideoLinkModal, setOpenVideoLinkModal] = useState(false);
  const handleOpenVideoLinkModal = () => setOpenVideoLinkModal(true);
  const handleCloseVideoLinkModal = () => setOpenVideoLinkModal(false);

  const [imgArr, setImgArr] = useState([]);
  const [imgLinkArr, setImgLinkArr] = useState([]);
  // console.log(imgArr)
  // console.log(imgLinkArr);
  const [openAddImagesModal, setOpenAddImagesModal] = useState(false);
  const handleOpenAddImagesModal = () => setOpenAddImagesModal(true);
  const handleCloseAddImagesModal = () => setOpenAddImagesModal(false);

  const getEventDetails = async () => {
    await axios
      .get(`/event/${eventId}/youtube-links`, {
        headers: {
          authorization: token,
        },
      })
      .then((res) => {
        console.log(res.data);
        setEventData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getEventDetails();
  }, []);

  return (
    <div className="event-form-page-wrapper">
      <section className="event-form-page-header">
        <div className="event-form-page-header-lb">
          <button disabled={!categoryId} onClick={handleOpenAddImagesModal}>
            Upload Images
          </button>
          <button onClick={handleOpenVideoLinkModal}>Upload Video Link</button>
        </div>
        <div className="event-form-page-header-rb">
          <h4>{eventName}</h4>
          {/* <h4>
            <CiEdit />
          </h4> */}
        </div>
      </section>
      <main className="flex gap-2">
        <section className="w-[75%]">
          <div className="flex gap-3 px-10 py-2 pb-4">
            <section>
              <button
                className="px-4 py-0.5 rounded-md font-bold "
                style={{
                  backgroundColor:
                    containerRendering == "allImages"
                      ? "#f0f0f0"
                      : "transparent",
                }}
                onClick={() => setContainerRendering("allImages")}
              >
                IMAGES
              </button>
            </section>
            <section>
              <button
                onClick={() => setContainerRendering("videos")}
                className="px-4 py-0.5 rounded-md font-bold "
                style={{
                  backgroundColor:
                    containerRendering == "videos" ? "#f0f0f0" : "transparent",
                }}
              >
                VIDEOS
              </button>
            </section>
            <section>
              <button
                onClick={() => setContainerRendering("user-images")}
                className="px-4 py-0.5 rounded-md font-bold "
                style={{
                  backgroundColor:
                    containerRendering == "user-images"
                      ? "#f0f0f0"
                      : "transparent",
                }}
              >
                USER FAVOURITES IMAGES
              </button>
            </section>
          </div>
          <div className="w-[90%] m-auto">
            <section
              style={{
                display: containerRendering == "allImages" ? "block" : "none",
              }}
            >
              {/* <AllImagesContainer
                eventData={allImages}
                setSelectedImage={setSelectedImage}
                setOpenImagesCorousalModal={setOpenImagesCorousalModal}
                getAllThePostImage={getAllThePostImage}
                paginationData={paginationData}
                setPageNo={setPageNo}
              /> */}

              <ImageCategory
                setCategroyId={setCategroyId}
                setSelectedImage={setSelectedImage}
                setOpenImagesCorousalModal={setOpenImagesCorousalModal}
              />
            </section>
            <section
              style={{
                display: containerRendering == "user-images" ? "block" : "none",
              }}
            >
              <h2 className="text-lg font-semibold">User Favorite Images</h2>
            </section>
            <section
              style={{
                display:
                  containerRendering == "unpublishedImages" ? "block" : "none",
              }}
            >
              {/* <UnpublishedImagesContainer
                eventData={eventData}
                getEventDetails={getEventDetails}
              /> */}
            </section>
            <section
              style={{
                display: containerRendering == "videos" ? "block" : "none",
              }}
            >
              <AllVideosContainer
                onClick={(el) => {
                  setIsEditData((prev) => ({
                    ...prev,
                    isEdit: true,
                    data: el,
                  }));
                  handleOpenVideoLinkModal();
                }}
                eventData={eventData}
                getEventDetails={getEventDetails}
              />
            </section>
          </div>
        </section>
        <div className="border-2 w-[25%] h-screen ">
          {/* cover img */}
          <div className="w-[96%] h-[16rem] m-auto ">
            <h1 className="font-bold text-center py-2">Cover Image</h1>
            <img src={eventDetails?.coverImage} className="w-full h-full " />
          </div>
          {/* buttons section */}
          <div className="flex flex-col justify-center items-center gap-3">
            <p className="mt-5">
              Event Code: <span>{eventDetails?.eventCode}</span>
            </p>

            <button
              className="border-2 w-[15rem] bg-gray-300 rounded-md py-1.5 hover:shadow-lg hover:font-bold bg-gray-200"
              onClick={() => navigate(`/share-with-client/event/${eventId}`)}
            >
              Share with client
            </button>
            <button className="border-2 w-[15rem] bg-gray-300 rounded-md py-1.5 hover:shadow-lg hover:font-bold bg-gray-200">
              Preview
            </button>
            <button
              className="border-2 w-[15rem] bg-gray-300 rounded-md py-1.5 hover:shadow-lg hover:font-bold bg-gray-200 capitalize"
              onClick={handleEventStatus}
            >
              status:{eventDetails?.status}
            </button>
            <button
              className="flex justify-center gap-2 border-2 w-[15rem] bg-gray-300 rounded-md py-1.5 hover:shadow-lg hover:font-bold bg-gray-200"
              onClick={handleDelete}
            >
              <span>Delete Event</span>
              <ImBin className="mt-1" />
            </button>
          </div>
        </div>
      </main>

      {/* Add Image Modal */}
      <Modal
        open={openAddImagesModal}
        onClose={() => {
          getAllThePostImage();
          handleCloseAddImagesModal();
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="add-images-popup-modal"
      >
        <Box sx={style}>
          <AddImageModal
            handleCloseAddImagesModal={() => {
              getAllThePostImage();
              handleCloseAddImagesModal();
            }}
            imgArr={imgArr}
            setImgArr={setImgArr}
            imgLinkArr={imgLinkArr}
            setImgLinkArr={setImgLinkArr}
            eventData={eventData}
            categoryId={categoryId}
            // getEventDetails={getEventDetails}
          />
        </Box>
      </Modal>
      {/* Add Image Modal */}

      {/* Add Video Link Modal */}
      <Modal
        open={openVideoLinkModal}
        onClose={() => {
          handleCloseVideoLinkModal();
          getEventDetails();
          setIsEditData((prev) => ({ ...prev, isEdit: false, data: {} }));
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="create-event-popup-modal"
      >
        <Box sx={style}>
          <p
            className="text-right pb-2 font-bold hover:text-lg cursor-pointer"
            onClick={handleCloseVideoLinkModal}
          >
            x
          </p>
          <AddVideoLinkModal
            edit={isEditData.isEdit}
            data={isEditData.data}
            onClick={() => {
              setIsEditData((prev) => ({ ...prev, isEdit: false, data: {} }));
            }}
            handleCloseVideoLinkModal={handleCloseVideoLinkModal}
            videoLinkArr={videoLinkArr}
            setVideoLinkArr={setVideoLinkArr}
            getEventDetails={getEventDetails}
            eventData={eventData}
          />
        </Box>
      </Modal>
      {/* Add Video Link Modal */}

      {/* Images Corousal Modal */}
      <Modal
        open={openImagesCorousalModal}
        onClose={handleCloseImagesCorousalModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="create-event-popup-modal"
      >
        <Box sx={style}>
          <ImagesCorousal
            handleCloseImagesCorousalModal={handleCloseImagesCorousalModal}
            imagesCorousalArr={imagesCorousalArr}
            setImagesCorousalArr={setImagesCorousalArr}
            // getEventDetails={getEventDetails}
            eventData={eventData}
            imageIndex={imageIndex}
            imgUrl={selectedImage}
            setImageIndex={setImageIndex}
          />
        </Box>
      </Modal>
      {/* Images Corousal Modal */}
    </div>
  );
};

export default EventDetailsPage;
