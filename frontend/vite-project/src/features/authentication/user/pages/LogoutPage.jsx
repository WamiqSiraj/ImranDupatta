import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../authSlice";
import { useNavigate } from "react-router-dom";

const LogoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Logout user
    dispatch(logout());

    // Redirect to login page
    navigate("/user/login");
  }, [dispatch, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <h2 className="text-xl font-semibold">Logging out...</h2>
    </div>
  );
};

export default LogoutPage;