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
import styles from './datatable_multiTask.module.css';
import Button from 'react-bootstrap/Button';
import ReactPaginate from 'react-paginate';
import queryString from 'query-string';
import Select from 'react-select';
const Datatable_multiTask = () => {
    const [departs, setDeparts] = useState([]);
    const location = useLocation();
    const params = queryString.parse(location.search);
    const [username, setUsername] = useState(() => {
        return params.username;
    });
    const [position, setPosition] = useState(() => {
        return params.position;
    });

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
        let url = `http://localhost:5555/v1/multiTask/?`;

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

    const mapValueToLabel = (value) => {
        const department = departments.find((dept) => dept.value === value);
        return department ? department.label : '';
    };
    const gatherDeparts = (items) => {
        let arrDepart = [];
        for (let index = 0; index < items.length; index++) {
            let joinDepart = [];
            for (let i = 0; i < items[index].tasks.length; i++) {
                const temp = mapValueToLabel(items[index].tasks[i].department);
                joinDepart.push(temp);
            }
            arrDepart.push(joinDepart.join(', '));
        }
        setDeparts(arrDepart);
    };

    const loadSVT = async () => {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const url = buildSearchURL();
        axios
            .get(url, { headers: { Authorization: `Bearer ${accessToken}` } })
            .then((response) => {
                setTableDataSVT(response.data);
                gatherDeparts(response.data);
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
                setIsAdmin(decodedToken.isAdmin);
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

    return (
        <div className={styles.servicePage}>
            <div className={styles.datatable}>
                <div className={styles.datatableTitle}>
                    <b>Danh Sách Yêu Cầu Liên Đơn Vị</b>
                </div>

                {isAdmin == true ? (
                    <div style={{ marginBottom: 10 }}>
                        <Button
                            onClick={() => addNewUser()}
                            style={{ background: 'green', fontSize: 15, fontWeight: 'bold' }}
                        >
                            Thêm Yêu Cầu
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
                                <TableCell className={styles.tableCell + ' text-center'}>Tiêu đề</TableCell>
                                <TableCell className={styles.tableCell + ' text-center'}>Ngày Tạo</TableCell>
                                <TableCell className={styles.tableCell + ' text-center'}>Các Phòng Ban</TableCell>
                                <TableCell className={styles.tableCell + ' text-center'}>Trạng Thái</TableCell>
                                <TableCell className={styles.tableCell + ' text-center'}>Lựa Chọn</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {visibleSVT?.length > 0 &&
                                departs &&
                                visibleSVT?.map((item, index) => (
                                    <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell className={styles.tableCell + ' text-center'}>{index + 1}</TableCell>

                                        <TableCell className={styles.tableCell + ' text-center'}>
                                            {item.requestid?.title}
                                        </TableCell>
                                        <TableCell className={styles.tableCell + ' text-center'}>
                                            {item.createdAt}
                                        </TableCell>
                                        <TableCell className={styles.tableCell + ' text-center'}>
                                            {departs[index]}
                                        </TableCell>
                                        <TableCell className={styles.tableCell + ' text-center'}>
                                            {item.status}
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

export default Datatable_multiTask;
