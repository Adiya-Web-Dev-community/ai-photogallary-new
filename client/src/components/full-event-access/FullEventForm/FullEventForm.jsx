import { useEffect, useState } from "react";
import "./FullEventForm.css";
import axios from "../../../helpers/axios";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Display from "../../display/display";

const FullEventForm = () => {
  const { id } = useParams();
  const [eventData, setEventData] = useState(null);
  const [pin, setPin] = useState("");
  const navigate = useNavigate();

  //fetch event details
  const fetchEventDetails = async (id) => {
    try {
      const resp = await axios.get(`/event/${id}`);
      console.log("data", resp.data.data);
      setEventData(resp.data.data);
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  };

  const validatePin = async (e) => {
    e.preventDefault();
    console.log();
    try {
      const response = await axios.post(
        `/${eventData.eventName}/event-access/${id}`,
        pin
      );
      if (response.data.success) {
        // If PIN is valid, navigate to the show event data page
        navigate(`/show-event-data/${id}`);
      }
    } catch (error) {
      toast.error("Invalid PIN. Please try again.");
    }
  };

  useEffect(() => {
    fetchEventDetails(id);
  }, [id]);

  if (!eventData?.fullEventAccess) {
    return <Display event={eventData} />;
  }

  return (
    <div className="event-access-container">
      <h1
        style={{
          fontSize: "1.5rem",
          marginTop: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        {eventData?.eventName}
      </h1>
      <form className="event-form" onSubmit={validatePin}>
        <div>
          <p>Please enter PIN to access this event.</p>
          <p>You can access images and videos for this event.</p>
        </div>
        <div className="input-container">
          <input
            type="text"
            placeholder="Enter Pin"
            name="pin"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="pin-input"
          />
          <button type="submit" className="submit-button">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default FullEventForm;
