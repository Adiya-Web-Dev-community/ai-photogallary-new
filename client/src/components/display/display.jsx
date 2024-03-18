import { useEffect, useState } from "react";

const Display = ({ event }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  });
  // Function to format event date
  const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleString("default", { month: "short" });
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day} ${year}`;
  };
  // Format event date if it exists
  const formattedDate = event?.eventDate
    ? formatEventDate(event?.eventDate)
    : "";

  return (
    <div className="container">
      <div className="max-w-3xl mx-auto">
        <div className="text-center text-2xl font-semibold text-gray-600">
          <p>This event is not live yet.</p>
          <p>We will soon notify you when the event is published,</p>
          <p>Thank you for visiting Ai gallery</p>
        </div>
        <div className="flex bg-gray-100 p-14 mt-4">
          <div className="w-1/2">
            <div className="w-80 h-auto bg-white p-4 mt-10">
              <img src={event?.coverImage} alt="" className="" />
              <p className="italic text-center mt-2 text-lg text-gray-600"></p>
            </div>
          </div>
          <div className="w-1/2 flex flex-col justify-evenly ml-14">
            <div className="italic text-center mt-2 text-2xl text-gray-600">
              {event?.eventName}
            </div>
            <div className="flex justify-evenly items-center mt-10 font-black text-2xl align-middle">
              <p className="py-6">{formattedDate.split(" ")[0]}</p>
              <p className="border-x-4 border-gray-700 p-6 text-4xl font-black ">
                {formattedDate.split(" ")[1]}
              </p>
              <p className="py-6">{formattedDate.split(" ")[2]}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col item-center justify-center bg-gray-100 text-center px-10 pb-16">
          <p className="font-semibold">Venue- </p>
          <p className="font-semibold">
            {event?.venue ||
              `Badi-Gorela-Mulla Talai Rd, Haridas Ji Ki Magri
            Pichola, Udaipur, Rajasthan 313001`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Display;
