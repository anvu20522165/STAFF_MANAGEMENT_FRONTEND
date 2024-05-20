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

import 'react-datepicker/dist/react-datepicker.css';
const Add = () => {
    const [username, setUsername] = useState(null);
    const [fullname, setFullname] = useState('');
    const [cccd, setCccd] = useState(null);
    const [email, setEmail] = useState(null);
    const [birth, setBirth] = useState(new Date());
    const [gender, setGender] = useState({ value: 'MALE', label: 'Nam' });
    const [phone, setPhone] = useState('');
    const [position, setPosition] = useState({ value: 'NHAN_VIEN', label: 'Nhân viên' });
    const [department, setDepartment] = useState({ value: 'PHONG_KY_THUAT', label: 'Phòng Kỹ Thuật' });
    const [password, setPassword] = useState('123');

    const positions = [
        { value: 'TRUONG_PHONG', label: 'Trưởng phòng' },
        { value: 'NHAN_VIEN', label: 'Nhân viên' },
    ];

    const genders = [
        { value: 'MALE', label: 'Nam' },
        { value: 'FEMALE', label: 'Nữ' },
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

    useEffect(() => {
        async function checkAuth() {
            try {
                console.log(birth);
                const accessToken = await AsyncStorage.getItem('accessToken');
                const decodedToken = jwtDecode(accessToken);
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
        console.log(birth);
        if (username != null && email != null) {
            const updatedUser = {
                username: username,
                fullname: fullname,
                password: password,
                cccd: cccd,
                email: email,
                phone: phone,
                gender: gender.value,
                birth: birth,
                position: position.value,
                department: department.value,
            };

            console.log(updatedUser);
            axios
                .post(`http://localhost:5555/v1/auth/register`, updatedUser, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                .then((response) => {
                    window.location.replace(`/users`);
                })
                .catch((error) => {
                    window.alert(error);
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
                        <h1 className="title">Tạo tài khoản cho nhân viên mới</h1>
                        <div className="item">
                            <div className="details">
                                <div className="detailItem">
                                    <div className="itemKey">Username:</div>
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
                                            placeholder="Nhập username"
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </div>
                                    <div className="itemKey">Mật khẩu:</div>
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
                                            value={password}
                                            type="text"
                                            placeholder="Nhập password"
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="detailItem">
                                    <div className="itemKey">Họ tên:</div>
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
                                            placeholder="Nhập họ tên"
                                            onChange={(e) => setFullname(e.target.value)}
                                        />
                                    </div>
                                    <div className="itemKey">CCCD:</div>
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
                                            value={cccd}
                                            type="text"
                                            placeholder="Nhập căn cước công dân"
                                            onChange={(e) => setCccd(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="detailItem">
                                    <div className="itemKey">Email:</div>
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
                                            placeholder="Nhập email"
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
                                                borderColor: '#D0D0D0',
                                                borderWidth: 2,
                                                marginTop: 5,
                                                marginLeft: 5,
                                                borderRadius: 5,
                                                fontSize: 15,
                                            }}
                                            type="text"
                                            placeholder="Nhập SĐT"
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="detailItem">
                                    <div className="itemKey">Ngày sinh (MM-DD-YYYY):</div>
                                    <div className="itemValue">
                                        {/* <DatePicker selected={birth} onChange={(date) => setBirth(date)} /> */}
                                        <DatePicker
                                            // defaultValue={birth}
                                            // selected={birth}
                                            // onChange={setBirth}
                                            // showTimeSelect
                                            // dateFormat="Pp"

                                            selected={birth}
                                            onChange={(date) => setBirth(date)}
                                            timeInputLabel="Time:"
                                            dateFormat="MM/dd/yyyy h:mm aa"
                                            showTimeInput
                                            showMonthDropdown
                                            showYearDropdown
                                            scrollableYearDropdown
                                        />
                                    </div>
                                </div>
                                <div className="detailItem">
                                    <div className="itemKey">Giới tính:</div>
                                    <div className="itemValue">
                                        <Select defaultValue={gender} onChange={setGender} options={genders} />
                                    </div>
                                </div>
                                <div className="detailItem">
                                    <div className="itemKey">Phòng ban:</div>
                                    <div className="itemValue">
                                        <Select
                                            defaultValue={department}
                                            onChange={setDepartment}
                                            options={departments}
                                        />
                                    </div>
                                </div>
                                <div className="detailItem">
                                    <div className="itemKey">Chức vụ:</div>
                                    <div className="itemValue">
                                        <Select defaultValue={position} onChange={setPosition} options={positions} />
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

export default Add;
