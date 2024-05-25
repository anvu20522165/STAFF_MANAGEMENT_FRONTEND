import React, {useState} from 'react';
import {Button,} from '@mui/material';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import CustomSnackbar from '../../components/customSnackbar/CustomSnackbar';
import {getAllNotifications} from "../../services/notification";
import DataTableNotification from "../../components/datatable/datatable_notifications/DataTableNotification";
import {NotificationType} from "../../constants/notification";


const Notification = () => {
    // states
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [notifications, setNotifications] = React.useState([])

    // loading states
    const [isLoadingFetchNotification, setIsLoadingFetchNotification] = React.useState(false)


    const columns = [
        {field: 'id', headerName: 'ID',},
        {field: 'firstName', headerName: 'First name',},
        {field: 'lastName', headerName: 'Last name',},
    ];

    const rows = [
        {id: 1, lastName: 'Snow', firstName: 'Jon'},
        {id: 2, lastName: 'Lannister', firstName: 'Cersei'},
        {id: 3, lastName: 'Lannister', firstName: 'Jaime'},
        {id: 4, lastName: 'Stark', firstName: 'Arya'},
        {id: 5, lastName: 'Targaryen', firstName: 'Daenerys',},
        {id: 6, lastName: 'Melisandre', firstName: null},
        {id: 7, lastName: 'Clifford', firstName: 'Ferrara'},
        {id: 8, lastName: 'Frances', firstName: 'Rossini'},
        {id: 9, lastName: 'Roxie', firstName: 'Harvey'},
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
                <div className='p-3'>
                    <div className='d-flex justify-content-between gap-3 mb-3 pb-3 border-bottom'>
                        <b className='text-secondary fs-3'>Quản lý thông báo</b>
                        <Button
                            style={{borderRadius: 5, background: 'rgb(98, 192, 216)'}}
                            variant="contained"
                        >
                            Thêm mới
                        </Button>
                    </div>

                    <div>
                        <DataTableNotification className='mb-3' type={NotificationType.Internal}
                                               title='Thông tin nội bộ'/>

                        <DataTableNotification className='mb-3' type={NotificationType.Notify}
                                               title='Thông báo'/>

                        <DataTableNotification className='mb-3' type={NotificationType.Felicitation}
                                               title='Khen thưởng'/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notification
