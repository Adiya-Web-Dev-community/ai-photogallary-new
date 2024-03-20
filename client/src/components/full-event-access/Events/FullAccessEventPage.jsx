import React, { useState, useEffect } from "react";
import ShowImages from "../ShowImages/ShowImages";
import "./FullAccessEventPage.css";
import axios from "../../../helpers/axios";
import { useParams } from "react-router-dom";
import copy from "clipboard-copy";
//icons
import { CiHeart } from "react-icons/ci";
import { CiShare2 } from "react-icons/ci";
//modal
import SignupLoginPopup from "../SignupLoginPopup";

const Event = () => {
  const { id } = useParams();
  const token = localStorage.getItem("user-token");
  const [tab, setTab] = React.useState("images");
  const [event, setEventData] = React.useState(null);

  useEffect(() => {
    axios.get(`/event/${id}`).then((res) => {
      setEventData(res.data.data);
    });
  }, []);

  //copy website link
  const [copied, setCopied] = useState(false);
  const handleShareClick = () => {
    const link = event?.link;
    copy(link); // Copy the link
    setCopied(true); // Set copied state to true
    setTimeout(() => {
      setCopied(false); // Reset copied state after 2 seconds
    }, 1000);
  };

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

  //login modal
  const [openLoginModal, setOpenLoginModal] = useState(false);

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
      {/* tabs navigation section */}
      <div className="w-full space-y-2 py-2 px-4 shadow-md rounded-b-lg flex justify-between ">
        <div>
          <h1 className="text-xl italic font-bold">{event?.eventName}</h1>
          <h1 className="text-lg">{formattedDate}</h1>
        </div>
        <div className="flex gap-4">
          <section className="flex gap-2 cursor-pointer">
            <CiHeart className="mt-1 text-xl" />
            {token ? (
              <span>My favourites</span>
            ) : (
              <span onClick={() => setOpenLoginModal(true)}>Favourites</span>
            )}
          </section>
          <section
            className="flex gap-2 cursor-pointer relative"
            onClick={handleShareClick}
          >
            <CiShare2 className="mt-1 text-xl" />
            Share
            {copied && (
              <div className="absolute bottom-7 left-5/6 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded-lg">
                Link Copied!
              </div>
            )}
          </section>
        </div>
      </div>
      <div className="show-container">
        {/* {tab === "images" ? <ShowImages event={event} /> : <ShowVideos />} */}
        <ShowImages event={event} />
      </div>.
      {openLoginModal && <SignupLoginPopup />}
    </div>
  );
};

export default Event;
