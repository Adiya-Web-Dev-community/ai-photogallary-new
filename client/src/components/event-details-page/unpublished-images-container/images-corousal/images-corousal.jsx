// import { Box, Button, Card, CardMedia } from "@mui/material";
// import "./images-corousal.css";
// import { useParams } from "react-router-dom";
// import axios from "../../../../helpers/axios";
// const ImagesCorousal = ({ imgUrl, handleCloseImagesCorousalModal }) => {
//   const { eventId, eventName } = useParams();
//   const token = localStorage.getItem("token");

//   const handaleDeleteImage = async () => {
//     await axios
//       .delete(
//         `/event/${eventId}/event-images`,
//         {
//           imagesArray: [imgUrl],
//         },
//         {
//           headers: {
//             authorization: token,
//           },
//         }
//       )
//       .then((res) => {
//         return res;
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };

//   const handleDownload = () => {
//     // Create an anchor element
//     const anchor = document.createElement("a");
//     anchor.href = downloadUrl;

//     // Extract filename from URL
//     const urlParts = anchor.href.split("/");
//     const filename = urlParts[urlParts.length - 1];
//     anchor.download = filename;

//     // Append the anchor to the body
//     document.body.appendChild(anchor);

//     // Click the anchor to trigger the download
//     anchor.click();

//     // Remove the anchor from the body
//     document.body.removeChild(anchor);
//   };

//   return (
//     <>
//       <CardMedia
//         sx={{ width: "700px", height: "300px", marginBottom: "10px" }}
//         className=""
//       >
//         <img src={imgUrl} style={{ height: "100%", width: "100%" }} />
//       </CardMedia>
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//         }}
//       >
//         {/* <Button
//           color="error"
//           variant="contained"
//           onClick={() => {
//             handaleDeleteImage();
//           }}
//         >
//           Delete
//         </Button>
//         <Button
//           sx={{ margin: "0px 10px" }}
//           color="primary"
//           variant="contained"
//           onClick={() => {
//             handleDownload(imgUrl);
//           }}
//         >
//           Download
//         </Button>
//         <Button
//           color="error"
//           variant="outlined"
//           onClick={() => {
//             handleCloseImagesCorousalModal();
//           }}
//         >
//           Close
//         </Button> */}
//       </Box>
//     </>
//   );
// };

// export default ImagesCorousal;
//=======================================
import { useParams } from "react-router-dom";
import axios from "../../../../helpers/axios";

const ImagesCorousal = ({ imgUrl, handleCloseImagesCorousalModal }) => {
  const { eventId } = useParams();
  const token = localStorage.getItem("token");

  const handaleDeleteImage = async () => {
    try {
      await axios.delete(`/event/${eventId}/event-images`, {
        data: {
          imagesArray: [imgUrl],
        },
        headers: {
          authorization: token,
        },
      });
      // Assuming successful deletion, you can perform any necessary actions here
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleDownload = () => {
    // Implement your download logic here
  };

  return (
    <>
      <div className="max-w-7xl mb-10">
        <img src={imgUrl} alt="carousel" className="max-w-4xl h-auto" />
      </div>
      {/* <div className="flex justify-center">
        <button
          className="bg-red-500 text-white px-4 py-2 mr-2 rounded hover:bg-red-600"
          onClick={handaleDeleteImage}
        >
          Delete
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 mr-2 rounded hover:bg-blue-600"
          onClick={handleDownload}
        >
          Download
        </button>
        <button
          className="border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-100"
          onClick={handleCloseImagesCorousalModal}
        >
          Close
        </button>
      </div> */}
    </>
  );
};

export default ImagesCorousal;
