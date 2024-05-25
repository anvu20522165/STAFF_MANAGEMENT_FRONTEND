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


const MOCK_DATA = [
    {
        "_id": "66505cca32d14fbc61a33950",
        "title": "This iss title of notification",
        "message": "This. is message of this notification. Lorema ipsum dolor.",
        "type": "Internal",
        "createdBy": "664bd6623bafe001775316c0",
        "sentAt": "2024-05-24T09:24:26.922Z",
        "createdAt": "2024-05-24T09:24:26.927Z",
        "updatedAt": "2024-05-24T09:24:26.927Z",
        "__v": 0
    },
    {
        "_id": "66505d987ee35b8725b1f18a",
        "title": "This iss title of notification 2",
        "message": "This. is message of this notification 2 . Lorema ipsum dolor.",
        "type": "Internal",
        "createdBy": "664bd6623bafe001775316c0",
        "sentAt": "2024-05-24T09:27:52.697Z",
        "createdAt": "2024-05-24T09:27:52.700Z",
        "updatedAt": "2024-05-24T09:27:52.700Z",
        "__v": 0
    },
    {
        "_id": "6650ae420971244e9ed5b158",
        "title": "This iss title of notification 2",
        "message": "This. is message of this notification 2 . Lorema ipsum dolor.",
        "type": "Internal",
        "createdBy": "664bd6623bafe001775316c0",
        "sentAt": "2024-05-24T15:12:02.263Z",
        "createdAt": "2024-05-24T15:12:02.267Z",
        "updatedAt": "2024-05-24T15:12:02.267Z",
        "__v": 0
    }
]


const DataTableNotification = ({type}) => {
    // state
    const [notifications, setNotifications] = React.useState([...MOCK_DATA, ...MOCK_DATA, ...MOCK_DATA, ...MOCK_DATA, ...MOCK_DATA, ...MOCK_DATA, ...MOCK_DATA])

    // loading states
    const [isLoadingFetchNotification, setIsLoadingFetchNotification] = React.useState(false)

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
        setIsLoadingFetchNotification(true)
        getAllNotifications().then(({data}) => {
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

    return <>
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
                    </TableRow>
                </TableHead>

                <TableBody>
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
                                <TableCell></TableCell>
                            </TableRow>)
                    }
                </TableBody>
            </Table>
        </TableContainer>
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
            activeClassName={styles.active}

        />
    </>
}
export default DataTableNotification
