import styles from './single.scss';
import Sidebar from '../../../components/sidebar/Sidebar';
import Navbar from '../../../components/navbar/Navbar';
import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import 'react-datepicker/dist/react-datepicker.css';
const SingleMultiTask = (item) => {
    const { multiTaskId } = useParams(); //lấy id từ url
    const [myDepartment, setMyDepartment] = useState('');

    const [token, setToken] = useState('');

    const [requestDepartment, setRequestDepartment] = useState();
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState('');
    const [tasks, setTasks] = useState([]);

    const departments = [
        { value: 'BAN_GIAM_DOC', label: 'Ban Giám Đốc' },
        { value: 'PHONG_NHAN_SU', label: 'Phòng Nhân Sự' },
        { value: 'PHONG_TAI_CHINH', label: 'Phòng Tài Chính' },
        { value: 'PHONG_MARKETING', label: 'Phòng Marketing' },
        { value: 'PHONG_KY_THUAT', label: 'Phòng Kỹ Thuật' },
        { value: 'PHONG_SAN_XUAT', label: 'Phòng Sản Xuất' },
        { value: 'PHONG_HANH_CHINH', label: 'Phòng Hành Chính' },
    ];
    const mapValueToLabel = (value) => {
        const department = departments.find((dept) => dept.value === value);
        return department ? department.label : '';
    };
    const fetchDetail = async () => {
        console.log(multiTaskId);
        const accessToken = await AsyncStorage.getItem('accessToken');

        axios
            .get(`http://localhost:5555/v1/multiTask/${multiTaskId}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            })
            .then((response) => {
                //Set default values
                console.log(response.data);
                setRequestDepartment(mapValueToLabel(response.data.requestid.department));
                setStatus(response.data.status);
                setTasks(response.data.tasks);
                // setCreatedAt(response.data.createdAt);
                setTitle(response.data.requestid.title);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        async function checkAuth() {
            try {
                const accessToken = await AsyncStorage.getItem('accessToken');
                setToken(accessToken);

                const decodedToken = jwtDecode(accessToken);
                setMyDepartment(decodedToken.department);
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

    const updateStatus = async (taskId) => {
        const data = {
            taskid: taskId,
        };
        axios
            .put(`http://localhost:5555/v1/multiTask/${multiTaskId}`, data, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                window.alert('Cập nhật công việc thành công');
                window.location.replace(`/multiTask/${multiTaskId}`);
            })
            .catch((error) => {
                window.alert('Cập nhật công việc thất bại');
            });
    };

    return (
        <div className="single">
            <Sidebar />
            <div className="singleContainer">
                <Navbar />
                <div className="top">
                    <div className="left">
                        <h1 className="title">Thông Tin Nhiệm Vụ Liên Đơn Vị</h1>
                        <div className="item">
                            <div className="details">
                                <div className="detailItem">
                                    <div className="itemKey">From Department:</div>
                                    <div className="itemValue" style={{ margin: 10 }}>
                                        {requestDepartment}
                                    </div>
                                    <div className="itemKey">Request:</div>
                                    <div className="itemValue" style={{ margin: 10 }}>
                                        {title}
                                    </div>

                                    <div className="itemKey">Status:</div>
                                    <div className="itemValue" style={{ margin: 10 }}>
                                        {status}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="right">
                        <h1 className="title">Các tác vụ cho phòng ban</h1>
                        <TableContainer component={Paper} className={styles.table}>
                            <Table sx={{ minWidth: 1200 }} aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={styles.tableCell + ' text-center'}>STT</TableCell>
                                        <TableCell className={styles.tableCell + ' text-center'}>Phòng Ban</TableCell>
                                        <TableCell className={styles.tableCell + ' text-center'}>Tiêu đề</TableCell>

                                        <TableCell className={styles.tableCell + ' text-center'}>Trạng Thái</TableCell>
                                        <TableCell className={styles.tableCell + ' text-center'}>Lựa Chọn</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tasks?.length > 0 &&
                                        tasks?.map((item, index) => (
                                            <TableRow
                                                key={index}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell className={styles.tableCell + ' text-center'}>
                                                    {index + 1}
                                                </TableCell>

                                                <TableCell className={styles.tableCell + ' text-center'}>
                                                    {item.department.label}
                                                </TableCell>
                                                <TableCell className={styles.tableCell + ' text-center'}>
                                                    {item.name}
                                                </TableCell>
                                                {item.status == true ? (
                                                    <TableCell
                                                        className={styles.tableCell + ' text-center'}
                                                        style={{
                                                            background: 'green',
                                                            fontSize: 15,
                                                            fontWeight: 'bold',
                                                        }}
                                                    >
                                                        Đã hoàn thành
                                                    </TableCell>
                                                ) : (
                                                    <TableCell
                                                        className={styles.tableCell + ' text-center'}
                                                        style={{
                                                            background: 'yellow',
                                                            fontSize: 15,
                                                            fontWeight: 'bold',
                                                        }}
                                                    >
                                                        Chưa hoàn thành
                                                    </TableCell>
                                                )}

                                                <TableCell className={styles.tableCell + ' text-center'}>
                                                    <div className={styles.cellAction}>
                                                        {item.status == false &&
                                                        myDepartment == item.department.value ? (
                                                            <Button
                                                                onClick={() => updateStatus(item._id)}
                                                                style={{ borderRadius: 5, background: 'green' }}
                                                            >
                                                                {' '}
                                                                Cập nhật{' '}
                                                            </Button>
                                                        ) : (
                                                            <div>Không có</div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleMultiTask;
