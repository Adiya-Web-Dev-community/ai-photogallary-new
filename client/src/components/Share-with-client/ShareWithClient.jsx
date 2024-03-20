import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ShareWithClient.css";
import Switch from "@mui/material/Switch";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { FiSettings } from "react-icons/fi";
import axios from "../../helpers/axios";
import { useParams } from "react-router-dom";
//copy link
import copy from "clipboard-copy";
import toast from "react-hot-toast";

const FaceRecognitionGallery = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({});
  const [form, setForm] = useState({
    fullEventAccess: true,
    faceSearchAccess: true,
    clientEmail: true,
    shareWithCients: false,
  });

  //client emmails
  const [clientEmail, setClientEmail] = useState("");
  const [clientEmailArr, setClientEmailArr] = useState([]);
  const addClientEmail = () => {
    if (!clientEmail) {
      return toast.error("Please add client email");
    }
    if (clientEmailArr.find((email) => email === clientEmail)) {
      return toast.error("Client email already added");
    }
    setClientEmail("");
    setClientEmailArr([...clientEmailArr, clientEmail]);
  };
  useEffect(() => {
    console.log(clientEmailArr, clientEmailArr.length);
  }, [addClientEmail]);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.checked });
  };

  const getEventDetails = async () => {
    await axios
      .get(`/event/${id}`, {
        headers: {
          authorization: token,
        },
      })
      .then((res) => {
        console.log(res.data.data);
        setEventData(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getEventDetails();
  }, []);

  //copy links
  const [fullAccessLinkCopied, setFullAccessLinkCopied] = useState(false);
  const [faceSearchLinkCopied, setFaceSearchLinkCopied] = useState(false);
  const copyFullAccessLink = () => {
    setFaceSearchLinkCopied(false);
    copy(eventData?.link);
    setFullAccessLinkCopied(true);
    setTimeout(() => {
      setFullAccessLinkCopied(false);
    }, 2000); // Reset 'copied' state after 2 seconds
  };
  const copyFaceSearchLink = () => {
    setFullAccessLinkCopied(false);
    copy(eventData?.link);
    setFaceSearchLinkCopied(true);
    setTimeout(() => {
      setFaceSearchLinkCopied(false);
    }, 2000); // Reset 'copied' state after 2 seconds
  };

  //handle save
  const handleSave = async () => {
    try {
      const res = await axios.put(`/share-with-client/${id}`, {
        fullEventAccess: form.fullEventAccess,
        faceSearchAccess: form.faceSearchAccess,
        shareViaEmail: form.shareWithCients,
        emailsArray: clientEmailArr,
      });
      if (res.data.success) {
        toast.success(res.data.msg);
        setForm({ ...form, shareWithCients: false });
        setClientEmail("");
        setClientEmailArr([]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Function to format event date
  const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleString("default", { month: "short" });
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day} ${year}`;
  };
  // Format event date if it exists
  const formattedDate = eventData?.eventDate
    ? formatEventDate(eventData?.eventDate)
    : "";

  return (
    <div className="fr-gallery-wrapper  ">
      <section className="fr-gallery-header ">
        <div className="fr-gallery-header-lb">
          <button
            onClick={() => navigate(`/event/${eventData.eventName}/${id}`)}
          >
            <MdOutlineArrowBackIosNew />
          </button>
          <button>Share with client</button>
        </div>
        <div className="rounded-full border-2 border-gray-300 px-3 py-1 shadow-lg">
          <button className="flex gap-2 px-3">
            <FiSettings className="mt-1" />
            <span>Dashboard Settings</span>
          </button>
        </div>
      </section>
      <section className="mt-2 flex py-10 gap-8 justify-between w-[90%] m-auto h-[40rem]">
        <div className="flex gap-[3rem] flex-col border-r-4">
          <div className="flex flex-col px-2  gap-2">
            <h1 className="text-3xl font-bold">{eventData?.eventName}</h1>
            <h1 className="text-md  font-bold">
              {formattedDate.split(" ")[0]}, {formattedDate.split(" ")[1]},{" "}
              {formattedDate.split(" ")[2]}
            </h1>
            <h1 className="text-sm">{eventData?.venue}</h1>
          </div>
          <div className="px-3">
            <img
              src={eventData?.coverImage}
              alt="userImg"
              className="w-[35rem] h-[20rem]"
            />
          </div>
        </div>
        <div className="fr-gallery-main-rb">
          <h6 className="text-center text-md  font-bold">
            GENERAL SETTINGS & SHARING OPTIONS
          </h6>
          <div className="r1">
            <div className="flex px-[7rem] gap-[10rem]   m-auto">
              <div className="flex justify-between">
                <h6 className="text-lg">Full event access</h6>
                <div>
                  <Switch
                    checked={form.fullEventAccess}
                    onChange={handleChange}
                    name="fullEventAccess"
                    color="primary"
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <h6 className="text-lg">Face Search</h6>
                <div>
                  <Switch
                    checked={form.faceSearchAccess}
                    onChange={handleChange}
                    name="faceSearchAccess"
                    color="primary"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="">
            <div className="flex justify-center gap-[10rem] ">
              {form?.fullEventAccess && (
                <div className="relative">
                  <img className="w-[7rem] h-[7rem]" src={eventData?.qrCode} />
                  <h6 className="text-center">Full access</h6>
                  <p className="text-center">
                    PIN: <span>{eventData?.fullAccessPin}</span>
                  </p>
                  <p
                    className="py-2 text-xs font-bold text-center underline underline-offset-4 cursor-pointer"
                    onClick={copyFullAccessLink}
                  >
                    COPY LINK
                  </p>
                  {fullAccessLinkCopied ? (
                    <p className="text-center text-green-500 bg-black text-white absolute left-4 px-1 w-full rounded-lg">
                      Link Copied
                    </p>
                  ) : null}
                </div>
              )}
              {form?.faceSearchAccess && (
                <div className="relative">
                  <img
                    src={eventData?.faceQrCode}
                    className="w-[7rem] h-[7rem]"
                  />
                  <h6 className="text-center">Face Seacrh</h6>
                  <p className="text-center">
                    PIN: <span>{eventData?.faceSearchPin}</span>
                  </p>
                  <p
                    className="py-2 text-xs font-bold text-center underline underline-offset-4 cursor-pointer"
                    onClick={copyFaceSearchLink}
                  >
                    COPY LINK
                  </p>
                  {faceSearchLinkCopied ? (
                    <p className="text-center text-green-500 bg-black text-white absolute left-4 px-1 w-full rounded-lg">
                      Link Copied
                    </p>
                  ) : null}
                </div>
              )}
            </div>
          </div>
          {/* share with clients */}
          <div className="">
            <div className="flex gap-4">
              <h6 className="text-lg">Share with clients</h6>
              <div>
                <Switch
                  checked={form.shareWithCients}
                  onChange={handleChange}
                  name="shareWithCients"
                  color="primary"
                />
              </div>
            </div>
            {form?.shareWithCients && (
              <div className=" space-x-5">
                <input
                  type="email"
                  placeholder="Client Email"
                  className="border-[1px] border-gray-400 rounded-md px-1 py-1.5"
                  name="clientEmail"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                />
                <button
                  className="bg-gray-200 rounded-md w-[2rem] h-[2rem] tetxt-xl font-bold text-center"
                  onClick={() => {
                    addClientEmail(clientEmail);
                  }}
                >
                  +
                </button>
              </div>
            )}
          </div>
          <div className="flex justify-center ">
            <button
              className="w-[50%] text-md border-2 border-gray-300 bg-gray-300 shadow-lg rounded-xl font-bold py-2 hover:bg-gray-200 px-4"
              onClick={handleSave}
            >
              Save Settings
            </button>
          </div>
        </div>
      </section>
      {/* client email array */}
      {form?.shareWithCients && clientEmailArr.length > 0 && (
        <div className="fixed border-2 border-black bg-white bottom-2 right-0 w-[20%] px-2 rounded-md">
          <h5>Client Emails</h5>
          {clientEmailArr.map((email, idx) => (
            <p key={idx}>{email}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default FaceRecognitionGallery;
