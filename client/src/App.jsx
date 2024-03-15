import "./App.css";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { store } from "./store";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
//ROUTES
import PublicRoute from "./routing/PublicRoute";
import Photographer from "./routing/Photographer";
//public routes
import RegisterUser from "./components/register-user/register-user";
import Signin from "./components/signin/Signin";
//photographer routes
import DashBoardDetails from "./components/dashboard-details/DashBoardDetails";
import EventList from "./components/all-event-list/EventList";
import EventDetailsPage from "./components/event-details-page/EventDetailsPage";
import ShareWithClient from "./components/Share-with-client/ShareWithClient";
//customer routes
import SetupWatermark from "./components/setup-watermark/SetupWatermark";
import SetPassword from "./components/register-user/set-passsword";
//public routes- full access  , face search
import FullEventForm from "./components/full-event-access/FullEventForm/FullEventForm";
import Event from "./components/full-event-access/Events/FullAccessEventPage";
import FaceSearch from "./components/face-search/FaceSearch";

function App() {
  const [auth, setAuth] = useState("");
  return (
    <Provider store={store}>
      <Toaster position="top-center" reverseOrder={false} />

      <div style={{ marginTop: "5rem" }}>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/" element={<Signin />} />
            <Route path="/register-new-user" element={<RegisterUser />} />
            {/* <Route path="/set-password" element={<SetPassword />} /> */}
          </Route>
          <Route element={<Pho tographer />}>
            <Route path="/dashboard-details" element={<DashBoardDetails />} />
            <Route path="/all-events-list" element={<EventList />} />
            <Route
              path="/event/:eventName/:eventId"
              element={<EventDetailsPage />}
            />
            <Route
              path="/share-with-client/event/:id"
              element={<ShareWithClient />}
            />
            <Route path="/display-page" element={<Signin />} />
          </Route>
          {/* 
          <Route path="/gallary/:id" element={<Gallary />} />
          <Route path="/watermaker-setup" element={<SetupWatermark />} />
         
          <Route
            path="/full-event-access/:eventId"
            element={<FullEventForm />}
          />
          <Route path="/show-event-data/:eventId" element={<Event />} />
      
          <Route
            path="/face-search/event/:eventId"
            element={<EventAccessForm />}
          /> */}
        </Routes>
      </div>
    </Provider>
  );
}

export default App;
