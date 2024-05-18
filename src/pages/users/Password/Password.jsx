// export default Login;
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import './Password.css';
import { Link } from 'react-router-dom';
import { preventDefault } from '@fullcalendar/core/internal';
const Password = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const { userId } = useParams(); //lấy id từ url
    const [token, setToken] = useState('');

    //if token is still valid then redirect to home screen
    useEffect(() => {
        async function checkAuth() {
            try {
                const accessToken = await AsyncStorage.getItem('accessToken');
                setToken(accessToken);
                const decodedToken = jwtDecode(accessToken);
                console.log(decodedToken);
                let curTime = Date.now() / 1000;
                if (decodedToken.exp < curTime) {
                    console.log('need to refresh token');

                    window.location.replace('/login');
                }
            } catch (error) {
                // Handle errors here
                console.log('Vừa loggout hoặc hết hạn token');
            }
        }
        checkAuth();
    }, []);

    const handleChangePassword = (token) => {
        const updatePassword = {
            oldPassword: oldPassword,
            newPassword: newPassword,
        };
        console.log(updatePassword);
        axios
            .put(`http://localhost:5555/v1/auth/password/${userId}`, updatePassword, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                window.location.replace('/');
            })
            .catch((err) => {
                window.alert('Wrong password !');
                console.error(err);
            });
    };

    const handleChangePasswordDefault = () => {
        axios
            .put(`http://localhost:5555/v1/user/defaultPassword/${userId}`)
            .then((response) => {
                window.location.replace('/');
            })
            .catch((err) => {
                window.alert('Wrong password !');
                console.error(err);
            });
    };
    return (
        <section className="login-container">
            <div className="login-title">Thay mật khẩu</div>
            <div>
                <label>Mật khẩu cũ</label>
                <input type="text" placeholder="Enter your username" onChange={(e) => setOldPassword(e.target.value)} />
                <label>Mật khẩu mới</label>
                <input
                    type="password"
                    placeholder="Enter your password"
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <Button type="submit" onClick={() => handleChangePassword(token)}>
                    {' '}
                    Xác nhận{' '}
                </Button>
            </div>
            <Button style={{ color: 'blue' }} onClick={() => handleChangePasswordDefault()}>
                Cập nhật lại về mật khẩu mặc định
            </Button>
        </section>
    );
};

export default Password;
