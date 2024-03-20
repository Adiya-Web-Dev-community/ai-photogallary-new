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

const EventCard = ({ event, onDelete, onUpdateStatus }) => {
  const navigate = useNavigate();

  const handleViewClick = () => {
    navigate(`/event/${event.eventName}/${event._id}`);
  };

  const handleDeleteClick = () => {
    onDelete(event._id);
  };

  const handleStatusToggle = () => {
    const newStatus =
      event.status === "published" ? "unpublished" : "published";
    onUpdateStatus(event._id, newStatus);
  };

  return (
    <div className="w-96 rounded-xl overflow-hidden shadow-sm bg-white hover:shadow-xl transition duration-300 ">
      <img
        className="w-full h-48 object-cover object-center"
        src={event.coverImage}
        title="Event Image"
      />
      <div className="flex  justify-between items-center px-6 py-4 ">
        <div className="mr-4 cursor-pointer" onClick={handleViewClick}>
          <h2 className="font-bold text-lg mb-2 hover:underline hover:underline-offset-4 hover:cursor-pointer ">
            {event.eventName.length > 20
              ? `${event.eventName.slice(0, 20)}...`
              : event.eventName}
          </h2>
          <p className="text-gray-700 text-sm">
            {new Date(event.eventDate).toDateString()}
          </p>
        </div>
        <div className="">
          <div className="flex items-center justify-evenly mb-3">
            <button
              onClick={handleViewClick}
              className="font-bold text-xl p-2.5 rounded-full bg-gray-200 mr-2 text-gray-500 hover:bg-gray-700 hover:text-white"
            >
              <FaRegEye />
            </button>
            <button
              onClick={handleDeleteClick}
              className="font-bold text-xl  p-2.5 rounded-full bg-red-100 text-red-500 hover:bg-red-500 hover:text-white"
            >
              <MdOutlineDelete />
            </button>
          </div>
          <div className="flex items-center justify-center">
            <button
              onClick={handleStatusToggle}
              className={`text-sm px-3 py-1 rounded-xl border-[1px] inline-block font-semibold ${
                event.status === "unpublished"
                  ? "text-orange-300  bg-yellow-50 hover:bg-yellow-500 hover:text-white"
                  : "text-green-500 bg-green-50 hover:bg-green-500 hover:text-white"
              }`}
            >
              {event.status === "unpublished" ? "Unpublished" : "Published"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
