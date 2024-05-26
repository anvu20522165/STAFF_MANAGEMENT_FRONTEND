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
} from '@mui/material';
import axios from 'axios';
import styles from '../../components/datatable/datatable_user/datatable_user.module.css';
import ReactPaginate from 'react-paginate';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import CustomSnackbar from '../../components/customSnackbar/CustomSnackbar';
import './Hardware.scss';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';

const Hardware = () => {
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
    const [editHardware, setEditHardware] = useState(null);
    const [actionType, setActionType] = useState('add');
    let [visibleHardwares, setVisibleHardwares] = useState([]);
    const [isViewMode, setIsViewMode] = useState(false);

    const location = useLocation();
    const params = queryString.parse(location.search);
    const [deviceName, setDeviceName] = useState(() => {
        return params.deviceName;
    });
    const [description, setDescription] = useState(() => {
        return params.description;
    });

    const indexOfLastHardware = currentPage * perPage;
    const indexOfFirstHardware = indexOfLastHardware - perPage;
    visibleHardwares = tableData?.slice(indexOfFirstHardware, indexOfLastHardware);

    const handleSnackbarOpen = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setOpenSnackbar(true);
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    function buildSearchURL() {
        const searchData = {
            deviceName: deviceName || '',
            description: description || '',
        };
        let url = `http://localhost:5555/v1/hardware/get-all-hardware?`;

        if (searchData.deviceName !== undefined && searchData.deviceName !== 'undefined') {
            url = url + `deviceName=${searchData.deviceName}`;
        } else {
            url = url + `deviceName=`;
            setDeviceName('');
        }

        if (searchData.description !== undefined && searchData.description !== 'undefined') {
            url = url + `&description=${searchData.description}`;
        } else {
            url = url + `&description=`;
            setDescription('');
        }

        return url;
    }

    const loadHardware = async () => {
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

    function search() {
        window.location.replace(`/hardware?deviceName=${deviceName}&description=${description}`);
    }

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
        loadHardware();
        getUserInfo();
    }, []);

    const [formData, setFormData] = useState({
        deviceName: '',
        description: '',
        NumberOfDevice: '',
        mainowner: '',
    });

    const handleClickOpen = (type, hardware = null) => {
        if (type === 'edit' && hardware) {
            setFormData({
                deviceName: hardware.deviceName || '',
                description: hardware.description || '',
                NumberOfDevice: hardware.NumberOfDevice || '',
                mainowner: hardware.mainowner || '',
            });
            setEditHardware(hardware);
            setActionType('edit');
        } else if (type === 'view' && hardware) {
            setFormData({
                deviceName: hardware.deviceName || '',
                description: hardware.description || '',
                NumberOfDevice: hardware.NumberOfDevice || '',
                mainowner: hardware.mainowner || '',
            });
            setEditHardware(null);
            setActionType('view');
            setIsViewMode(true);
        } else {
            setFormData({
                deviceName: '',
                description: '',
                NumberOfDevice: '',
                mainowner: '',
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
            const accessToken = await AsyncStorage.getItem('accessToken');
            const response = await axios.delete(`http://localhost:5555/v1/hardware/delete-hardware/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.status === 200) {
                setVisibleHardwares((prevHardwares) => prevHardwares.filter((hardware) => hardware._id !== id));
                handleSnackbarOpen('Xóa phần cứng thành công!', 'success');
            }
            loadHardware();
        } catch (error) {
            handleSnackbarOpen('Đã có lỗi xảy ra khi xóa phần cứng. Vui lòng thử lại sau.', 'error');
        }
    };

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected + 1);
    };

    const handleClose = () => {
        setOpen(false);
        setEditHardware(null);
        setActionType('add');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const accessToken = await AsyncStorage.getItem('accessToken');
            if (actionType === 'add') {
                await axios.post('http://localhost:5555/v1/hardware/add-hardware', formData, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
            } else if (actionType === 'edit') {
                await axios.put(`http://localhost:5555/v1/hardware/update-hardware/${editHardware._id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
            }
            handleClose();
            loadHardware();
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
                            <b>Quản lý phần cứng</b>
                            {userPosition === 'TRUONG_PHONG' && userDepartment === 'PHONG_KY_THUAT' && (
                                <Button
                                    style={{ borderRadius: 5, background: 'rgb(98, 192, 216)' }}
                                    variant="contained"
                                    onClick={handleClickOpen}
                                >
                                    Thêm mới
                                </Button>
                            )}
                        </div>

                        <Dialog open={open} onClose={handleClose}>
                            <DialogTitle>
                                {actionType === 'add'
                                    ? 'Thêm mới phần cứng'
                                    : actionType === 'view'
                                    ? 'Xem chi tiết phần cứng'
                                    : 'Chỉnh sửa phần cứng'}
                            </DialogTitle>
                            <DialogContent>
                                <form onSubmit={handleSubmit} style={{ width: '450px' }}>
                                    <div style={{ width: '100%', marginBottom: '30px' }}>
                                        <TextField
                                            label="Tên thiết bị"
                                            type="text"
                                            name="deviceName"
                                            value={formData.deviceName || ''}
                                            onChange={handleChange}
                                            required
                                            fullWidth
                                            InputProps={{
                                                readOnly: isViewMode,
                                            }}
                                        />
                                    </div>
                                    <div style={{ width: '100%', marginBottom: '30px' }}>
                                        <TextField
                                            label="Mô tả"
                                            type="text"
                                            name="description"
                                            value={formData.description || ''}
                                            onChange={handleChange}
                                            required
                                            fullWidth
                                            InputProps={{
                                                readOnly: isViewMode,
                                            }}
                                        />
                                    </div>
                                    <div style={{ width: '100%', marginBottom: '30px' }}>
                                        <TextField
                                            label="Số lượng"
                                            type="number"
                                            name="NumberOfDevice"
                                            value={formData.NumberOfDevice || ''}
                                            onChange={handleChange}
                                            fullWidth
                                            InputProps={{
                                                readOnly: isViewMode,
                                            }}
                                        />
                                    </div>
                                    <div style={{ width: '100%', marginBottom: '30px' }}>
                                        <TextField
                                            label="Chủ sở hữu chính"
                                            type="text"
                                            name="mainowner"
                                            value={formData.mainowner || ''}
                                            onChange={handleChange}
                                            fullWidth
                                            InputProps={{
                                                readOnly: isViewMode,
                                            }}
                                        />
                                    </div>
                                    {actionType !== 'view' && (
                                        <DialogActions>
                                            <Button onClick={handleClose} color="primary">
                                                Đóng
                                            </Button>
                                            <Button type="submit" color="primary">
                                                {actionType === 'add' ? 'Thêm mới' : 'Cập nhật'}
                                            </Button>
                                        </DialogActions>
                                    )}
                                    {actionType === 'view' && (
                                        <DialogActions>
                                            <Button onClick={handleClose} color="primary">
                                                Đóng
                                            </Button>
                                        </DialogActions>
                                    )}
                                </form>
                            </DialogContent>
                        </Dialog>

                        <div className="item">
                            <div className={styles.details}>
                                <div className={styles.detailItems}>
                                    <div className="itemKey">Tên thiết bị:</div>
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
                                            value={deviceName}
                                            type="text"
                                            placeholder="Nhập tên thiết bị"
                                            onChange={(e) => setDeviceName(e.target.value)}
                                        />
                                    </div>
                                    <div className="itemKey">Mô tả:</div>
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
                                            value={description}
                                            type="text"
                                            placeholder="Nhập mô tả"
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                    </div>

                                    <div className="itemValue" style={{ marginLeft: 10 }}>
                                        <Button
                                            onClick={() => search()}
                                            style={{ borderRadius: 5, background: 'rgb(98, 192, 216)' }}
                                        >
                                            Tìm kiếm{' '}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <TableContainer component={Paper} className={styles.table} style={{ marginTop: '25px' }}>
                            <Table sx={{ minWidth: 1200 }} aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={styles.tableCell + ' text-center'}>STT</TableCell>
                                        <TableCell className={styles.tableCell + ' text-center'}>
                                            Tên thiết bị
                                        </TableCell>
                                        <TableCell className={styles.tableCell + ' text-center'}>Mô tả</TableCell>
                                        <TableCell className={styles.tableCell + ' text-center'}>Số lượng</TableCell>
                                        <TableCell className={styles.tableCell + ' text-center'}>
                                            Chủ sở hữu chính
                                        </TableCell>
                                        <TableCell className={styles.tableCell + ' text-center'}>Lựa chọn</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {visibleHardwares?.length > 0 &&
                                        visibleHardwares?.map((hardware, index) => (
                                            <TableRow
                                                key={index}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell className={styles.tableCell + ' text-center'}>
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell className={styles.tableCell + ' text-center'}>
                                                    {hardware.deviceName}
                                                </TableCell>
                                                <TableCell className={styles.tableCell + ' text-center'}>
                                                    {hardware.description}
                                                </TableCell>
                                                <TableCell className={styles.tableCell + ' text-center'}>
                                                    {hardware.NumberOfDevice}
                                                </TableCell>
                                                <TableCell className={styles.tableCell + ' text-center'}>
                                                    {hardware.mainowner}
                                                </TableCell>
                                                <TableCell className={styles.tableCell + ' text-center'}>
                                                    <div className={styles.cellAction}>
                                                        {userPosition === 'TRUONG_PHONG' &&
                                                        userDepartment === 'PHONG_KY_THUAT' ? (
                                                            <>
                                                                <Button
                                                                    className={styles.editButton}
                                                                    onClick={() => handleClickOpen('edit', hardware)}
                                                                >
                                                                    Chỉnh sửa
                                                                </Button>
                                                                <Button
                                                                    onClick={() => handleDelete(hardware._id)}
                                                                    className={styles.deleteButton}
                                                                >
                                                                    Xóa
                                                                </Button>
                                                            </>
                                                        ) : (
                                                            <Button
                                                                className={styles.viewButton}
                                                                onClick={() => handleClickOpen('view', hardware)}
                                                            >
                                                                Xem chi tiết
                                                            </Button>
                                                        )}
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

export default Hardware;
