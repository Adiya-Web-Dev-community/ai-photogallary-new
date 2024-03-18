// import { useNavigate } from "react-router-dom";
// import "./eventCard.css";

// import * as React from "react";
// import Card from "@mui/material/Card";
// import CardActions from "@mui/material/CardActions";
// import CardContent from "@mui/material/CardContent";
// import CardMedia from "@mui/material/CardMedia";
// import Button from "@mui/material/Button";
// import Typography from "@mui/material/Typography";

// const EventCard = ({ event }) => {
//   const navigate = useNavigate();
//   return (
//     <Card
//       sx={{
//         borderRadius: "15px",
//         padding: "10px",
//         border: "1px solid",
//         borderColor: "rgb(187, 187, 187)",
//         cursor: "pointer",
//       }}
//       onClick={() => {
//         navigate(`/event/${event.eventName}/${event._id}`);
//       }}
//     >
//       <CardMedia
//         sx={{ height: 100, width: 100, margin: "auto" }}
//         image={event.coverImage}
//         title="green iguana"
//       />
//       <CardContent>
//         <Typography gutterBottom variant="h6" component="div">
//           {event.eventName}
//         </Typography>
//         <Typography variant="body2" color="text.secondary"></Typography>
//         <p>{new Date(event.eventDate).toDateString()}</p>
//       </CardContent>
//       <CardActions>
//         <Button
//           size="small"
//           sx={{
//             color: event.status === "unpublished" ? "orange" : "green",
//             borderColor: event.status === "unpublished" ? "orange" : "green",
//           }}
//           variant={"outlined"}
//           onClick={() => {
//             navigate(`/event/${event.eventName}/${event._id}`);
//           }}
//         >
//           {event.status === "unpublished" ? "Unpublished" : "Published"}
//         </Button>
//       </CardActions>
//     </Card>
//   );
// };

// export default EventCard;
//================================================
import { useNavigate } from "react-router-dom";
import { FaRegEye } from "react-icons/fa6";
import { MdOutlineDelete } from "react-icons/md";

const EventCard = ({ event, onDelete }) => {
  const navigate = useNavigate();

  const handleViewClick = () => {
    navigate(`/event/${event.eventName}/${event._id}`);
  };
  const handleDeleteClick = () => {
    onDelete(event._id);
  };
  return (
    <div className="w-96 rounded overflow-hidden shadow-sm bg-white hover:shadow-xl transition duration-300 ">
      <img
        className="w-full h-48 object-cover object-center"
        src={event.coverImage}
        title="Event Image"
      />
      <div className="flex  justify-between items-center px-6 py-4">
        <div>
          <h2
            className="font-bold text-xl mb-2 hover:underline hover:underline-offset-4 hover:cursor-pointer "
            onClick={handleViewClick}
          >
            {event.eventName}
          </h2>
          <p className="text-gray-700 text-sm">
            {new Date(event.eventDate).toDateString()}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <button
            onClick={handleViewClick}
            className="font-bold  p-3 rounded-full bg-gray-200 mr-2 text-gray-500"
          >
            <FaRegEye />
          </button>
          <button
            onClick={handleDeleteClick}
            className="font-bold  p-3 rounded-full bg-red-100 text-red-500"
          >
            <MdOutlineDelete />
          </button>
        </div>
        {/* <p className="text-gray-600 text-base">{event.description}</p> */}
        {/* <div className="mt-4 ml-auto">
          <div
            className={`text-sm px-4 py-2 border inline-block  ${
              event.status === "unpublished"
                ? "text-orange-500 border-orange-500"
                : "text-green-500 border-green-500"
            }`}
          >
            {event.status === "unpublished" ? "Unpublished" : "Published"}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default EventCard;
