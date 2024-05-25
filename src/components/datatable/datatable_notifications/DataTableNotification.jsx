import React, {useState} from 'react'
import Paper from "@mui/material/Paper";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableBody from "@mui/material/TableBody";
import Moment from "react-moment";
import ReactPaginate from "react-paginate";
import styles from "../datatable_movies/datatable_movie.module.css";
import {getAllNotifications} from "../../../services/notification";
import {CircularProgress, IconButton} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';


const DataTableNotification =
    React.forwardRef(({
                          type,
                          title,
                          className = '',
                          onDelete = () => {
                          },
                          onEdit = () => {
                          }
                      }, ref) => {
        // state
        const [notifications, setNotifications] = React.useState([])

        // loading states
        const [isLoadingFetchNotification, setIsLoadingFetchNotification] = React.useState(true)

        // paging
        const [svtPerPage, setSvtPerPage] = useState(7)
        const [CsvtPerPage, setCSvtPerPage] = useState(1)
        const numOfToTalPages = Math.ceil(notifications.length / svtPerPage);
        const indexOfLastSVT = CsvtPerPage * svtPerPage;
        const indexOfFirstSVT = indexOfLastSVT - svtPerPage;
        const visibleSVT = notifications.slice(indexOfFirstSVT, indexOfLastSVT)

        /**
         * handle change page
         * @param selected
         */
        const changePage = ({selected}) => {
            setCSvtPerPage(selected + 1);
        };

        /**
         * fetch notifications
         *
         * @type {(function())|*}
         */
        const fetchNotification = React.useCallback(() => {
            setCSvtPerPage(1)
            setNotifications([])
            setIsLoadingFetchNotification(true)
            getAllNotifications(type).then(({data}) => {
                setNotifications(data || [])
            }).finally(() => {
                setIsLoadingFetchNotification(false)
            })
        }, [])

        /**
         * use effect initial
         */
        React.useEffect(() => {
            fetchNotification()
        }, [fetchNotification])


        /**
         * handle ref
         */
        React.useImperativeHandle(ref, () => ({
            reload: () => {
                fetchNotification()
            }
        }))

        return <>
            <div className={`d-flex flex-column ${className}`}>
                <h3 className='fw-bold mb-3'>{title || type}</h3>
                <TableContainer component={Paper}>
                    <Table aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Tiêu đề
                                </TableCell>
                                <TableCell>
                                    Nội dung
                                </TableCell>
                                <TableCell>
                                    Ngày tạo
                                </TableCell>
                                <TableCell>
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {isLoadingFetchNotification && <TableRow>
                                <TableCell colSpan={4} className='text-center my-3 py-3 text-secondary h-25 w-100'>
                                    <div className='w-100 d-flex justify-content-center align-items-center'
                                         style={{minHeight: '100px'}}>
                                        <CircularProgress/>
                                    </div>
                                </TableCell>
                            </TableRow>}
                            {(!visibleSVT.length && !isLoadingFetchNotification) && <TableRow>
                                <TableCell colSpan={4} className='text-center my-3 py-3 text-secondary'>
                                    <p className='text-center my-3 text-secondary'>Không có dữ liệu</p>
                                </TableCell>
                            </TableRow>}
                            {
                                visibleSVT.map((noti, idx) =>
                                    <TableRow key={idx}>
                                        <TableCell>
                                            {noti.title}
                                        </TableCell>
                                        <TableCell>
                                            {noti.message}
                                        </TableCell>
                                        <TableCell>
                                            <Moment format="HH:mm DD/MM/YYYY">
                                                {noti.createdAt}
                                            </Moment>
                                        </TableCell>
                                        <TableCell align='right'>
                                            <div className='d-flex gap-1 justify-content-end'>
                                                <IconButton aria-label="edit" title='Cập nhật thông báo'
                                                            onClick={() => onEdit(noti)}>
                                                    <EditIcon className='text-info'/>
                                                </IconButton>
                                                <IconButton aria-label="delete" title='Xóa thông báo'
                                                            onClick={() => onDelete(noti)}
                                                >
                                                    <DeleteIcon className='text-danger'/>
                                                </IconButton>
                                            </div>
                                        </TableCell>
                                    </TableRow>)
                            }
                        </TableBody>
                    </Table>
                </TableContainer>

                <div>
                    <ReactPaginate
                        previousLabel={"Prev"}
                        nextLabel={"Next"}
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
                        activeClassName={styles.active}/>
                </div>

            </div>
        </>
    })
export default DataTableNotification
