import React from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import './Structure.scss';
function Structure() {
    return (
        <div className="home">
            <Sidebar />
            <div className="homeContainer">
                <Navbar />
                <div className="title">
                    <h2>Cơ cấu tổ chức</h2>
                </div>
                <div className="imgContainer">
                    <img src="/image/structure.jpg" alt="structureImage"></img>
                </div>
                <div className="contentContainer">
                    <p>
                        Đề tài “Xây dựng website nội bộ doanh nghiệp” là một dự án phát triển trang mạng để sử dụng
                        trong nội bộ của doanh nghiệp. Trang mạng nội bộ nhằm truyền tải và cung cấp các thông tin cần
                        thiết và tương tác nội bộ giữa các nhân viên, bao gồm một số khía cạnh như thông báo, bảng tin,
                        truyền thông nội bộ, quản lý nhân sự, lịch đăng ký phòng họp, yêu cầu liên đơn vị... Dự án của
                        nhóm thực hiện bao gồm các bước như phân tích yêu cầu, thiết kế giao diện, xây dựng, phát triển
                        và triển khai trang mạng. Sau cùng việc quan trọng là thực hiện kiểm thử và sửa lỗi để đảm bảo
                        trang mạng hoạt động ổn định. Ngoài ra, để hoàn thành xây dựng website, nhóm đã thực hiện tiến
                        hành áp dụng các kiến thức trong lĩnh vực quản lý dự án nhằm đảm bảo dự án đi đúng hướng, theo
                        kế hoạch và có hiệu quả, kịp thời phát hiện và xử lý khi có các vấn đề phát sinh. Sản phẩm được
                        nhóm thực hiện hoàn thành bao gồm các tính năng cơ bản, đáp ứng được nhu cầu từ khách hàng như
                        quản lý thông báo, quản lý bảng tin, quản lý nhân sự, quản lý lịch hay các yêu cầu liên đơn
                        vị...
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Structure;
