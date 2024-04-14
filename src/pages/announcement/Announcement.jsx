import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    Select,
    MenuItem,
} from '@mui/material';
import axios from 'axios';
import styles from '../../components/datatable/datatable_user/datatable_user.module.css';
import ReactPaginate from 'react-paginate';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const Announcement = () => {
    const [tableData, setTableData] = useState([]);
    const [perPage, setPerPage] = useState(6);
    const [currentPage, setCurrentPage] = useState(1);
    const [numOfTotalPages, setNumOfTotalPages] = useState(0);
    const [departmentTitle, setDepartmentTitle] = useState('');
    const [employees, setEmployees] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState([]);

    const [open, setOpen] = useState(false);

    const loadAnnouncements = async () => {
        try {
            const accessToken = await AsyncStorage.getItem('accessToken');

            const response = await axios.get('http://localhost:5555/v1/announcement/get-all-announcements', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            setTableData(response.data);
            setNumOfTotalPages(Math.ceil(response.data.length / perPage));
        } catch (error) {
            console.log(error.response.data);
        }
    };

    const getUserInfo = async () => {
        try {
            const accessToken = await AsyncStorage.getItem('accessToken');
            const decodedToken = jwtDecode(accessToken); // Giải mã accessToken để lấy thông tin user
            if (decodedToken && decodedToken.department) {
                const label = mapValueToLabel(decodedToken.department);
                setDepartmentTitle(`Lịch Biểu ${label}`); // Đặt title dựa trên phòng ban của user
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchEmployees = async () => {
        try {
            const accessToken = await AsyncStorage.getItem('accessToken');
            const response = await axios.get('http://localhost:5555/v1/user/users/department', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log(response.data);
            setEmployees(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    useEffect(() => {
        loadAnnouncements();
        getUserInfo();
        fetchEmployees();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleEmployeeChange = (event) => {
        const selected = event.target.value;
        setSelectedEmployees(selected);
        setFormData({
            ...formData,
            listEmployee: selected.join(', '),
        });
    };

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected + 1);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [formData, setFormData] = useState({
        nameAnnouncement: '',
        startAt: '',
        note: '',
        listEmployee: '',
        department: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const accessToken = await AsyncStorage.getItem('accessToken');
            await axios.post('http://localhost:5555/v1/announcement', formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setFormData({
                nameAnnouncement: '',
                startAt: '',
                note: '',
                listEmployee: '',
                department: '',
            });
            setOpen(false); // Ẩn form
            loadAnnouncements(); // Cập nhật dữ liệu
        } catch (error) {
            console.log(error.response.data);
        }
    };

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

    const mapValueToLabel = (value) => {
        const department = departments.find((dept) => dept.value === value);
        return department ? department.label : '';
    };

    const indexOfLastAnnouncement = currentPage * perPage;
    const indexOfFirstAnnouncement = indexOfLastAnnouncement - perPage;
    const visibleAnnouncements = tableData?.slice(indexOfFirstAnnouncement, indexOfLastAnnouncement);

    return (
        <div className="home">
            <Sidebar />
            <div className="homeContainer">
                <Navbar />
                <div className={styles.servicePage}>
                    <div className={styles.datatable}>
                        <div className={styles.datatableTitle}>
                            <b>{departmentTitle}</b>
                            <Button
                                style={{ borderRadius: 5, background: 'rgb(98, 192, 216)' }}
                                variant="contained"
                                onClick={handleClickOpen}
                            >
                                Thêm mới
                            </Button>
                        </div>

                        <Dialog open={open} onClose={handleClose}>
                            <DialogTitle>Thêm mới lịch họp</DialogTitle>
                            <DialogContent>
                                <form onSubmit={handleSubmit} style={{ width: '400px' }}>
                                    <div style={{ width: '100%', marginBottom: '30px' }}>
                                        <TextField
                                            label="Tên cuộc họp"
                                            type="text"
                                            name="nameAnnouncement"
                                            value={formData.nameAnnouncement || ''}
                                            onChange={handleChange}
                                            required
                                            fullWidth
                                        />
                                    </div>
                                    <div style={{ width: '100%', marginBottom: '30px', position: 'relative' }}>
                                        <TextField
                                            label="Thời gian họp"
                                            type="datetime-local"
                                            name="startAt"
                                            value={formData.startAt || ''}
                                            onChange={handleChange}
                                            InputLabelProps={{ shrink: true, required: true }}
                                            required
                                            fullWidth
                                        />
                                    </div>
                                    <div style={{ width: '100%', marginBottom: '30px' }}>
                                        <TextField
                                            label="Ghi chú"
                                            type="text"
                                            name="note"
                                            value={formData.note || ''}
                                            onChange={handleChange}
                                            fullWidth
                                        />
                                    </div>
                                    <div style={{ width: '100%', marginBottom: '30px' }}>
                                        <Select
                                            multiple
                                            value={selectedEmployees}
                                            onChange={handleEmployeeChange}
                                            renderValue={(selected) => selected.join(', ')}
                                        >
                                            {employees.map((employee) => (
                                                <MenuItem key={employee.id} value={employee.fullname}>
                                                    {employee.fullname}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </div>
                                    <DialogActions>
                                        <Button onClick={handleClose} color="primary">
                                            Đóng
                                        </Button>
                                        <Button type="submit" onClick={handleSubmit} color="primary">
                                            Thêm mới
                                        </Button>
                                    </DialogActions>
                                </form>
                            </DialogContent>
                        </Dialog>

                        <TableContainer component={Paper} className={styles.table}>
                            <Table sx={{ minWidth: 1200 }} aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={styles.tableCell + ' text-center'}>STT</TableCell>
                                        <TableCell className={styles.tableCell + ' text-center'}>
                                            Tên thông báo
                                        </TableCell>
                                        <TableCell className={styles.tableCell + ' text-center'}>
                                            Thời gian họp
                                        </TableCell>
                                        <TableCell className={styles.tableCell + ' text-center'}>Ghi chú</TableCell>
                                        <TableCell className={styles.tableCell + ' text-center'}>Nhân viên</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {visibleAnnouncements?.length > 0 &&
                                        visibleAnnouncements?.map((announcement, index) => (
                                            <TableRow
                                                key={index}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell className={styles.tableCell + ' text-center'}>
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell className={styles.tableCell + ' text-center'}>
                                                    {announcement.nameAnnouncement}
                                                </TableCell>
                                                <TableCell className={styles.tableCell + ' text-center'}>
                                                    {new Date(announcement.startAt).toLocaleString('vi-VN', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </TableCell>
                                                <TableCell className={styles.tableCell + ' text-center'}>
                                                    {announcement.note}
                                                </TableCell>
                                                <TableCell className={styles.tableCell + ' text-center'}>
                                                    {announcement.listEmployee.join(', ')}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <ReactPaginate
                            previousLabel={'Prev'}
                            nextLabel={'Next'}
                            pageCount={numOfTotalPages}
                            onPageChange={handlePageChange}
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
            </div>
        </div>
    );
};

export default Announcement;
