import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import FeedbackIcon from "@mui/icons-material/Feedback";
import { Link } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext } from "react";

const Sidebar = () => {
  const { dispatch } = useContext(DarkModeContext);

  
  
  const logout = async () => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    console.log(accessToken)
    const data = "logout"
    // code to logout the user and clear user data from state
    axios
      .post('http://localhost:5000/v1/auth/logout', data, {headers: {Authorization: `Bearer ${accessToken}`}})
      .then((response) => {
        window.location.replace("/login");
        AsyncStorage.removeItem("accessToken")
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">Quản lý nhân viên</span>
        </Link>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">Trang Chủ</p>
          <li>
            <Link to="/" style={{ textDecoration: "none" }}>
              <DashboardIcon className="icon" />
              <span>Dashboard</span>
            </Link>
          </li>
          <p className="title">Danh Sách</p>
          <Link to="/users" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineIcon className="icon" />
              <span>Nhân viên</span>
            </li>
          </Link>
          
          <p className="title">Phân Tích</p>
       
          <Link to="/feedbacks" style={{ textDecoration: "none" }}>
            <li>
              <FeedbackIcon className="icon" />
              <span>Feedback</span>
            </li>
          </Link>

          <p className="title">Lựa Chọn</p>

          <li>
            <ExitToAppIcon className="icon" />
            <span onClick={logout}>Logout</span>
          </li>
        </ul>
      </div>
      <div className="bottom">
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "LIGHT" })}
        ></div>
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "DARK" })}
        ></div>
      </div>
    </div>
  );
};

export default Sidebar;
