import React from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import './Contact.scss';
const Contact = () => {
    return (
        <div className="home">
            <Sidebar />
            <div className="homeContainer">
                <Navbar />
                <div className="contactTitle">
                    <b>Thông tin liên lạc</b>
                </div>
                <div className="content">
                    <b>Liên hệ với chúng tôi</b>
                </div>
            </div>
        </div>
    );
};

export default Contact;
