import "./widget.scss";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import TheatersIcon from '@mui/icons-material/Theaters';
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
const Widget = ({ type }) => {
  
  let data;

//userNumber
  const [userNumber, setUserNumber] = useState([]);
  const loadUserNumber = async () => {
    axios
      .get("https://uitcinema.devhungops.website/api/statistics/countUser")
      .then((response) => {
        setUserNumber(response.data);
        //console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

//orders
const [orderNumber, setOrderNumber] = useState([]);
const loadUsOrderNumber = async () => {
  axios
    .get("https://uitcinema.devhungops.website/api/statistics/getCountTicket")
    .then((response) => {
      setOrderNumber(response.data);
      //console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

//cinemaNumbers
const [cinemaNumber, setCinemaNumber] = useState([]);
const loadCinemaNumber = async () => {
  axios
    .get("https://uitcinema.devhungops.website/api/statistics/getCountCinema")
    .then((response) => {
      setCinemaNumber(response.data);
      //console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};
//earning 
const [earning, setEarning] = useState([]);
const loadEarning = async () => {
  axios
    .get("https://uitcinema.devhungops.website/api/statistics/getTotalAllTime")
    .then((response) => {
      setEarning(response.data);
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

  useEffect(() => {
    loadUserNumber();
    loadCinemaNumber();
    loadUsOrderNumber();
    loadEarning();
    
  }, []);
  switch (type) {
    case "user":
      data = {
        title: "Người dùng",
        isMoney: false,
        link: "Xem người dùng",
        directLink: "/users",
        value: userNumber.CountUser,
        icon: (
          <PersonOutlinedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "order":
      data = {
        title: "Đặt vé",
        isMoney: false,
        link: "Xem các vé",
        directLink: "/orders",
        value: orderNumber.CountTicket,
        icon: (
          <ShoppingCartOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(218, 165, 32, 0.2)",
              color: "goldenrod",
            }}
          />
        ),
      };
      break;
    case "earning":
      data = {
        title: "Doanh thu",
        isMoney: true,
        link: "Kiểm tra",
        directLink: "/orders",
        value: earning.TotalAllTime?.toLocaleString('vi', {style : 'currency', currency : 'VND'}),
        icon: (
          <MonetizationOnOutlinedIcon
            className="icon"
            style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
          />
        ),
      };
      break;
    case "cinema":
      data = {
        title: "Rạp chiếu",
        isMoney: false,
        link: "Xem các rạp",
        directLink: "/cinemas",
        value: cinemaNumber.CountCinema,
        icon: (
          <TheatersIcon
            className="icon"
            style={{
              backgroundColor: "rgba(128, 0, 128, 0.2)",
              color: "purple",
            }}
          />
        ),
      };
      break;
    default:
      break;
  }

  return (
    
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
          {data.isMoney} {data.value}
        </span>
        <Link to={`${data.directLink}`}><span>{data.link}</span> </Link>
        
      </div>
      <div className="right">
        {data.icon}
      </div>
    </div>
   
  );
};

export default Widget;
