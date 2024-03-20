import axios from "../../helpers/axios";

const SignupLoginPopup = () => {
  const [email, setEmail] = useState("");

  //handle submit
  const handleSubmit = async () => {
    try {
      const resp = await axios.post("/signup-login", email);
      //close modal store token in local storage
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main className="w-scree h-screen flex justify-center items-center bg-black/50">
      <div className="w-full h-full flex justify-cenetr items-center">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-500 shadow-md rounded-lg"
        >
          <div className="flex justify-between">
            <h1 className="text-xl font-bold">LOGIN</h1>
            <p className="text-lg font-bold hover:text-xl">X</p>
          </div>
          <div>
            <label>Enter your email *</label>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white w-full rounded-md py-1 px-2 shadow-lg"
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
