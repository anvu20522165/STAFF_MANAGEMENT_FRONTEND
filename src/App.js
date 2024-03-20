import React, { useEffect, useState } from "react";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Single from "./pages/single/Single";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import List_user from "./pages/list/list_users/List_user";
import List_order from "./pages/order/List_order";
import MakeCalendar from "./pages/calendars/makeCalendar";
import Feedback from "./pages/feedback/feedback";
import NewFeedBack from "./pages/feedback/NewFeedbacks";
import Add from "./pages/users/Add/Add";
import Password from "./pages/users/Password/Password";

function App() {
  const { darkMode } = useContext(DarkModeContext);
  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            <Route path="users">
              <Route index element={<List_user />} />
              <Route path=":userId" element={<Single />} />
              <Route path="add" element={<Add />} />
              <Route path="changePassword/:userId" element={<Password />} />
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

            {/* <Route path="changePassword">
              <Route index element={<Password />} />

            </Route> */}
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
