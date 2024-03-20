import React, { useEffect, useState } from "react";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";

import Single from "./pages/single/Single";
import NewMovie from "./pages/new/newMovie/newMovie";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { productInputs, userInputs } from "./formSource";
import "./style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import List_user from "./pages/list/list_users/List_user";



import List_order from "./pages/order/List_order";

import MakeCalendar from "./pages/calendars/makeCalendar";
import Feedback from "./pages/feedback/feedback";
import NewFeedBack from "./pages/feedback/NewFeedbacks";


export const userRows = [];
export const cinemaRows = [];

function App() {
  const { darkMode } = useContext(DarkModeContext);
  const [state, setState] = useState(1)
  // useEffect(()=>{
  //   fetch("https://uitcinema.devhungops.website/api/auth/status", {
  //     method: "GET",
  //     credentials: "include",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   })
  //     .then((res) => {
  //       if (res.ok) {
  //         setState(3)
  //       } else {
  //         setState(2)
  //       }
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //       return false;
  //     });

  // },[])
  // if(state == 1) return <></>
  // if(state == 2) return <Login />;
  // if(state == 3) 
  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            <Route path="users">
              <Route index element={<List_user />} />
              <Route path=":userId" element={<Single />} />

            </Route>



            <Route path="calendar">
              <Route index element={<MakeCalendar />} />
            </Route>

            <Route path="feedbacks">
              <Route index element={<Feedback />} />
              <Route path="new" element={<NewFeedBack />} />
            </Route>


            <Route path="login">
              <Route index element={<Login />} />


            </Route>
            <Route path="orders">
              <Route index element={<List_order />} />
              {/* <Route path=":userId" element={<Single />} /> */}
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
