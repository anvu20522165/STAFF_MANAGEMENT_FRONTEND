import './navbar.scss';
import { Link } from 'react-router-dom';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import { DarkModeContext } from '../../context/darkModeContext';
import { useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Navbar = () => {
    const { dispatch } = useContext(DarkModeContext);
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState();
    const [avt, setAvt] = useState();

    //if token is still valid then redirect to home screen
    useEffect(() => {
        async function checkAuth() {
            try {
                const accessToken = await AsyncStorage.getItem('accessToken');
                const refreshToken = await AsyncStorage.getItem('refreshToken');
                const decodedToken = jwtDecode(accessToken);
                setUserId(decodedToken.id);
                setAvt(decodedToken.avt);
                let curTime = Date.now() / 1000;
                if (decodedToken.exp < curTime) {
                    console.log('need to refresh token');
                    window.location.replace('/login');
                }
                setUsername(decodedToken.username);
            } catch (error) {
                // Handle errors here
                console.log('lỗi cmnr');
            }
        }
        checkAuth();
    }, []);
    return (
        <div className="navbar p-0 mb-3">
            <div className="wrapper">
                {/* <div className="search"> */}
                <div>
                    {/* <input type="text" placeholder="Tìm kiếm..." />
          <SearchOutlinedIcon /> */}
                </div>
                <div className="items">
                    <div className="item">
                        <DarkModeOutlinedIcon className="icon" onClick={() => dispatch({ type: 'TOGGLE' })} />
                    </div>

                    <div className="item">
                        <Link to={`/users/profile/${userId}`} style={{ textDecoration: 'none' }}>
                            <img src={`${avt}`} alt="" className="avatar" />
                        </Link>
                        <div className="listTitle" style={{ marginLeft: '10px' }}>
                            Hi, {username}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
