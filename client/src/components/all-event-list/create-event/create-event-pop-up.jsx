import { useNavigate } from "react-router-dom";
import "./create-event-pop-up.css";
import { RxCross1 } from "react-icons/rx";
import { useEffect, useState } from "react";
import axios from "../../../helpers/axios";
import { toast } from "react-hot-toast";
import TextField from "@mui/material/TextField";

const CreateEventPopup = ({ handleClose, getAllEvents }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [createEventForm, setCreateEventForm] = useState({
    eventName: "",
    eventDate: "",
  });

  //set inputs
  const handleInuts = (e) => {
    setCreateEventForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const [imageByteCode, setImageByteCode] = useState("");
  const handleUploadImage = async (event) => {
    const selectedFile = event.target.files[0];
    // Read the image file as a data URL
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);

    reader.onload = () => {
      const imageDataUrl = reader.result;
      setImageByteCode(imageDataUrl);
    };

    reader.onerror = (error) => {
      alert(error);
    };
  };

  //handle final submit data
  const handleSubmit = async () => {
    if (!imageByteCode) {
      toast.error("Please upload cover image");
    }
    toast.loading("Uplaoding Image..");
    try {
      const resp = await axios.post(
        "/event",
        { ...createEventForm, coverImage: imageByteCode },
        {
          headers: {
            authorization: token,
          },
        }
      );
      if (resp.data.success) {
        toast.dismiss();
        toast.success("Event created successfully");
        handleClose();
        getAllEvents();
        return;
      }
      toast.dismiss();
    } catch (err) {
      toast.dismiss();
      console.log(err);
    }
    toast.dismiss();
  };

  return (
    <div className="create-event-pop-up-container">
      <div className="create-event-pop-up-header">
        <h4 className="py-2 font-bold">Create Event</h4>
        <h4 onClick={handleClose}>
          <RxCross1 />
        </h4>
      </div>
      <div className="py-3">
        <TextField
          size="small"
          fullWidth
          type="text"
          name="eventName"
          value={createEventForm.eventName}
          onChange={handleInuts}
        />
        <TextField
          sx={{
            margin: "10px 0px",
          }}
          size="small"
          fullWidth
          type="date"
          name="eventDate"
          value={createEventForm.eventDate}
          onChange={handleInuts}
        />
      </div>
      <div>
        <h4 className="py-1.5 font-bold">Upload cover image</h4>
        <input
          type="file"
          className="py-1"
          onChange={(e) => handleUploadImage(e)}
        />
      </div>
      {imageByteCode ? (
        <div className="pt-3 w-full h-[17rem]">
          <img src={imageByteCode} className="w-full h-full" />
        </div>
      ) : null}
      <div className="create-event-pop-up-save-btn-container">
        <button
          onClick={handleSubmit}
          className="disabled:cursor-not-allowed"
          disabled={!createEventForm.eventName || !createEventForm.eventDate}
        >
          save
        </button>
      </div>
    </div>
  );
};

export default CreateEventPopup;
