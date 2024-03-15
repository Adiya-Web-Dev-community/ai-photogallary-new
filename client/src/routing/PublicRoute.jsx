import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";

const PublicRoute = () => {
  const { token } = useSelector((store) => store.app);

  return <div>{!token ? <Outlet /> : <Navigate to="/all-events-list" />}</div>;
};
export default PublicRoute;
