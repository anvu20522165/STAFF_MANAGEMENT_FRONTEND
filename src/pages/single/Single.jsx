import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import List from "../../components/table/Table";
import { jwtDecode } from "jwt-decode"
import { useState, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

const Single = () => {
  const { userId } = useParams(); //lấy id từ url
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [avt, setAvt] = useState("")
  const navigate = useNavigate();
  const [token, setToken] = useState("")



  const fetchDetail = async () => {
    console.log(userId)
    axios
      .get(`http://localhost:5000/v1/user/${userId}`,)
      .then((response) => {
        //Set default values
        setUsername(response.data.username)
        setEmail(response.data.email)
        setAvt(response.data.avt)
        console.log("my user:", response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    async function checkAuth() {
      try {
        const accessToken = await AsyncStorage.getItem("accessToken");
        setToken(accessToken)
        const decodedToken = jwtDecode(accessToken);
        let curTime = Date.now() / 1000;
        if (decodedToken.exp < curTime) {
          window.location.replace("/login");
        }

      } catch (error) {
        console.log("lỗi cmnr")
      }
    }
    checkAuth()
    fetchDetail()
  }, [])

  const updateUser = async (userId, token) => {
    const updatedUser = {
      username: username,
      email: email,
      avt: avt,
    }
    axios
      .put(`http://localhost:5000/v1/user/${userId}`, updatedUser, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        window.location.replace(`/users/${userId}`);
      })
      .catch((error) => {
        window.alert(
          "You don't have the permission to fulfill this action"
      );
      });

  };

  function updatePassword(id, token) {
    console.log(token)
    
    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken._id == userId || decodedToken.isAdmin == true) {
        navigate(`/users/changePassword/${id}`);
      }
      else {
        window.alert(
          "Only admin or this user can change the password!"
      );
      }
      
    } catch (error) {
          console.log(error)
    }
  }

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <Button className="editButton" onClick={() => updatePassword(userId, token)}>Đổi mật khẩu</Button>
            <h1 className="title">Thông Tin Cá Nhân</h1>
            <div className="item">
              <img
                src={avt}
                alt=""
                className="itemImg"
              />
              <div className="details">
                <div className="detailItem">
                  <div className="itemKey">Tên:</div>
                  <div className="itemValue">
                    <input
                      style={{
                        padding: 10,
                        borderColor: "#D0D0D0",
                        borderWidth: 2,
                        marginTop: 5,
                        marginLeft: 5,
                        borderRadius: 5,
                        fontSize: 15
                      }}
                      value={username}
                      type="text" placeholder="Enter your username"
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>
                <div className="detailItem">
                  <div className="itemKey">Email:</div>
                  <div className="itemValue">
                    <input
                      style={{
                        padding: 10,
                        borderColor: "#D0D0D0",
                        borderWidth: 2,
                        marginTop: 5,
                        marginLeft: 5,
                        borderRadius: 5,
                        fontSize: 15
                      }}
                      value={email}
                      type="text" placeholder="Enter your email"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="detailItem">
                  <div className="itemKey">Ảnh:</div>
                  <div className="itemValue">
                    <input
                      style={{
                        padding: 10,
                        borderColor: "#D0D0D0",
                        borderWidth: 2,
                        marginTop: 5,
                        marginLeft: 5,
                        borderRadius: 5,
                        fontSize: 15
                      }}
                      value={avt}
                      type="text" placeholder="Enter your img url"
                      onChange={(e) => setAvt(e.target.value)}
                    />
                  </div>
                </div>
                <Button onClick={() => updateUser(userId, token)} style={{ borderRadius: 5, background: "green" }}> Cập nhật </Button>
              </div>
            </div>
          </div>
          <div className="right">
          <h1 className="title">Thông Báo Cá Nhân</h1>
          </div>
        </div>
        <div className="bottom">
          <h1 className="title">Lịch làm việc</h1>
          <List />
        </div>
      </div>
    </div>
  );
};

export default Single;
