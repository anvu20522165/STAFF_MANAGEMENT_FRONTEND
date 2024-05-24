import React, {useState} from 'react';
import {Button, Grid,} from '@mui/material';
import styles from '../../components/datatable/datatable_user/datatable_user.module.css';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import CustomSnackbar from '../../components/customSnackbar/CustomSnackbar';
import {getAllNotifications} from "../../services/notification";
import 'bootstrap/dist/css/bootstrap.css';
import {DataGrid} from "@mui/x-data-grid";


const Notification = () => {
    // states
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [notifications, setNotifications] = React.useState([])

    // loading states
    const [isLoadingFetchNotification, setIsLoadingFetchNotification] = React.useState(false)


    const columns = [
        {field: 'id', headerName: 'ID', width: 70},
        {field: 'firstName', headerName: 'First name', width: 130},
        {field: 'lastName', headerName: 'Last name', width: 130},
        {
            field: 'age',
            headerName: 'Age',
            type: 'number',
            width: 90,
        },
        {
            field: 'fullName',
            headerName: 'Full name',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 160,
        },
    ];

    const rows = [
        {id: 1, lastName: 'Snow', firstName: 'Jon', age: 35},
        {id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42},
        {id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45},
        {id: 4, lastName: 'Stark', firstName: 'Arya', age: 16},
        {id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null},
        {id: 6, lastName: 'Melisandre', firstName: null, age: 150},
        {id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44},
        {id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36},
        {id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65},
    ];


    /**
     * handle snackbar close
     * @param event
     * @param reason
     */
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    /**
     * fetch all notifications
     *
     * @type {(function())|*}
     */
    const fetchNotifications = React.useCallback(() => {
        setIsLoadingFetchNotification(true)
        getAllNotifications().then(({data}) => {
            setNotifications(data || [])
        }).finally(() => {
            setIsLoadingFetchNotification(false)
        })
    }, [])


    React.useEffect(() => {
        fetchNotifications()
    }, [])

    return (
        <div className="home">
            <Sidebar/>
            <CustomSnackbar
                open={openSnackbar}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={handleSnackbarClose}
            />

            <div className="homeContainer">
                <Navbar/>
                <div className={styles.servicePage}>
                    <div className='d-flex justify-content-between gap-3'>
                        <b>Quản lý thông báo</b>
                        <Button
                            style={{borderRadius: 5, background: 'rgb(98, 192, 216)'}}
                            variant="contained"
                        >
                            Thêm mới
                        </Button>
                    </div>

                    <div className='w-100' style={{height: 400, width: '100%'}}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            initialState={{
                                pagination: {
                                    paginationModel: {page: 0, pageSize: 5},
                                },
                            }}
                            pageSizeOptions={[5, 10]}
                            checkboxSelection
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notification
