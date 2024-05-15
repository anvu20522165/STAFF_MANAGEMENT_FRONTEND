import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './datatable_user.module.css';
import Button from 'react-bootstrap/Button';
import ReactPaginate from 'react-paginate';
import queryString from 'query-string';
import Select from 'react-select';
const Datatable_user = () => {
    const location = useLocation();
    const params = queryString.parse(location.search);
    const [username, setUsername] = useState(() => {
        return params.username;
    });
    const [position, setPosition] = useState(() => {
        return params.position;
    });
    const [departmentHead, setDepartmentHead] = useState('');
    const [departmentHR, setDepartmentHR] = useState('');

    const [department, setDepartment] = useState(() => {
        return params.department;
    });
    const [selectedPosition, setSelectedPosition] = useState({ value: '', label: 'Tất cả' });
    const positions = [
        { value: '', label: 'Tất cả' },
        { value: 'QUAN_LY', label: 'Quản lý' },
        { value: 'TRUONG_PHONG', label: 'Trưởng phòng' },
        { value: 'PHO_PHONG', label: 'Phó phòng' },
        { value: 'NHAN_VIEN', label: 'Nhân viên' },
    ];

    const [selectedDepartment, setSelectedDepartment] = useState({ value: '', label: 'Tất cả' });
    const departments = [
        { value: '', label: 'Tất cả' },
        { value: 'BAN_QUAN_LY', label: 'Ban Quản lý' },
        { value: 'BAN_GIAM_DOC', label: 'Ban Giám Đốc' },
        { value: 'PHONG_NHAN_SU', label: 'Phòng Nhân Sự' },
        { value: 'PHONG_TAI_CHINH', label: 'Phòng Tài Chính' },
        { value: 'PHONG_MARKETING', label: 'Phòng Marketing' },
        { value: 'PHONG_KY_THUAT', label: 'Phòng Kỹ Thuật' },
        { value: 'PHONG_SAN_XUAT', label: 'Phòng Sản Xuất' },
        { value: 'PHONG_HANH_CHINH', label: 'Phòng Hành Chính' },
    ];

    const [email, setEmail] = useState(() => {
        return params.email;
    });
    const [tableDataSVT, setTableDataSVT] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);

    //Pagination
    const [svtPerPage, setSvtPerPage] = useState(6);
    const [CsvtPerPage, setCSvtPerPage] = useState(1);
    const numOfToTalPages = Math.ceil(tableDataSVT?.length / svtPerPage);
    const indexOfLastSVT = CsvtPerPage * svtPerPage;
    const indexOfFirstSVT = indexOfLastSVT - svtPerPage;
    const visibleSVT = tableDataSVT?.slice(indexOfFirstSVT, indexOfLastSVT);

    const navigate = useNavigate();
    const changePage = ({ selected }) => {
        setCSvtPerPage(selected + 1);
    };

    useEffect(() => {
        loadSVT();
    }, []);

    function buildSearchURL() {
        const searchData = {
            usernameSearch: username || '',
            emailSearch: email || '',
            position: position || '',
            department: department || '',
        };
        let url = `http://localhost:5555/v1/user/users?`;

        //check username
        if (searchData.usernameSearch !== undefined && searchData.usernameSearch !== 'undefined') {
            url = url + `username=${searchData.usernameSearch}`;
        } else {
            url = url + `username=`;
            setUsername('');
        }

        //check email
        if (searchData.emailSearch !== undefined && searchData.emailSearch !== 'undefined') {
            url = url + `&email=${searchData.emailSearch}`;
        } else {
            url = url + `&email=`;
            setEmail('');
        }
        //check position
        url = url + `&position=${searchData.position}`;

        //check department
        url = url + `&department=${searchData.department}`;

        return url;
    }

    const loadSVT = async () => {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const url = buildSearchURL();

        axios
            .get(url, { headers: { Authorization: `Bearer ${accessToken}` } })
            .then((response) => {
                console.log(response.data);
                setTableDataSVT(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
        //}
    };

    function search() {
        window.location.replace(
            `/users?username=${username}&email=${email}&position=${selectedPosition.value}&department=${selectedDepartment.value}`,
        );
    }

    function editUser(id) {
        navigate(`/users/${id}`);
    }

    function addNewUser(id) {
        navigate(`/users/add`);
    }

    useEffect(() => {
        async function checkAuth() {
            try {
                const accessToken = await AsyncStorage.getItem('accessToken');
                const decodedToken = jwtDecode(accessToken);
                setDepartmentHead(decodedToken.position);
                setDepartmentHR(decodedToken.department);
                let curTime = Date.now() / 1000;
                if (decodedToken.exp < curTime) {
                    window.location.replace('/login');
                }
            } catch (error) {
                console.log('lỗi cmnr');
            }
        }
        checkAuth();
        loadSVT();
    }, []);

    const deleteUser = async (id) => {
        const accessToken = await AsyncStorage.getItem('accessToken');
        console.log(id);
        axios
            .delete(`http://localhost:5555/v1/user/${id}`, { headers: { Authorization: `Bearer ${accessToken}` } })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                window.alert("You don't have the permission to fulfill this action");
            });
        loadSVT();
    };
    const mapValueToLabel = (value) => {
        const position = positions.find((dept) => dept.value === value);
        return position ? position.label : '';
    };
    const mapValueToLabelDepartment = (value) => {
        const department = departments.find((dept) => dept.value === value);
        return department ? department.label : '';
    };
    return (
        <div className={styles.servicePage}>
            <div className={styles.datatable}>
                <div className={styles.datatableTitle}>
                    <b>Danh Sách Nhân Viên</b>
                </div>
                <div className="item">
                    <div className={styles.details}>
                        <div className={styles.detailItems}>
                            <div className="itemKey">Tên:</div>
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
                                        marginRight: 30,
                                        width: 200,
                                    }}
                                    value={username}
                                    type="text"
                                    placeholder="Nhập username"
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
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
                                        marginRight: 30,
                                        width: 200,
                                    }}
                                    value={email}
                                    type="text"
                                    placeholder="Nhập email"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="itemKey">Chức vụ:</div>
                            <div className="itemValue" style={{ marginLeft: 10 }}>
                                <Select
                                    defaultValue={selectedPosition}
                                    onChange={setSelectedPosition}
                                    options={positions}
                                />
                            </div>

                            <div className="itemKey" style={{ marginLeft: 50 }}>
                                Phòng ban:
                            </div>
                            <div className="itemValue" style={{ marginLeft: 10 }}>
                                <Select
                                    defaultValue={selectedDepartment}
                                    onChange={setSelectedDepartment}
                                    options={departments}
                                />
                                <Button
                                    onClick={() => search()}
                                    style={{ borderRadius: 5, background: 'rgb(98, 192, 216)' }}
                                >
                                    {' '}
                                    Tìm kiếm{' '}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                {departmentHead == 'TRUONG_PHONG' && departmentHR == 'PHONG_NHAN_SU' ? (
                    <div style={{ marginBottom: 10 }}>
                        <Button
                            onClick={() => addNewUser()}
                            style={{ background: 'green', fontSize: 15, fontWeight: 'bold' }}
                        >
                            Thêm NV
                        </Button>
                    </div>
                ) : (
                    <div style={{ marginBottom: 10 }}></div>
                )}

                <TableContainer component={Paper} className={styles.table}>
                    <Table sx={{ minWidth: 1200 }} aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell className={styles.tableCell + ' text-center'}>STT</TableCell>
                                <TableCell className={styles.tableCell + ' text-center'}>Ảnh</TableCell>
                                <TableCell className={styles.tableCell + ' text-center'}>Tên</TableCell>
                                <TableCell className={styles.tableCell + ' text-center'}>Email</TableCell>
                                <TableCell className={styles.tableCell + ' text-center'}>Giới Tính</TableCell>
                                <TableCell className={styles.tableCell + ' text-center'}>Phòng Ban</TableCell>

                                <TableCell className={styles.tableCell + ' text-center'}>Chức vụ</TableCell>
                                <TableCell className={styles.tableCell + ' text-center'}>Lựa Chọn</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {visibleSVT?.length > 0 &&
                                visibleSVT?.map((item, index) => (
                                    <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell className={styles.tableCell + ' text-center'}>{index + 1}</TableCell>
                                        <TableCell className={styles.tableCell + ' text-center'}>
                                            <img
                                                style={{ width: 35, height: 35, borderRadius: 20 }}
                                                src={item.avt}
                                                alt=""
                                                className="itemImg"
                                            />
                                        </TableCell>
                                        <TableCell className={styles.tableCell + ' text-center'}>
                                            {item.username}
                                        </TableCell>
                                        <TableCell className={styles.tableCell + ' text-center'}>
                                            {item.email}
                                        </TableCell>
                                        <TableCell className={styles.tableCell + ' text-center'}>
                                            {item.gender}
                                        </TableCell>

                                        <TableCell className={styles.tableCell + ' text-center'}>
                                            {mapValueToLabelDepartment(item.department)}
                                        </TableCell>

                                        <TableCell className={styles.tableCell + ' text-center'}>
                                            {mapValueToLabel(item.position)}
                                        </TableCell>
                                        <TableCell className={styles.tableCell + ' text-center'}>
                                            <div className={styles.cellAction}>
                                                <Button
                                                    onClick={() => editUser(item._id)}
                                                    className={styles.editButton}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    onClick={() => deleteUser(item._id)}
                                                    className={styles.deleteButton}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <ReactPaginate
                    previousLabel={'Prev'}
                    nextLabel={'Next'}
                    pageCount={numOfToTalPages}
                    onPageChange={changePage}
                    containerClassName={styles.myContainerPagination}
                    pageClassName={styles.pageItem}
                    pageLinkClassName={styles.pageLink}
                    previousClassName={styles.pageItem}
                    previousLinkClassName={styles.pageLink}
                    nextClassName={styles.pageItem}
                    nextLinkClassName={styles.pageLink}
                    breakClassName={styles.pageItem}
                    breakLinkClassName={styles.pageLink}
                    activeClassName={styles.active}
                />
            </div>
        </div>
    );
};

export default Datatable_user;
