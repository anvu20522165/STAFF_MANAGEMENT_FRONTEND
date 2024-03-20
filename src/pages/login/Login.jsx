
// export default Login;
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode"
import { useState, useEffect } from 'react';
import axios from "axios";
import "./login.css";
import { Link } from "react-router-dom";
const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  //if token is still valid then redirect to home screen
  useEffect(() => {
    async function checkAuth() {
      try {

        const accessToken = await AsyncStorage.getItem("accessToken");
        const refreshToken = await AsyncStorage.getItem("refreshToken");
        const decodedToken = jwtDecode(accessToken);
        console.log(decodedToken)
        let curTime = Date.now() / 1000;
        if (decodedToken.exp > curTime) {
          console.log("need to refresh token")

              window.location.replace("/");
        }

      } catch (error) {
        // Handle errors here
        console.log("Vừa loggout hoặc hết hạn token")
      }

    }
    checkAuth()
  }, [])

  const handleLogin = (event) => {
    event.preventDefault();
    const user = {
      username: username,
      password: password,
    }
    axios
      .post("http://localhost:5000/v1/auth/login ", user)
      .then((response) => {
        console.log(response.data);     
        const accessToken = response.data.accessToken;
        // console.log(accessToken);
        AsyncStorage.setItem("accessToken", accessToken);
        AsyncStorage.setItem("refreshToken", response.data.refreshToken);
        // AsyncStorage.setItem("isAdmin", response.data.isAdmin);
        
        window.location.replace("/");
      }
      )
      .catch((err) => {
        console.error(err);
      });
  }
  return (
    <section className="login-container">
      <div className="login-title"> Log in</div>
      <form onSubmit={handleLogin}>
        <label>USERNAME</label>
        <input
          type="text" placeholder="Enter your username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>PASSWORD</label>
        <input
          type="password" placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit"> Continue </button>
      </form>
      <div className="login-register"> Forget your password? </div>
      <Link className="login-register-link" to="/register">Click here to change </Link>
    </section>
  );
}

export default Login;