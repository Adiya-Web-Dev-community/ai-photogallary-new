// import React, { useState, useEffect } from "react";
// import ShowImages from "../ShowImages/ShowImages";
// import "./FullAccessEventPage.css";
// import axios from "../../../helpers/axios";
// import { useParams } from "react-router-dom";
// import copy from "clipboard-copy";
// //icons
// import { CiHeart } from "react-icons/ci";
// import { CiShare2 } from "react-icons/ci";
// //modal
// import SignupLoginPopup from "../SignupLoginPopup";
// import Favourites from "../Favourites";

// const Event = () => {
//   const { id } = useParams();
//   const token = localStorage.getItem("fav-token");
//   const [tab, setTab] = useState("images");
//   const [event, setEventData] = useState(null);
//   const [copied, setCopied] = useState(false);
//   const [openLoginModal, setOpenLoginModal] = useState(false);
//   const [showFavourites, setShowFavourites] = useState(false);

//   useEffect(() => {
//     axios.get(`/event/${id}`).then((res) => {
//       setEventData(res.data.data);
//     });
//   }, []);

//   const handleShareClick = () => {
//     const link = event?.link;
//     copy(link);
//     setCopied(true);
//     setTimeout(() => {
//       setCopied(false);
//     }, 1000);
//   };

//   const formatEventDate = (dateString) => {
//     const date = new Date(dateString);
//     const month = date.toLocaleString("default", { month: "short" });
//     const day = date.getDate();
//     const year = date.getFullYear();
//     return `${day} ${month}, ${year}`;
//   };
//   const formattedDate = event?.eventDate
//     ? formatEventDate(event.eventDate)
//     : "";

//   return (
//     <div className="event-container">
//       <div>
//         <div className="relative w-full">
//           <img
//             src={event?.coverImage}
//             className="w-full h-[70vh] object-cover "
//           />
//           <div className="absolute inset-0 flex w-full h-full flex-col items-center justify-center text-white bg-black bg-opacity-25 divide-y-2 ">
//             <h1 className="text-3xl font-bold">
//               {event?.eventName.toUpperCase()}
//             </h1>
//             <h2 className="text-2xl font-semibold">{formattedDate}</h2>{" "}
//           </div>
//         </div>
//       </div>
//       <div className="w-full py-3 px-20 shadow-md flex items-center justify-between ">
//         <div>
//           <h1 className="text-xl italic font-bold">{event?.eventName}</h1>
//           <h1 className="text-lg">{formattedDate}</h1>
//         </div>
//         <div className="flex gap-4">
//           <section className="flex gap-2 cursor-pointer">
//             <CiHeart className="mt-1 text-xl" />
//             {token ? (
//               <span onClick={() => setShowFavourites(true)}>My favourites</span>
//             ) : (
//               <span onClick={() => setOpenLoginModal(true)}>Favourites</span>
//             )}
//           </section>
//           <section
//             className="flex gap-2 cursor-pointer relative"
//             onClick={handleShareClick}
//           >
//             <CiShare2 className="mt-1 text-xl" />
//             Share
//             {copied && (
//               <div className="absolute bottom-7 left-5/6 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded-lg">
//                 Link Copied!
//               </div>
//             )}
//           </section>
//         </div>
//       </div>
//       <div className="show-container p-4">
//         {showFavourites && <Favourites />}
//         <ShowImages event={event} />
//       </div>
//       {openLoginModal && (
//         <SignupLoginPopup onClose={() => setOpenLoginModal(false)} />
//       )}
//     </div>
//   );
// };

// export default Event;
//====================================
import React, { useState, useEffect } from "react";
import ShowImages from "../ShowImages/ShowImages";
import "./FullAccessEventPage.css";
import axios from "../../../helpers/axios";
import { useNavigate, useParams } from "react-router-dom";
import copy from "clipboard-copy";
//icons
import { CiHeart } from "react-icons/ci";
import { CiShare2 } from "react-icons/ci";
import { FaSignOutAlt } from "react-icons/fa";
//modal
import SignupLoginPopup from "../SignupLoginPopup";
import Favourites from "../Favourites";

const Event = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("fav-token");
  const [tab, setTab] = useState("images");
  const [event, setEventData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [showFavourites, setShowFavourites] = useState(false);
  const [loggedIn, setLoggedIN] = useState(false);

  useEffect(() => {
    axios.get(`/event/${id}`).then((res) => {
      setEventData(res.data.data);
    });
  }, []);

  const handleShareClick = () => {
    const link = event?.link;
    copy(link);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleString("default", { month: "short" });
    const day = date.getDate();
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  };
  const formattedDate = event?.eventDate
    ? formatEventDate(event.eventDate)
    : "";

  useEffect(() => {
    if (token) {
      setLoggedIN(true);
    } else {
      setLoggedIN(false);
    }
  }, [token, loggedIn]);

  return (
    <div className="event-container">
      <div>
        <div className="relative w-full">
          <img
            src={event?.coverImage}
            className="w-full h-[70vh] object-cover "
          />
          <div className="absolute inset-0 flex w-full h-full flex-col items-center justify-center text-white bg-black bg-opacity-25 divide-y-2 ">
            <h1 className="text-3xl font-bold">
              {event?.eventName.toUpperCase()}
            </h1>
            <h2 className="text-2xl font-semibold">{formattedDate}</h2>{" "}
          </div>
        </div>
      </div>
      <div className="w-full py-3 px-20 shadow-md flex items-center justify-between ">
        <div>
          <h1 className="text-xl italic font-bold">{event?.eventName}</h1>
          <h1 className="text-lg">{formattedDate}</h1>
        </div>
        <div className="flex gap-4">
          <section className="flex gap-2 cursor-pointer">
            <CiHeart className="mt-1 text-xl" />
            {loggedIn ? (
              <span onClick={() => setShowFavourites(true)}>My favourites</span>
            ) : (
              <span
                onClick={() => {
                  setOpenLoginModal(true);
                }}
              >
                Favourites
              </span>
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
          {loggedIn ? (
            <section
              className="cursor-pointer "
              onClick={() => {
                localStorage.clear("fav-token");
              }}
            >
              <FaSignOutAlt className="mt-1 text-lg" />
            </section>
          ) : null}
        </div>
      </div>
      <div className="container">
        {showFavourites ? (
          <Favourites setShowFavourites={setShowFavourites} />
        ) : (
          <ShowImages event={event} />
        )}
      </div>
      {openLoginModal && (
        <SignupLoginPopup onClose={() => setOpenLoginModal(false)} />
      )}
    </div>
  );
};

export default Event;
