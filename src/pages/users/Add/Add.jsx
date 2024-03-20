import "./Add.scss";
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import { jwtDecode } from "jwt-decode"
import { useState, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import Button from 'react-bootstrap/Button';

const Add = () => {
  const [username, setUsername] = useState(null)
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState("123")


  useEffect(() => {
    async function checkAuth() {
      try {

        const accessToken = await AsyncStorage.getItem("accessToken");
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
  }, [])

  const create = async () => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    if (username != null && email!=null) {
      const updatedUser = {
        username: username,
        email: email,
        password: password,
      }
      axios
        .post(`http://localhost:5000/v1/auth/register`, updatedUser, { headers: { Authorization: `Bearer ${accessToken}` } })
        .then((response) => {
          window.location.replace(`/users`);
        })
        .catch((error) => {
          window.alert(
            error.response.data
        );
        });
    }
    else {
      window.alert(
        "Username and Email shouldn't be empty!"
    );
    }
  };


  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <h1 className="title">Tạo tài khoản cho nhân viên mới</h1>
            <div className="item">
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
                      type="text" placeholder="Enter your username"
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="itemKey">Mật khẩu:</div>
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
                      value={password}
                      type="text" placeholder="Enter your password"
                      onChange={(e) => setPassword(e.target.value)}
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
                      type="text" placeholder="Enter your email"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="detailItem">
                  <div className="itemKey">SĐT:</div>
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
                      type="text" placeholder="Enter your phone"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="detailItem">
                  <div className="itemKey">Ngày sinh:</div>
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
                      type="text" placeholder="Enter your birth"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <Button onClick={() => create()} style={{ borderRadius: 5, background: "green" }}> Thêm </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Add;
