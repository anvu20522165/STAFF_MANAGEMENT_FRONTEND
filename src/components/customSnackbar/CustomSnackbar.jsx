import React from 'react';
import { Snackbar, SnackbarContent } from '@mui/material';

const CustomSnackbar = ({ open, message, severity, onClose }) => {
    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            open={open}
            autoHideDuration={1500}
            onClose={onClose}
        >
            <SnackbarContent
                style={{
                    backgroundColor: severity === 'success' ? '#4CAF50' : '#F44336',
                }}
                message={message}
            />
        </Snackbar>
    );
};

export default CustomSnackbar;
