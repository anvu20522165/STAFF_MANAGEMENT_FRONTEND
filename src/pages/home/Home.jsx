import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
import Widget from "../../components/widget/Widget";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";
import Table from "../../components/table/Table";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"
const Home = () => {

  //if token is still valid then redirect to login screen
  useEffect(() => {
    async function checkAuth() {
      try {

        const accessToken = await AsyncStorage.getItem("accessToken");
        const refreshToken = await AsyncStorage.getItem("refreshToken");
        const decodedToken = jwtDecode(accessToken);
        console.log(decodedToken)
        let curTime = Date.now() / 1000;
        if (decodedToken.exp < curTime) {
          console.log("need to refresh token")
          // axios
          //   .post("http://localhost:5555/v1/auth/refresh", { refreshToken })
          //   .then((response) => {
          //     console.log(refreshToken);
          //     console.log(response.data.refreshToken);
          //     //delete old ones
          //     AsyncStorage.removeItem("accessToken")
          //     AsyncStorage.removeItem("refreshToken")
          //     //create new ones
          //      AsyncStorage.setItem("accessToken", response.data.accessToken);
          //      AsyncStorage.setItem("refreshToken", response.data.accessToken);

          //   }
          //   )
          //   .catch((err) => {

          //   });               
              // //window.location.replace("/error");
              window.location.replace("/login");
        }

      } catch (error) {
        // Handle errors here
        console.log("lỗi cmnr")
      }

    }
    checkAuth()
  }, [])

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="widgets">
          <Widget type="user" />
          <Widget type="requests" />


        </div>
        <div className="charts">
          <Featured />
          <Chart title="Lịch cá nhân" aspect={2 / 1} />
        </div>

      </div>
    </div>
  );
};

export default Home;
