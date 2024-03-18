import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "../../helpers/axios";
import Display from "../../components/display/display";

import "./FaceSearch.css";

const FaceSearch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({});

  //fetch event details
  const fetchEventDetails = async (id) => {
    try {
      const resp = await axios.get(`/event/${id}`);
      console.log(resp.data.data);
      setData(resp.data.data);
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  };

  useEffect(() => {
    fetchEventDetails(id);
  }, [id]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    pin: "",
  });
  const [imageData, setImageData] = useState(null);
  const [showForm, setShowForm] = useState(true);
  const [step, setStep] = useState(1);
  const [videoStream, setVideoStream] = useState(null);

  const handleInputs = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedFormData = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      pin: formData.pin,
    };

    axios
      .post(`/event/request/${id}`, formattedFormData)
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          toast.success(res.data.message);
          setShowForm(false);
          setStep(2);
        } else {
          toast.error(res.message);
        }
      })
      .catch((error) => {
        toast.error("PIN Required");
      });
  };

  const captureImage = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        setVideoStream(stream);
      })
      .catch((error) => {
        console.error("Error accessing camera:", error);
      });
  };

  const handleCaptureImageData = () => {
    const video = document.getElementById("video");
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL("image/png");
    setImageData(dataURL);

    // Stop the video stream
    if (videoStream) {
      videoStream.getTracks().forEach((track) => {
        track.stop();
      });
      setVideoStream(null); // Clearing the video stream
    }
  };

  const handleFaceCapture = () => {
    if (imageData && formData.email) {
      const requestData = {
        email: formData.email,
        faceData: imageData,
      };
      axios.put(`/event/request/${id}`, requestData);
    } else {
      console.error("No image data captured yet.");
    }
  };

  useEffect(() => {
    if (step === 2 && showForm === false) {
      captureImage();
    }
  }, [step, showForm]);

  if (!data?.faceSearchAccess) {
    return <Display event={data} />;
  }

  return (
    <div className="flex gap-[10rem] ">
      {step === 1 && (
        <div>
          <Display event={data} />
        </div>
      )}

      <div className="">
        <div>
          <div className="px-12 py-6">
            <p className="text-xl font-bold">Event Access Form</p>
            <h2 className="text-xl font-bold underline">{data.eventName}</h2>
          </div>
        </div>
        <div className="form-content shadow">
          {showForm && (
            <form onSubmit={handleSubmit}>
              <section className="">
                <div className="">
                  First Name
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputs}
                    name="firstName"
                    placeholder="First Name"
                    required
                  />
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputs}
                    name="lastName"
                    placeholder="Last Name"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={handleInputs}
                    name="email"
                    placeholder="Email address"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Phone No"
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                    }}
                    value={formData.phone}
                    onChange={handleInputs}
                    name="phone"
                    className="text-black"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="PIN"
                    value={formData.pin}
                    onChange={handleInputs}
                    name="pin"
                    className="text-black"
                    required
                  />
                </div>
                <div>
                  <button type="submit">Find My Image</button>
                </div>
              </section>
            </form>
          )}
          {step === 2 && !showForm && (
            <div>
              {videoStream && (
                <div className="video-container">
                  <video
                    id="video"
                    autoPlay
                    ref={(video) => {
                      if (videoStream && video) {
                        video.srcObject = videoStream;
                      }
                    }}
                  ></video>
                </div>
              )}
              {imageData && (
                <div className="image-container">
                  <img src={imageData} alt="Captured" />
                </div>
              )}
              <div className="button-container">
                <button type="button" onClick={handleCaptureImageData}>
                  Capture Image
                </button>
                <button type="button" onClick={handleFaceCapture}>
                  Send Face Data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FaceSearch;
