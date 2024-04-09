import React, { useState, useEffect, useContext } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import styles from '../../components/datatable/datatable_user/datatable_user.module.css';
import Button from 'react-bootstrap/Button';
import ReactPaginate from 'react-paginate';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { appContext } from '../../context/authenticated';

const Announcement = () => {
    const [tableData, setTableData] = useState([]);
    const [perPage, setPerPage] = useState(6);
    const [currentPage, setCurrentPage] = useState(1);
    const { isAuth } = useContext(appContext);
    console.log(isAuth);
    const [numOfTotalPages, setNumOfTotalPages] = useState(0);

    const loadAnnouncements = async () => {
        try {
            const accessToken = await AsyncStorage.getItem('accessToken'); // Lấy accessToken từ AsyncStorage

            const response = await axios.get('http://localhost:5555/v1/announcement/get-all-announcements', {
                headers: {
                    Authorization: `Bearer ${isAuth}`,
                },
            });

            setTableData(response.data);
            console.log('aaa', response.data);
            setNumOfTotalPages(Math.ceil(response.data.length / perPage));
        } catch (error) {
            console.log(error.response.data);
        }
    };

    useEffect(() => {
        loadAnnouncements();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected + 1);
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
                            <b>Lịch Biểu</b>
                        </div>

                        <TableContainer component={Paper} className={styles.table}>
                            <Table sx={{ minWidth: 1200 }} aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={styles.tableCell + ' text-center'}>STT</TableCell>
                                        <TableCell className={styles.tableCell + ' text-center'}>
                                            Tên thông báo
                                        </TableCell>
                                        <TableCell className={styles.tableCell + ' text-center'}>
                                            Ngày bắt đầu
                                        </TableCell>
                                        <TableCell className={styles.tableCell + ' text-center'}>Ghi chú</TableCell>
                                        <TableCell className={styles.tableCell + ' text-center'}>Nhân viên</TableCell>
                                        <TableCell className={styles.tableCell + ' text-center'}>Phòng ban</TableCell>
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
                                                    {new Date(announcement.startAt).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className={styles.tableCell + ' text-center'}>
                                                    {announcement.note}
                                                </TableCell>
                                                <TableCell className={styles.tableCell + ' text-center'}>
                                                    {announcement.listEmployee.join(', ')}
                                                </TableCell>
                                                <TableCell className={styles.tableCell + ' text-center'}>
                                                    {announcement.department}
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
