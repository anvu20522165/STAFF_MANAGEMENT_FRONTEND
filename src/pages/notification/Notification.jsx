import React, {useState} from 'react';
import {Button,} from '@mui/material';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import CustomSnackbar from '../../components/customSnackbar/CustomSnackbar';
import DataTableNotification from "../../components/datatable/datatable_notifications/DataTableNotification";
import {NotificationType} from "../../constants/notification";
import ActionDialog from "./components/action-dialog";
import ConfirmDeleteDialog from "./components/confirm-delete-dialog";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {jwtDecode} from "jwt-decode";

const actionAbleRoles = ["TRUONG_PHONG", "CEO"]

const Notification = () => {
    // state user access
    const [userAccess, setUserAccess] = React.useState(null)

    // states
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const handleSnackbarOpen = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setOpenSnackbar(true);
    };

    // memo
    const actionAble = React.useMemo(() => {
        return actionAbleRoles
            .map(o => o.toLowerCase())
            .includes((userAccess?.position || '').toLowerCase())
    }, [userAccess?.position])

    // ref
    const deleteConfirmRef = React.useRef({
        open: () => {

        }
    })
    const actionDialogRef = React.useRef({
        open: () => {
        }
    })
    const tableInternalRef = React.useRef({
        reload: () => {
        }
    })
    const tableNotifyRef = React.useRef({
        reload: () => {
        }
    })
    const tableFelicitationRef = React.useRef({
        reload: () => {
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
     * handle update success
     *
     * @type {(function())|*}
     */
    const handleActionSuccess = React.useCallback((val, title) => {
        handleSnackbarOpen(title || 'Successfully', 'success')
        switch (val.type) {
            case NotificationType.Notify:
                tableNotifyRef.current?.reload()
                break
            case NotificationType.Internal:
                tableInternalRef.current?.reload()
                break
            case NotificationType.Felicitation:
                tableFelicitationRef.current?.reload()
                break
            default:
                break
        }
    }, [])

    /**
     * handle error
     *
     * @type {(function(): void)|*}
     */
    const handleError = React.useCallback(() => {
        handleSnackbarOpen('Có lỗi xảy ra', 'error')
    }, [])

    /**
     * get current position
     *
     * @type {(function(): void)|*}
     */
    const getCurrentPosition = React.useCallback(async () => {
        try {
            const accessToken = await AsyncStorage.getItem('accessToken');
            const decodedToken = jwtDecode(accessToken);
            setUserAccess(decodedToken)
        } catch (e) {
            console.error(e)
        }
    }, [])

    /**
     * initial
     */
    React.useEffect(() => {
        getCurrentPosition()
    }, [getCurrentPosition])

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
                            disabled={!actionAble}
                            style={{borderRadius: 5, background: 'rgb(98, 192, 216)'}}
                            variant="contained"
                            onClick={() => actionDialogRef.current?.open()}
                        >
                            Thêm mới
                        </Button>
                    </div>

                    {/*region tables*/}
                    <div>
                        <DataTableNotification ref={tableInternalRef} className='mb-3'
                                               hideActions={!actionAble}
                                               apiParam={NotificationType.Internal}
                                               title='Thông tin nội bộ'
                                               onEdit={(val) => actionDialogRef.current?.open(val)}
                                               onDelete={(val) => deleteConfirmRef.current?.open(val)}
                        />

                        <DataTableNotification ref={tableNotifyRef} className='mb-3'
                                               hideActions={!actionAble}
                                               apiParam={NotificationType.Notify}
                                               title='Thông báo'
                                               onEdit={(val) => actionDialogRef.current?.open(val)}
                                               onDelete={(val) => deleteConfirmRef.current?.open(val)}/>

                        <DataTableNotification ref={tableFelicitationRef} className='mb-3'
                                               hideActions={!actionAble}
                                               apiParam={NotificationType.Felicitation}
                                               title='Khen thưởng'
                                               onEdit={(val) => actionDialogRef.current?.open(val)}
                                               onDelete={(val) => deleteConfirmRef.current?.open(val)}/>
                    </div>
                    {/*endregion tables*/}

                </div>
            </div>

            {/*region dialog*/}
            <ActionDialog ref={actionDialogRef}
                          onUpdateSuccess={(val) => handleActionSuccess(val, 'Cập nhật thành công')}
                          onCreateSuccess={(val) => handleActionSuccess(val, 'Thêm mới thành công')}
                          onError={handleError}/>

            <ConfirmDeleteDialog ref={deleteConfirmRef}
                                 onDeleteSuccess={(val) => handleActionSuccess(val, 'Xóa thành công')}
                                 onError={handleError}
            />
            {/*endregion dialog*/}
        </div>
    );
};

export default Notification
