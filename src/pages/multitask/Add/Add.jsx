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
const AddTask = () => {
    const { requestId } = useParams(); //lấy id từ url
    const [title, setTitle] = useState('');
    const [createdAt, setCreatedAt] = useState();
    const [inputDepartment, setInputDepartment] = useState([{ value: 'PHONG_KY_THUAT', label: 'Phòng Kỹ Thuật' }]);

    const [duplicateDepartment, setDuplicateDepartment] = useState(null);

    const departments = [
        { value: 'BAN_QUAN_LY', label: 'Ban Quản lý' },
        { value: 'BAN_GIAM_DOC', label: 'Ban Giám Đốc' },
        { value: 'PHONG_NHAN_SU', label: 'Phòng Nhân Sự' },
        { value: 'PHONG_TAI_CHINH', label: 'Phòng Tài Chính' },
        { value: 'PHONG_MARKETING', label: 'Phòng Marketing' },
        { value: 'PHONG_KY_THUAT', label: 'Phòng Kỹ Thuật' },
        { value: 'PHONG_SAN_XUAT', label: 'Phòng Sản Xuất' },
        { value: 'PHONG_HANH_CHINH', label: 'Phòng Hành Chính' },
    ];

    const fetchDetail = async () => {
        const accessToken = await AsyncStorage.getItem('accessToken');
        console.log(requestId);
        axios
            .get(`http://localhost:5555/v1/request/${requestId}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            })
            .then((response) => {
                console.log(response.data);
                //Set default values
                setTitle(response.data.title);
                setCreatedAt(response.data.createdAt);
                let dataDepartment = departments.find((i) => i.value == response.data.department);
                setInputDepartment(dataDepartment.label);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        async function checkAuth() {
            try {
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
        fetchDetail();
    }, []);

    const create = async () => {
        const accessToken = await AsyncStorage.getItem('accessToken');
        if (1 != 0) {
            const newMultitask = {
                requestid: requestId,
                tasks: data,
            };

            console.log(newMultitask);
            axios
                .post(`http://localhost:5555/v1/multiTask`, newMultitask, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                .then((response) => {
                    window.location.replace(`/requests`);
                })
                .catch((error) => {
                    window.alert(error.response.data);
                });
        } else {
            window.alert("Multitasks shouldn't be empty!");
        }
    };

    const [data, setData] = useState([{ name: '', department: null }]);
    const handleClick = () => {
        setData([...data, { name: '', department: null }]);
    };
    const handleChange = (e, i) => {
        const { name, value } = e.target;
        const newData = [...data];
        newData[i][name] = value;
        setData(newData);
    };

    const handleDepartmentChange = (selectedOption, index) => {
        const newData = [...data];
        newData[index]['department'] = selectedOption;
        setData(newData);
    };

    const handleDelete = (i) => {
        const deleteVal = [...data];
        deleteVal.splice(i, 1);
        setData(deleteVal);
    };

    console.log(data);
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
                                            value={title}
                                        />
                                    </div>
                                    <div className="itemKey">Ngày Tạo:</div>
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
                                            value={createdAt}
                                            type="text"
                                        />
                                    </div>
                                </div>
                                <div className="detailItem">
                                    <div className="itemKey">Phòng Ban:</div>
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
                                            value={inputDepartment}
                                        />
                                    </div>
                                </div>
                                <div className="itemKey">Tạo các tác vụ liên đơn vị:</div>
                                <button onClick={handleClick}>Add</button>
                                {data.map((val, i) => (
                                    <div>
                                        <Select
                                            defaultValue={duplicateDepartment}
                                            onChange={(option) => handleDepartmentChange(option, i)}
                                            options={departments}
                                            name="department"
                                            value={val.department}
                                        />

                                        <div>
                                            <input name="name" value={val.name} onChange={(e) => handleChange(e, i)} />
                                        </div>

                                        <button onClick={() => handleDelete(i)}>Delete</button>
                                    </div>
                                ))}
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

export default AddTask;
