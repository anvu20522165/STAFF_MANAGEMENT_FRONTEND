import React from 'react'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    TextField
} from "@mui/material";
import {getAllUsers} from "../../../../services/user";
import {NotificationType} from "../../../../constants/notification";
import {createNotification, updateNotification} from "../../../../services/notification";

const DefaultForm = {
    title: '',
    message: '',
    type: ''
}

const NotificationTypeRadioLabel = {
    [NotificationType.Internal]: 'Nội bộ',
    [NotificationType.Notify]: 'Thông báo',
    [NotificationType.Felicitation]: 'Khen thưởng'
}

const ActionDialog = React.forwardRef((props, ref) => {
    // state
    const [open, setOpen] = React.useState(false)
    const [notification, setNotification] = React.useState(DefaultForm)
    const [users, setUsers] = React.useState([])
    const [usersSelected, setUsersSelected] = React.useState([])
    const [selectedType, setSelectedType] = React.useState()

    // error message
    const [validateMessage, setValidateMessage] = React.useState({
        type: '',
        title: '',
        message: ''
    })

    // submit loading
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    /**
     * get all users
     *
     * @type {(function(): void)|*}
     */
    const fetchUsers = React.useCallback(() => {
        getAllUsers().then(({data}) => {
            setUsers(data)
        })
    }, [])


    /**
     * handle select value
     *
     * @type {(function(*))|*}
     */
    const handleSelectUser = React.useCallback((value) => {
        setUsersSelected(typeof value === 'string' ? value.split(',') : value)
    }, [])

    /**
     * validate form
     *
     * @type {(function())|*}
     */
    const validateForm = React.useCallback(() => {
        const keys = ['title', 'message']
        let isValid = true
        keys.forEach(key => {
            if (notification[key]) {
                setValidateMessage(prevState => ({
                    ...prevState,
                    [key]: ''
                }))
            } else {
                setValidateMessage(prevState => ({
                    ...prevState,
                    [key]: 'Vui lòng không để trống'
                }))
                isValid = false
            }
        })
        if (selectedType) {
            setValidateMessage(prevState => ({
                ...prevState,
                type: ''
            }))
        } else {
            setValidateMessage(prevState => ({
                ...prevState,
                type: 'Vui lòng chọn loại thông báo'
            }))
            isValid = false
        }
        return isValid
    }, [notification, selectedType])


    /**
     * handle submit
     *
     * @type {(function())|*}
     */
    const handleSubmit = React.useCallback(() => {
        if (!validateForm()) {
            return;
        }

        // prepare payload
        const payload = {
            ...notification,
            type: selectedType,
            employments: usersSelected
        }

        if (notification._id) {
            // for updating case
            setIsSubmitting(true)
            updateNotification(notification._id, payload).then(({data}) => {
                props?.onUpdateSuccess?.(data)
                setOpen(false)
            }).finally(() => {
                setIsSubmitting(false)
            })
        } else {
            // for creating case
            setIsSubmitting(true)
            createNotification(payload).then(({data}) => {
                props?.onCreateSuccess?.(data)
                setOpen(false)
            }).finally(() => {
                setIsSubmitting(false)
            })

        }

    }, [validateForm, usersSelected, notification, selectedType])

    /**
     * ref handler
     */
    React.useImperativeHandle(ref, () => ({
        open: (notificationData) => {
            // set data
            setUsersSelected(notificationData?.employments?.map(o => o._id) || [])
            setNotification(notificationData || DefaultForm)
            setSelectedType(notificationData?.type || null)
            setOpen(true)
        }
    }))

    /**
     * user effect init
     */
    React.useEffect(() => {
        setOpen(props.open || false)
    }, [props.open])

    /**
     * use effect for init
     */
    React.useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    return <>
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
            <DialogTitle>
                {notification?._id ? 'Cập nhật thông báo' : 'Thêm thông báo'}
            </DialogTitle>

            <DialogContent>
                <div className='my-3'>
                    <RadioGroup
                        row
                        aria-labelledby="radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        value={selectedType}
                    >
                        {
                            Object.keys(NotificationTypeRadioLabel).map((key, idx) =>
                                <FormControlLabel key={idx} value={key} control={<Radio/>}
                                                  label={NotificationTypeRadioLabel[key]}
                                                  onChange={() => setSelectedType(key)}
                                                  disabled={!!notification?._id}/>
                            )
                        }
                    </RadioGroup>
                    {validateMessage.type && <p className='text-danger'>{validateMessage.type}</p>}
                </div>

                <div className='my-3'>
                    <TextField className='w-100' label="Tiêu đề" variant="outlined"
                               value={notification.title}
                               onChange={({target: {value}}) => setNotification(prevState => ({
                                   ...prevState,
                                   title: value
                               }))}
                    />
                    {validateMessage.title && <p className='text-danger'>{validateMessage.title}</p>}
                </div>

                <div className='my-3'>
                    <TextField
                        className='w-100'
                        label="Nội dung"
                        multiline
                        rows={4}
                        value={notification.message}
                        onChange={({target: {value}}) => setNotification(prevState => ({
                            ...prevState,
                            message: value
                        }))}
                    />
                    {validateMessage.message && <p className='text-danger'>{validateMessage.message}</p>}
                </div>

                {
                    ![NotificationType.Internal].includes(selectedType) && <div className='my-3'>
                        <div>Chọn nhân viên gửi:</div>
                        <Select
                            id="demo-multiple-name"
                            multiple
                            className='w-100'
                            label='Chọn người dùng'
                            value={usersSelected}
                            onChange={({target: {value}}) => handleSelectUser(value)}
                        >
                            {users.map((user) => (
                                <MenuItem
                                    key={user._id}
                                    value={user._id}
                                >
                                    {user.fullname}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                }
            </DialogContent>

            <DialogActions>
                <div className='d-flex gap-1'></div>
                <Button variant='outline' onClick={() => setOpen(false)}>Hủy</Button>
                <Button variant='contained' onClick={handleSubmit}> {notification._id ? 'Cập nhật' : 'Lưu'}</Button>
            </DialogActions>
        </Dialog>
    </>
})

export default ActionDialog