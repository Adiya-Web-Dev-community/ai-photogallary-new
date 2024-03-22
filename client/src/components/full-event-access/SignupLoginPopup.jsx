import { useState } from "react";
import axios from "../../helpers/axios";
import { useParams } from "react-router-dom";

const SignupLoginPopup = ({ onClose }) => {
  const { id } = useParams();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  console.log("EVENT_ID", id);
  //handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await axios.post("/signup-login", {
        email: email,
        eventId: id,
      });
      const { success, msg, token } = resp.data;
      if (success) {
        localStorage.setItem("fav-token", token);
        onClose();
      } else {
        setError(msg);
      }
    } catch (err) {
      console.log(err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <main className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-white/80">
      <div className="w-full h-full flex justify-center items-center px-10">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-300 shadow-md rounded-lg w-[40%]  px-6 py-6 space-y-4"
        >
          <div className="flex justify-between">
            <h1 className="text-xl font-bold">LOGIN</h1>
            <p className="text-lg font-bold hover:text-xl" onClick={onClose}>
              X
            </p>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <div>
            <label>Enter your email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white w-full rounded-md py-2 px-2 shadow-lg"
            />
          </div>
          <div className="w-full flex justify-center">
            <button
              type="submit"
              className="rounded-lg bg-black text-white text-center px-4 py-2"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default SignupLoginPopup;
