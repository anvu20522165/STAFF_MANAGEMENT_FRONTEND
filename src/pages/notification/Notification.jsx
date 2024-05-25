import React, {useState} from 'react';
import {Button,} from '@mui/material';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import CustomSnackbar from '../../components/customSnackbar/CustomSnackbar';
import {getAllNotifications} from "../../services/notification";
import DataTableNotification from "../../components/datatable/datatable_notifications/DataTableNotification";
import {NotificationType} from "../../constants/notification";
import ActionDialog from "./components/action-dialog";


const Notification = () => {
    // states
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [notifications, setNotifications] = React.useState([])

    // loading states
    const [isLoadingFetchNotification, setIsLoadingFetchNotification] = React.useState(false)

    // ref
    const actionDialogRef = React.useRef({
        open: () => {
        }
    })

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
                            onClick={() => actionDialogRef.current?.open()}
                        >
                            Thêm mới
                        </Button>
                    </div>

                    <div>
                        <DataTableNotification className='mb-3' type={NotificationType.Internal}
                                               title='Thông tin nội bộ'
                                               onEdit={actionDialogRef.current?.open}/>

                        <DataTableNotification className='mb-3' type={NotificationType.Notify}
                                               title='Thông báo'
                                               onEdit={actionDialogRef.current?.open}/>

                        <DataTableNotification className='mb-3' type={NotificationType.Felicitation}
                                               title='Khen thưởng'
                                               onEdit={actionDialogRef.current?.open}/>
                    </div>
                </div>
            </div>

            <ActionDialog ref={actionDialogRef}/>
        </div>
    );
};

export default Notification
