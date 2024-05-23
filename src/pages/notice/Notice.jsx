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
    InputLabel,
} from '@mui/material';
import axios from 'axios';
import styles from '../../components/datatable/datatable_user/datatable_user.module.css';
import ReactPaginate from 'react-paginate';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import CustomSnackbar from '../../components/customSnackbar/CustomSnackbar';
import './Notice.scss';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';

const Notice = () => {
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [tableData, setTableData] = useState([]);
    const [perPage, setPerPage] = useState(6);
    const [currentPage, setCurrentPage] = useState(1);
    const [numOfTotalPages, setNumOfTotalPages] = useState(0);
    const [userPosition, setUserPosition] = useState('');
    const [userDepartment, setUserDepartment] = useState('');
    const [open, setOpen] = useState(false);
    const [editNotice, setEditNotice] = useState(null);
    const [actionType, setActionType] = useState('add');
    let [visibleNotices, setVisibleNotice] = useState([]);
    const [isViewMode, setIsViewMode] = useState(false);

    const indexOfLastNotice = currentPage * perPage;
    const indexOfFirstNotice = indexOfLastNotice - perPage;
    visibleNotices = tableData?.slice(indexOfFirstNotice, indexOfLastNotice);

    const handleSnackbarOpen = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setOpenSnackbar(true);
    };

    const location = useLocation();
    const params = queryString.parse(location.search);
    const [nameNotice, setNameNotice] = useState(() => {
        return params.nameNotice;
    });
    const [Source, setSource] = useState(() => {
        return params.Source;
    });

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    function buildSearchURL() {
        const searchData = {
            nameNotice: nameNotice || '',
            Source: Source || '',
        };
        let url = `http://localhost:5555/v1/Notice/get-all-Notices?`;

        // Check nameAnnouncement
        if (searchData.nameNotice !== undefined && searchData.nameNotice !== 'undefined') {
            url = url + `nameNotice=${searchData.nameNotice}`;
        } else {
            url = url + `nameNotice=`;
            setNameNotice('');
        }

        // Check meeting
        if (searchData.Source !== undefined && searchData.Source !== 'undefined') {
            url = url + `&Source=${searchData.Source}`;
        } else {
            url = url + `&Source=`;
            setSource('');
        }

        return url;
    }

    const loadNotice = async () => {
        try {
            const accessToken = await AsyncStorage.getItem('accessToken');

            const url = buildSearchURL();

            const response = await axios.get(url, {
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
            const decodedToken = jwtDecode(accessToken);
            setUserPosition(decodedToken.position);
            setUserDepartment(decodedToken.department);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        loadNotice();
        getUserInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [formData, setFormData] = useState({
        nameNotice: '',
        Source: '',
        NumberOfNotice: '',
    });

    const handleClickOpen = (type, Notice = null) => {
        if (type === 'edit' && Notice) {
            setFormData({
                nameNotice: Notice.nameNotice || '',
                Source: Notice.Source || '',
                NumberOfNotice: Notice.NumberOfNotice || '',
            });
            setEditNotice(Notice);
            setActionType('edit');
        } else if (type === 'view' && Notice) {
            setFormData({
                nameNotice: Notice.nameNotice || '',
                Source: Notice.Source || '',
                NumberOfNotice: Notice.NumberOfNotice || '',
            });
            setEditNotice(null);
            setActionType('view');
            setIsViewMode(true);
        } else {
            setFormData({
                nameNotice: '',
                Source: '',
                NumberOfNotice: '',
            });
            setActionType('add');
        }
        setOpen(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleDelete = async (id) => {
        try {
            const accessToken = await AsyncStorage.getItem('accessToken'); // Hoặc cách lấy token của bạn
            const response = await axios.delete(`http://localhost:5555/v1/Notice/delete-Notice/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.status === 200) {
                setVisibleNotice((prevAnnouncements) =>
                    prevAnnouncements.filter((announcement) => announcement._id !== id),
                );
                handleSnackbarOpen('Xóa thông báo thành công!', 'success');
            }
            loadNotice();
        } catch (error) {
            handleSnackbarOpen('Đã có lỗi xảy ra khi xóa thông báo. Vui lòng thử lại sau.', 'error');
        }
    };

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected + 1);
    };

    const handleClose = () => {
        setOpen(false);
        setEditNotice(null);
        setActionType('add');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const accessToken = await AsyncStorage.getItem('accessToken');
            if (actionType === 'add') {
                await axios.post('http://localhost:5555/v1/Notice/add-Notice', formData, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
            } else if (actionType === 'edit') {
                await axios.put(`http://localhost:5555/v1/Notice/update-Notice/${editNotice._id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
            }
            handleClose(); // Đóng dialog sau khi thêm mới hoặc cập nhật thành công
            loadNotice();
            handleSnackbarOpen(actionType === 'add' ? 'Thêm mới thành công!' : 'Cập nhật thành công!', 'success');
        } catch (error) {
            console.log(error.response.data);
            handleSnackbarOpen('Đã có lỗi xảy ra. Vui lòng thử lại sau.', 'error');
        }
    };

    return (
        <div className="home">
            <Sidebar />
            <CustomSnackbar
                open={openSnackbar}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={handleSnackbarClose}
            />
            <div className="homeContainer">
                <Navbar />
                <div className={styles.servicePage}>
                    <div className={styles.datatable}>
                        <div className={styles.datatableTitle}>
                            <b>Quản lý thông báo</b>
                            {/*{userPosition === 'TRUONG_PHONG' && userDepartment === 'PHONG_NHAN_SU' && (*/}
                            <Button
                                style={{ borderRadius: 5, background: 'rgb(98, 192, 216)' }}
                                variant="contained"
                                onClick={handleClickOpen}
                            >
                                Thêm mới
                            </Button>
                            {/*)}*/}
                        </div>

                        <Dialog open={open} onClose={handleClose}>
                            <DialogTitle>
                                {actionType === 'add'
                                    ? 'Thêm mới thông báo'
                                    : actionType === 'view'
                                    ? 'Xem chi tiết thông báo'
                                    : 'Chỉnh sửa thông báo'}
                            </DialogTitle>
                        </Dialog>

                        <TableContainer component={Paper} className={styles.table} style={{ marginTop: '25px' }}>
                            <Table sx={{ minWidth: 1200 }} aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={styles.tableCell + ' text-center'}>
                                            Thông tin nội bộ
                                        </TableCell>

                                        <TableCell className={styles.tableCell + ' text-center'}>Chi tiết</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {visibleNotices?.length > 0 &&
                                        visibleNotices?.map((NoticesetNameNotice, index) => (
                                            <TableRow
                                                key={index}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell className={styles.tableCell + ' text-center'}>
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell className={styles.tableCell + ' text-center'}>
                                                    {NoticesetNameNotice.nameNoticesetNameNotice}
                                                </TableCell>
                                                <TableCell className={styles.tableCell + ' text-center'}>
                                                    {NoticesetNameNotice.Source}
                                                </TableCell>
                                                <TableCell className={styles.tableCell + ' text-center'}>
                                                    {NoticesetNameNotice.NumberOfNoticesetNameNotice}
                                                </TableCell>
                                                <TableCell className={styles.tableCell + ' text-center'}>
                                                    <div className={styles.cellAction}>
                                                        {/*{userPosition !== 'TRUONG_PHONG' ||
                                                            (userDepartment !== 'PHONG_NHAN_SU' && (*/}
                                                        <Button
                                                            className={styles.viewButton}
                                                            onClick={() => handleClickOpen('view', NoticesetNameNotice)}
                                                        >
                                                            Xem chi tiết
                                                        </Button>
                                                        {/*))}*/}
                                                        {/*{userPosition === 'TRUONG_PHONG' &&
                                                            userDepartment === 'PHONG_NHAN_SU' && (*/}
                                                        <>
                                                            <Button
                                                                className={styles.editButton}
                                                                onClick={() =>
                                                                    handleClickOpen('edit', NoticesetNameNotice)
                                                                }
                                                            >
                                                                Chỉnh sửa
                                                            </Button>
                                                            <Button
                                                                onClick={() => handleDelete(NoticesetNameNotice._id)}
                                                                className={styles.deleteButton}
                                                            >
                                                                Xóa
                                                            </Button>
                                                        </>
                                                        {/* )}*/}
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

                        <TableContainer component={Paper} className={styles.table} style={{ marginTop: '25px' }}>
                            <Table sx={{ minWidth: 1200 }} aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={styles.tableCell + ' text-center'}>Thông báo</TableCell>

                                        <TableCell className={styles.tableCell + ' text-center'}>
                                            Chi tiết thông báo
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {visibleNotices?.length > 0 &&
                                        visibleNotices?.map((NoticesetNameNotice, index) => (
                                            <TableRow
                                                key={index}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell className={styles.tableCell + ' text-center'}>
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell className={styles.tableCell + ' text-center'}>
                                                    {NoticesetNameNotice.nameNoticesetNameNotice}
                                                </TableCell>
                                                <TableCell className={styles.tableCell + ' text-center'}>
                                                    {NoticesetNameNotice.Source}
                                                </TableCell>
                                                <TableCell className={styles.tableCell + ' text-center'}>
                                                    {NoticesetNameNotice.NumberOfNoticesetNameNotice}
                                                </TableCell>
                                                <TableCell className={styles.tableCell + ' text-center'}>
                                                    <div className={styles.cellAction}>
                                                        {/*{userPosition !== 'TRUONG_PHONG' ||
                                                            (userDepartment !== 'PHONG_NHAN_SU' && (*/}
                                                        <Button
                                                            className={styles.viewButton}
                                                            onClick={() => handleClickOpen('view', NoticesetNameNotice)}
                                                        >
                                                            Xem chi tiết
                                                        </Button>
                                                        {/*))}*/}
                                                        {/*{userPosition === 'TRUONG_PHONG' &&
                                                            userDepartment === 'PHONG_NHAN_SU' && (*/}
                                                        <>
                                                            <Button
                                                                className={styles.editButton}
                                                                onClick={() =>
                                                                    handleClickOpen('edit', NoticesetNameNotice)
                                                                }
                                                            >
                                                                Chỉnh sửa
                                                            </Button>
                                                            <Button
                                                                onClick={() => handleDelete(NoticesetNameNotice._id)}
                                                                className={styles.deleteButton}
                                                            >
                                                                Xóa
                                                            </Button>
                                                        </>
                                                        {/* )}*/}
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

                        <TableContainer component={Paper} className={styles.table} style={{ marginTop: '25px' }}>
                            <Table sx={{ minWidth: 1200 }} aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={styles.tableCell + ' text-center'}>
                                            Danh mục khen thưởng
                                        </TableCell>

                                        <TableCell className={styles.tableCell + ' text-center'}>
                                            Chi tiết khen thưởng
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {visibleNotices?.length > 0 &&
                                        visibleNotices?.map((NoticesetNameNotice, index) => (
                                            <TableRow
                                                key={index}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell className={styles.tableCell + ' text-center'}>
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell className={styles.tableCell + ' text-center'}>
                                                    {NoticesetNameNotice.nameNoticesetNameNotice}
                                                </TableCell>
                                                <TableCell className={styles.tableCell + ' text-center'}>
                                                    {NoticesetNameNotice.Source}
                                                </TableCell>
                                                <TableCell className={styles.tableCell + ' text-center'}>
                                                    {NoticesetNameNotice.NumberOfNoticesetNameNotice}
                                                </TableCell>
                                                <TableCell className={styles.tableCell + ' text-center'}>
                                                    <div className={styles.cellAction}>
                                                        {/*{userPosition !== 'TRUONG_PHONG' ||
                                                            (userDepartment !== 'PHONG_NHAN_SU' && (*/}
                                                        <Button
                                                            className={styles.viewButton}
                                                            onClick={() => handleClickOpen('view', NoticesetNameNotice)}
                                                        >
                                                            Xem chi tiết
                                                        </Button>
                                                        {/*))}*/}
                                                        {/*{userPosition === 'TRUONG_PHONG' &&
                                                            userDepartment === 'PHONG_NHAN_SU' && (*/}
                                                        <>
                                                            <Button
                                                                className={styles.editButton}
                                                                onClick={() =>
                                                                    handleClickOpen('edit', NoticesetNameNotice)
                                                                }
                                                            >
                                                                Chỉnh sửa
                                                            </Button>
                                                            <Button
                                                                onClick={() => handleDelete(NoticesetNameNotice._id)}
                                                                className={styles.deleteButton}
                                                            >
                                                                Xóa
                                                            </Button>
                                                        </>
                                                        {/* )}*/}
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

export default Notice;
