import React, { useEffect } from "react";
import ShowImages from "../ShowImages/ShowImages";
import ShowVideos from "../ShowVideos/ShowVideos";
import "./FullAccessEventPage.css";
import axios from "../../../helpers/axios";
import { useParams } from "react-router-dom";

const Event = () => {
  const { id } = useParams();
  const [tab, setTab] = React.useState("images");
  const [event, setEventData] = React.useState(null);

  useEffect(() => {
    axios.get(`/event/${id}`).then((res) => {
      setEventData(res.data.data);
    });
  }, []);

  // Function to format event date
  const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleString("default", { month: "short" });
    const day = date.getDate();
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  };
  // Format event date if it exists
  const formattedDate = event?.eventDate
    ? formatEventDate(event.eventDate)
    : "";

  return (
    <div className="event-container">
      <div>
        <div className="relative w-full">
          <img
            src={event?.coverImage}
            className="w-full h-[70vh] object-cover "
          />
          <div className="absolute inset-0 flex w-full h-full flex-col items-center justify-center text-white bg-black bg-opacity-25">
            <h1 className="text-3xl font-bold">
              {event?.eventName.toUpperCase()}
            </h1>
            <h2 className="text-2xl font-semibold">{formattedDate}</h2>{" "}
            {/* Use formatted date here */}
          </div>
        </div>
      </div>
      {/* <div className="tabs mx-24 mt-4">
        <button
          className={`tab-button ${tab === "images" ? "active" : ""}`}
          onClick={() => setTab("images")}
        >
          Images
        </button>
        <button
          className={`tab-button ${tab === "videos" ? "active" : ""}`}
          onClick={() => setTab("videos")}
        >
          Videos
        </button>
      </div> */}
      <div className="show-container">
        {/* {tab === "images" ? <ShowImages event={event} /> : <ShowVideos />} */}
        <ShowImages event={event} />
      </div>
    </div>
  );
};

export default Event;
