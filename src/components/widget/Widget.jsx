import './widget.scss';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import TheatersIcon from '@mui/icons-material/Theaters';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from 'react-router-dom';

const Widget = ({ type }) => {
    let data;

    //userNumber
    const [userNumber, setUserNumber] = useState([]);
    const [requestNumber, setRequestNumber] = useState([]);
    const loadUserNumber = async () => {
        const accessToken = await AsyncStorage.getItem('accessToken');
        console.log(accessToken);
        axios
            .get('http://localhost:5555/v1/user/users', { headers: { Authorization: `Bearer ${accessToken}` } })
            .then((response) => {
                setUserNumber(response.data.length);
                console.log('all users:', response.data.length);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const loadRequestNumber = async () => {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const decodedToken = jwtDecode(accessToken);

        let url = `http://localhost:5555/v1/request/?`;
        //check department
        // const url = buildSearchURL();
        url = url + `department=${decodedToken.department}`;
        url = url + `&userid=${decodedToken.id}`;
        console.log(url);
        axios
            .get(url, { headers: { Authorization: `Bearer ${accessToken}` } })
            .then((response) => {
                console.log(response.data.length);
                setRequestNumber(response.data.length);
            })
            .catch((error) => {
                console.log(error);
            });
        //}
    };

    useEffect(() => {
        loadUserNumber();
        loadRequestNumber();
    }, []);
    switch (type) {
        case 'user':
            data = {
                title: 'Người dùng',
                isMoney: false,
                link: 'Xem người dùng',
                directLink: '/users',
                value: userNumber,
                icon: (
                    <PersonOutlinedIcon
                        className="icon"
                        style={{
                            color: 'crimson',
                            backgroundColor: 'rgba(255, 0, 0, 0.2)',
                        }}
                    />
                ),
            };
            break;
        case 'requests':
            data = {
                title: 'Yêu cầu',
                isMoney: false,
                link: 'Xem các yêu cầu',
                directLink: '/orders',
                value: requestNumber,
                icon: (
                    <ShoppingCartOutlinedIcon
                        className="icon"
                        style={{
                            backgroundColor: 'rgba(218, 165, 32, 0.2)',
                            color: 'goldenrod',
                        }}
                    />
                ),
            };
            break;
        // case "earning":
        //   data = {
        //     title: "Doanh thu",
        //     isMoney: true,
        //     link: "Kiểm tra",
        //     directLink: "/orders",
        //     value: earning.TotalAllTime?.toLocaleString('vi', {style : 'currency', currency : 'VND'}),
        //     icon: (
        //       <MonetizationOnOutlinedIcon
        //         className="icon"
        //         style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
        //       />
        //     ),
        //   };
        //   break;
        // case "cinema":
        //   data = {
        //     title: "Rạp chiếu",
        //     isMoney: false,
        //     link: "Xem các rạp",
        //     directLink: "/cinemas",
        //     value: cinemaNumber.CountCinema,
        //     icon: (
        //       <TheatersIcon
        //         className="icon"
        //         style={{
        //           backgroundColor: "rgba(128, 0, 128, 0.2)",
        //           color: "purple",
        //         }}
        //       />
        //     ),
        //   };
        // break;
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
                <Link to={`${data.directLink}`}>
                    <span>{data.link}</span>{' '}
                </Link>
            </div>
            <div className="right">{data.icon}</div>
        </div>
    );
};

export default Widget;
