import './Add.scss';
import Sidebar from '../../../components/sidebar/Sidebar';
import Navbar from '../../../components/navbar/Navbar';
import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';

import 'react-datepicker/dist/react-datepicker.css';
const AddRequest = () => {
    const [title, setTitle] = useState('');
    const [fullname, setFullname] = useState('');

    const [date, setDate] = useState(new Date());
    const [createdAt, setCreatedAt] = useState();
    const [department, setDepartment] = useState({ value: 'PHONG_KY_THUAT', label: 'Phòng Kỹ Thuật' });
    const [gender, setGender] = useState({ value: 'MALE', label: 'Nam' });
    const [phone, setPhone] = useState('');
    const [position, setPosition] = useState({ value: 'NHAN_VIEN', label: 'Nhân viên' });
    const [password, setPassword] = useState('123');

    const positions = [
        { value: 'TRUONG_PHONG', label: 'Trưởng phòng' },
        { value: 'NHAN_VIEN', label: 'Nhân viên' },
    ];

    const departments = [
        { value: 'BAN_GIAM_DOC', label: 'Ban Giám Đốc' },
        { value: 'PHONG_NHAN_SU', label: 'Phòng Nhân Sự' },
        { value: 'PHONG_TAI_CHINH', label: 'Phòng Tài Chính' },
        { value: 'PHONG_MARKETING', label: 'Phòng Marketing' },
        { value: 'PHONG_KY_THUAT', label: 'Phòng Kỹ Thuật' },
        { value: 'PHONG_SAN_XUAT', label: 'Phòng Sản Xuất' },
        { value: 'PHONG_HANH_CHINH', label: 'Phòng Hành Chính' },
    ];

    // const fetchDetail = async () => {
    //     const accessToken = await AsyncStorage.getItem('accessToken');
    //     console.log(requestId);
    //     axios
    //         .get(`http://localhost:5555/v1/request/${requestId}`, {
    //             headers: { Authorization: `Bearer ${accessToken}` },
    //         })
    //         .then((response) => {
    //             console.log(response.data);
    //             //Set default values
    //             setTitle(response.data.title);
    //             setCreatedAt(response.data.createdAt);
    //             let dataDepartment = departments.find((i) => i.value == response.data.department);
    //             setDepartment(dataDepartment.label);
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // };

    useEffect(() => {
        async function checkAuth() {
            try {
                const accessToken = await AsyncStorage.getItem('accessToken');
                const decodedToken = jwtDecode(accessToken);
                console.log(decodedToken);
                let dataDepartment = departments.find((i) => i.value == decodedToken.department);
                setDepartment(dataDepartment.label);
                let dataPosition = positions.find((i) => i.value == decodedToken.position);
                setPosition(dataPosition.label);
                setFullname(decodedToken.fullname);
                let curTime = Date.now() / 1000;
                if (decodedToken.exp < curTime) {
                    window.location.replace('/login');
                }
            } catch (error) {
                console.log('lỗi cmnr');
            }
        }
        checkAuth();
    }, []);

    const create = async () => {
        const accessToken = await AsyncStorage.getItem('accessToken');
        if (1 != 0) {
            const decodedToken = jwtDecode(accessToken);
            const newRequest = {
                userid: decodedToken.id,
                title: title,
                department: decodedToken.department,
            };

            console.log(newRequest);
            axios
                .post(`http://localhost:5555/v1/request/`, newRequest, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                .then((response) => {
                    window.location.replace(`/requests`);
                })
                .catch((error) => {
                    window.alert(error.response.data);
                });
        } else {
            window.alert("Username and Email shouldn't be empty!");
        }
    };

    return (
        <div className="single">
            <Sidebar />
            <div className="singleContainer">
                <Navbar />
                <div className="top">
                    <div className="left">
                        <h1 className="title">Tạo yêu cầu liên đơn vị</h1>
                        <div className="item">
                            <div className="details">
                                <div className="detailItem">
                                    <div className="itemKey">Title:</div>
                                    <div className="itemValue">
                                        <input
                                            style={{
                                                padding: 10,
                                                borderColor: '#D0D0D0',
                                                borderWidth: 2,
                                                marginTop: 5,
                                                marginLeft: 5,
                                                borderRadius: 5,
                                                fontSize: 15,
                                            }}
                                            type="text"
                                            placeholder="Enter your title"
                                            onChange={(e) => setTitle(e.target.value)}
                                        />
                                    </div>
                                    <div className="itemKey">Ngày Tạo:</div>
                                    <div
                                        className="itemValue"
                                        style={{
                                            padding: 10,
                                            borderColor: '#D0D0D0',
                                            borderWidth: 2,
                                            marginTop: 5,
                                            marginLeft: 5,
                                            borderRadius: 5,
                                            fontSize: 15,
                                        }}
                                    >
                                        <input value={date} type="text" />
                                    </div>
                                </div>
                                <div className="detailItem">
                                    <div className="itemKey">Người tạo:</div>
                                    <div
                                        className="itemValue"
                                        style={{
                                            padding: 10,
                                            borderColor: '#D0D0D0',
                                            borderWidth: 2,
                                            marginTop: 5,
                                            marginLeft: 5,
                                            borderRadius: 5,
                                            fontSize: 15,
                                        }}
                                    >
                                        {fullname + ' - ' + department + ' - ' + position}
                                    </div>
                                </div>

                                <Button onClick={() => create()} style={{ borderRadius: 5, background: 'green' }}>
                                    {' '}
                                    Thêm{' '}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddRequest;
