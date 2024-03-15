import { Outlet } from "react-router-dom";
import AppNavbar from "../components/app-navbar/AppNavbar";

const Photographer = () => {
  return (
    <div>
      <AppNavbar />
      <Outlet />
    </div>
  );
};
export default Photographer;
