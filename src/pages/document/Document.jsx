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
import './Document.scss';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';

const Document = () => {
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
    const [editDocument, setEditDocument] = useState(null);
    const [actionType, setActionType] = useState('add');
    let [visibleDocuments, setVisibleDocument] = useState([]);
    const [isViewMode, setIsViewMode] = useState(false);

    const location = useLocation();
    const params = queryString.parse(location.search);
    const [nameDocument, setNameDocument] = useState(() => {
        return params.nameDocument;
    });
    const [Source, setSource] = useState(() => {
        return params.Source;
    });

    const indexOfLastDocument = currentPage * perPage;
    const indexOfFirstDocument = indexOfLastDocument - perPage;
    visibleDocuments = tableData?.slice(indexOfFirstDocument, indexOfLastDocument);

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
            nameDocument: nameDocument || '',
            Source: Source || '',
        };
        let url = `http://localhost:5555/v1/document/get-all-documents?`;

        // Check nameAnnouncement
        if (searchData.nameDocument !== undefined && searchData.nameDocument !== 'undefined') {
            url = url + `nameDocument=${searchData.nameDocument}`;
        } else {
            url = url + `nameDocument=`;
            setNameDocument('');
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

    const loadDocumnet = async () => {
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
        window.location.replace(`/document?nameDocument=${nameDocument}&Source=${Source}`);
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
        loadDocumnet();
        getUserInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [formData, setFormData] = useState({
        nameDocument: '',
        Source: '',
        NumberOfDocument: '',
    });

    const handleClickOpen = (type, document = null) => {
        if (type === 'edit' && document) {
            setFormData({
                nameDocument: document.nameDocument || '',
                Source: document.Source || '',
                NumberOfDocument: document.NumberOfDocument || '',
            });
            setEditDocument(document);
            setActionType('edit');
        } else if (type === 'view' && document) {
            setFormData({
                nameDocument: document.nameDocument || '',
                Source: document.Source || '',
                NumberOfDocument: document.NumberOfDocument || '',
            });
            setEditDocument(null);
            setActionType('view');
            setIsViewMode(true);
        } else {
            setFormData({
                nameDocument: '',
                Source: '',
                NumberOfDocument: '',
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
            const response = await axios.delete(`http://localhost:5555/v1/document/delete-document/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.status === 200) {
                setVisibleDocument((prevAnnouncements) =>
                    prevAnnouncements.filter((announcement) => announcement._id !== id),
                );
                handleSnackbarOpen('Xóa tài liệu thành công!', 'success');
            }
            loadDocumnet();
        } catch (error) {
            handleSnackbarOpen('Đã có lỗi xảy ra khi xóa tài liệu. Vui lòng thử lại sau.', 'error');
        }
    };

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected + 1);
    };

    const handleClose = () => {
        setOpen(false);
        setEditDocument(null);
        setActionType('add');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const accessToken = await AsyncStorage.getItem('accessToken');
            if (actionType === 'add') {
                await axios.post('http://localhost:5555/v1/document/add-document', formData, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
            } else if (actionType === 'edit') {
                await axios.put(`http://localhost:5555/v1/document/update-document/${editDocument._id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
            }
            handleClose(); // Đóng dialog sau khi thêm mới hoặc cập nhật thành công
            loadDocumnet();
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
                            <b>Quản lý tài liệu</b>
                            {userPosition === 'TRUONG_PHONG' && userDepartment === 'PHONG_NHAN_SU' && (
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
                                    ? 'Thêm mới tài liệu'
                                    : actionType === 'view'
                                    ? 'Xem chi tiết tài liệu'
                                    : 'Chỉnh sửa tài liệu'}
                            </DialogTitle>
                            <DialogContent>
                                <form onSubmit={handleSubmit} style={{ width: '450px' }}>
                                    <div style={{ width: '100%', marginBottom: '30px' }}>
                                        <TextField
                                            label="Tên tài liệu"
                                            type="text"
                                            name="nameDocument"
                                            value={formData.nameDocument || ''}
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
                                            label="Nguồn tài liệu"
                                            type="text"
                                            name="Source"
                                            value={formData.Source || ''}
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
                                            name="NumberOfDocument"
                                            value={formData.NumberOfDocument || ''}
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
                                    <div className="itemKey">Tên tài liệu:</div>
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
                                            value={nameDocument}
                                            type="text"
                                            placeholder="Nhập tên tài liệu"
                                            onChange={(e) => setNameDocument(e.target.value)}
                                        />
                                    </div>
                                    <div className="itemKey">Nguồn tài liệu:</div>
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
                                            value={Source}
                                            type="text"
                                            placeholder="Nhập nguồn tài liệu"
                                            onChange={(e) => setSource(e.target.value)}
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
                                            Tên tài liệu
                                        </TableCell>
                                        <TableCell className={styles.tableCell + ' text-center'}>
                                            Nguồn tài liệu
                                        </TableCell>
                                        <TableCell className={styles.tableCell + ' text-center'}>Số lượng</TableCell>
                                        <TableCell className={styles.tableCell + ' text-center'}>Lựa chọn</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {visibleDocuments?.length > 0 &&
                                        visibleDocuments?.map((document, index) => (
                                            <TableRow
                                                key={index}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell className={styles.tableCell + ' text-center'}>
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell className={styles.tableCell + ' text-center'}>
                                                    {document.nameDocument}
                                                </TableCell>
                                                <TableCell className={styles.tableCell + ' text-center'}>
                                                    {document.Source}
                                                </TableCell>
                                                <TableCell className={styles.tableCell + ' text-center'}>
                                                    {document.NumberOfDocument}
                                                </TableCell>
                                                <TableCell className={styles.tableCell + ' text-center'}>
                                                    <div className={styles.cellAction}>
                                                        {userPosition !== 'TRUONG_PHONG' ||
                                                            (userDepartment !== 'PHONG_NHAN_SU' && (
                                                                <Button
                                                                    className={styles.viewButton}
                                                                    onClick={() => handleClickOpen('view', document)}
                                                                >
                                                                    Xem chi tiết
                                                                </Button>
                                                            ))}
                                                        {userPosition === 'TRUONG_PHONG' &&
                                                            userDepartment === 'PHONG_NHAN_SU' && (
                                                                <>
                                                                    <Button
                                                                        className={styles.editButton}
                                                                        onClick={() =>
                                                                            handleClickOpen('edit', document)
                                                                        }
                                                                    >
                                                                        Chỉnh sửa
                                                                    </Button>
                                                                    <Button
                                                                        onClick={() => handleDelete(document._id)}
                                                                        className={styles.deleteButton}
                                                                    >
                                                                        Xóa
                                                                    </Button>
                                                                </>
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

export default Document;
