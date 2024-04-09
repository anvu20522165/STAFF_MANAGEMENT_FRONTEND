import React, { useState, useEffect } from 'react';
import "./Announcement.scss"
import Navbar from "../../components/navbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"



const Announcement = () => {
    const [announcements, setAnnouncements] = useState([]);
    useEffect(() => {
        // Lấy dữ liệu từ backend
        fetch('/announcement/get-all-announcements')
          .then(response => response.json())
          .then(data => setAnnouncements(data))
          .catch(error => console.error('Error:', error));
    }, []);
    return (
        <div className="home">
            <Sidebar />
            <div className="homeContainer">
                <Navbar />
                <div className="datatable">
                    <div className="datatableTitle">
                        <b>Lịch Biểu</b>
                    </div>
                    <table className="announcementTable">
                        <thead>
                            <tr>
                                <th>Tên thông báo</th>
                                <th>Ngày bắt đầu</th>
                                <th>Ghi chú</th>
                                <th>Nhân viên</th>
                                <th>Phòng ban</th>
                            </tr>
                        </thead>
                        <tbody>
                            {announcements.map(announcement => (
                            <tr key={announcement._id}>
                                <td>{announcement.nameAnnouncement}</td>
                                <td>{new Date(announcement.startAt).toLocaleDateString()}</td>
                                <td>{announcement.note}</td>
                                <td>{announcement.listEmployee.join(', ')}</td>
                                <td>{announcement.department}</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Announcement;