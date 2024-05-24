import React from 'react'
import {Dialog, DialogTitle} from "@mui/material";


const ActionDialog = React.forwardRef((props, ref) => {
    // state
    const [open, setOpen] = React.useState(false)
    const [notification, setNotification] = React.useState(null)

    /**
     * ref handler
     */
    React.useImperativeHandle(ref, () => ({
        open: (notificationData) => {
            setNotification(notificationData)
            setOpen(true)
        }
    }))

    /**
     * user effect intial
     */
    React.useEffect(() => {
        setOpen(props.open || false)
    }, [props.open])

    return <>
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>
                Them thong bao
            </DialogTitle>
        </Dialog>
    </>
})

export default ActionDialog