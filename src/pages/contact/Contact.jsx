import React from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import './Contact.scss';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import GoogleIcon from '@mui/icons-material/Google';
const Contact = () => {
    return (
        <div className="home">
            <Sidebar />
            <div className="homeContainer">
                <Navbar />
                <div className="contactTitle">
                    <h2>Liên hệ với chúng tôi</h2>
                </div>
                <div class="form">
                    <form action="" id="form1">
                        <input type="text" id="fname" name="fname" placeholder="Họ tên" />
                        <br />
                        <input type="text" id="femail" name="femail" placeholder="Địa chỉ Email" />
                        <br />
                        <input type="text" id="fcontent" name="fcontent" placeholder="Nội dung" />
                        <br />
                        <input type="submit" value="Gửi" />
                    </form>
                </div>
                <div className="socials">
                    <button className="facebook">
                        <FacebookIcon className="icon" />
                    </button>
                    <button className="twitter">
                        <TwitterIcon className="icon" />
                    </button>
                    <button className="GG">
                        <GoogleIcon className="icon" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Contact;
