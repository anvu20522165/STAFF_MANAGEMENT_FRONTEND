import './sidebar.scss';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HardwareIcon from '@mui/icons-material/Hardware';
import DescriptionIcon from '@mui/icons-material/Description';
import NotificationsIcon from '@mui/icons-material/Notifications';
import RequestPageIcon from '@mui/icons-material/RequestPage';
import DifferenceIcon from '@mui/icons-material/Difference';
import MediationIcon from '@mui/icons-material/Mediation';
import PhoneEnabledIcon from '@mui/icons-material/PhoneEnabled';
import { Link } from 'react-router-dom';
import { DarkModeContext } from '../../context/darkModeContext';
import { useContext } from 'react';
const Sidebar = () => {
    const { dispatch } = useContext(DarkModeContext);

    const logout = async () => {
        const accessToken = await AsyncStorage.getItem('accessToken');
        console.log(accessToken);
        const data = 'logout';
        axios
            .post('http://localhost:5555/v1/auth/logout', data, { headers: { Authorization: `Bearer ${accessToken}` } })
            .then((response) => {
                window.location.replace('/login');
                AsyncStorage.removeItem('accessToken');
            })
            .catch((error) => {
                console.log(error);
            });
    };
    return (
        <div className="sidebar">
            <div className="top">
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <span className="logo">Quản lý nhân viên</span>
                </Link>
            </div>
            <hr />
            <div className="center">
                <ul>
                    <p className="title">Trang Chủ</p>
                    <li>
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <DashboardIcon className="icon" />
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    <p className="title">Trang Quản Trị</p>
                    <li>
                        <Link to="/notice" style={{ textDecoration: 'none' }}>
                            <NotificationsIcon className="icon" />
                            <span>Thông báo</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/announcement" style={{ textDecoration: 'none' }}>
                            <AssignmentIcon className="icon" />
                            <span>Lịch biểu</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/document" style={{ textDecoration: 'none' }}>
                            <DescriptionIcon className="icon" />
                            <span>Tài liệu</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/hardware" style={{ textDecoration: 'none' }}>
                            <HardwareIcon className="icon" />
                            <span>Tài nguyên phần cứng</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/requests" style={{ textDecoration: 'none' }}>
                            <RequestPageIcon className="icon" />
                            <span>Yêu cầu</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/multiTask" style={{ textDecoration: 'none' }}>
                            <DifferenceIcon className="icon" />
                            <span>Công việc liên đơn vị</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="/structure" style={{ textDecoration: 'none' }}>
                            <MediationIcon className="icon" />
                            <span>Cơ cấu</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/contact" style={{ textDecoration: 'none' }}>
                            <PhoneEnabledIcon className="icon" />
                            <span>Liên hệ</span>
                        </Link>
                    </li>

                    <p className="title">Danh Sách</p>
                    <Link to="/users" style={{ textDecoration: 'none' }}>
                        <li>
                            <PersonOutlineIcon className="icon" />
                            <span>Nhân viên</span>
                        </li>
                    </Link>

                    <p className="title">Lựa Chọn</p>

                    <li>
                        <ExitToAppIcon className="icon" />
                        <span onClick={logout}>Logout</span>
                    </li>
                </ul>
            </div>
            <div className="bottom">
                <div className="colorOption" onClick={() => dispatch({ type: 'LIGHT' })}></div>
                <div className="colorOption" onClick={() => dispatch({ type: 'DARK' })}></div>
            </div>
        </div>
    );
};

export default Sidebar;
