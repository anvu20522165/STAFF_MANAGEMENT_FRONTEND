import React from 'react'
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {deleteNotification} from "../../../../services/notification";

const ConfirmDeleteDialog =
    React.forwardRef(({
                          onDeleteSuccess = () => {
                          },
                          onError = () => {
                          },
                          ...props
                      }, ref) => {

        // state
        const [open, setOpen] = React.useState(false)
        const [notification, setNotification] = React.useState(null)
        const [isDeleting, setIsDeleting] = React.useState(false)


        /**
         * handle submit
         *
         * @type {(function())|*}
         */
        const handleSubmit = React.useCallback(() => {
            if (notification._id) {
                setIsDeleting(true)
                deleteNotification(notification._id).then(() => {
                    onDeleteSuccess(notification)
                    setOpen(false)
                }).catch(() => {
                    onError()
                }).finally(() => {
                    setIsDeleting(false)
                })
            }
        }, [notification, onError, onDeleteSuccess])

        /**
         * ref handler
         */
        React.useImperativeHandle(ref, () => ({
            open: (notificationData) => {
                // set data
                setNotification(notificationData || null)
                setOpen(true)
            }
        }))

        return <>
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
                <DialogTitle>
                    Xác nhận xóa
                </DialogTitle>

                <DialogContent>
                    Dữ liêụ sẽ không thể khôi phục, bạn có đồng ý xóa?
                </DialogContent>

                <DialogActions>
                    <div className='d-flex gap-1'></div>
                    <Button variant='outline' onClick={() => setOpen(false)}>Hủy</Button>
                    <Button disabled={isDeleting}
                            variant='contained'
                            color='error'
                            onClick={handleSubmit}>
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    })

export default ConfirmDeleteDialog