import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import List from "../../components/table/Table";
import { jwtDecode } from "jwt-decode"
import { useState, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import {format} from 'date-fns'
import "react-datepicker/dist/react-datepicker.css";
const Single = (item) => {
  const { userId } = useParams(); //lấy id từ url
  const [username, setUsername] = useState("")
  const [fullname, setFullname] = useState("")
  const [email, setEmail] = useState("")
  const [birth, setBirth] = useState(new Date())

  const [gender, setGender] = useState()
  const [phone, setPhone] = useState("")
  const [position, setPosition] = useState()
  const [department, setDepartment] = useState()
  const [avt, setAvt] = useState("")
  const navigate = useNavigate();
  const [token, setToken] = useState("")

  const genders = [
    { value: 'MALE', label: 'Nam'},
    { value: 'FEMALE', label: 'Nữ'},

  ]

  const positions = [
    { value: 'QUAN_LY', label: 'Quản lý' },
    { value: 'TRUONG_PHONG', label: 'Trưởng phòng' },
    { value: 'PHO_PHONG', label: 'Phó phòng' },
    { value: 'NHAN_VIEN', label: 'Nhân viên' },
  ];

  const departments = [
    { value: 'BAN_QUAN_LY', label: 'Ban Quản lý' },
    { value: 'BAN_GIAM_DOC', label: 'Ban Giám Đốc' },
    { value: 'PHONG_NHAN_SU', label: 'Phòng Nhân Sự' },
    { value: 'PHONG_TAI_CHINH', label: 'Phòng Tài Chính' },
    { value: 'PHONG_MARKETING', label: 'Phòng Marketing' },
    { value: 'PHONG_KY_THUAT', label: 'Phòng Kỹ Thuật' },
    { value: 'PHONG_SAN_XUAT', label: 'Phòng Sản Xuất' },
    { value: 'PHONG_HANH_CHINH', label: 'Phòng Hành Chính' },

  ];

  const fetchDetail = async () => {
    console.log(userId)
    axios
      .get(`http://localhost:5000/v1/user/${userId}`,)
      .then((response) => {
        //Set default values
        setUsername(response.data.username)
        setEmail(response.data.email)
        setAvt(response.data.avt)
        setFullname(response.data.fullname)
        let dataGender = genders.find(i => i.value == response.data.gender)
        console.log(response.data.birth)
        const formatDate = format(response.data.birth, "MM/dd/yyyy h:mm aa")

        console.log("format date",formatDate)

        setBirth(response.data.birth)
        setGender(dataGender)
        setPhone(response.data.phone)
        let dataPosition = positions.find(i => i.value == response.data.position)
        setPosition(dataPosition)
        let dataDepartment = departments.find(i => i.value == response.data.department)
        setDepartment(dataDepartment)
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    async function checkAuth() {
      try {
        const accessToken = await AsyncStorage.getItem("accessToken");
        setToken(accessToken)
        const decodedToken = jwtDecode(accessToken);
        let curTime = Date.now() / 1000;
        if (decodedToken.exp < curTime) {
          window.location.replace("/login");
        }

      } catch (error) {
        console.log("lỗi cmnr")
      }
    }
    checkAuth()
    fetchDetail()
  }, [])

  const updateUser = async (userId, token) => {


    const updatedUser = {
      username: username,
      fullname: fullname,
      email: email,
      avt: avt,
      phone: phone,
      gender: gender.value,
      birth: birth,
      position: position.value,
      department: department.value,
    }
    axios
      .put(`http://localhost:5000/v1/user/${userId}`, updatedUser, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        window.location.replace(`/users/${userId}`);
      })
      .catch((error) => {
        window.alert(
          "You don't have the permission to fulfill this action"
        );
      });

  };

  function updatePassword(id, token) {
    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken._id == userId || decodedToken.isAdmin == true) {
        navigate(`/users/changePassword/${id}`);
      }
      else {
        window.alert(
          "Only admin or this user can change the password!"
        );
      }

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <Button className="editButton" onClick={() => updatePassword(userId, token)}>Đổi mật khẩu</Button>
            <h1 className="title">Thông Tin Cá Nhân</h1>
            <div className="item">
              <img
                src={avt}
                alt=""
                className="itemImg"
              />
              <div className="details">
                <div className="detailItem">
                  <div className="itemKey">Username:</div>
                  <div className="itemValue">
                    <input
                      style={{
                        padding: 10,
                        borderColor: "#D0D0D0",
                        borderWidth: 2,
                        marginTop: 5,
                        marginLeft: 5,
                        borderRadius: 5,
                        fontSize: 15
                      }}
                      value={username}
                      type="text" placeholder="Enter your username"
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>
                <div className="detailItem">
                  <div className="itemKey">Họ tên:</div>
                  <div className="itemValue">
                    <input
                      style={{
                        padding: 10,
                        borderColor: "#D0D0D0",
                        borderWidth: 2,
                        marginTop: 5,
                        marginLeft: 5,
                        borderRadius: 5,
                        fontSize: 15
                      }}
                      value={fullname}
                      type="text" placeholder="Enter your name"
                      onChange={(e) => setFullname(e.target.value)}
                    />
                  </div>
                </div>
                <div className="detailItem">
                  <div className="itemKey">Email:</div>
                  <div className="itemValue">
                    <input
                      style={{
                        padding: 10,
                        borderColor: "#D0D0D0",
                        borderWidth: 2,
                        marginTop: 5,
                        marginLeft: 5,
                        borderRadius: 5,
                        fontSize: 15
                      }}
                      value={email}
                      type="text" placeholder="Enter your email"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="detailItem">
                  <div className="itemKey">SĐT:</div>
                  <div className="itemValue">
                    <input
                      style={{
                        padding: 10,
                        borderColor: "#D0D0D0",
                        borderWidth: 2,
                        marginTop: 5,
                        marginLeft: 5,
                        borderRadius: 5,
                        fontSize: 15
                      }}
                      value={phone}
                      type="text" placeholder="Enter your phone"
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
                <div className="detailItem">
                  <div className="itemKey">Giới tính:</div>
                  <div className="itemValue">
                  {gender && <Select
                      defaultValue={gender}
                      onChange={setGender}
                      options={genders}
                    />}
                  </div>
                </div>
                <div className="detailItem">
                  <div className="itemKey">Ngày sinh:</div>
                  <div className="itemValue">
                  <DatePicker
                      selected={birth}
                      onChange={setBirth}
                      timeInputLabel="Time:"
                      dateFormat="MM/dd/yyyy h:mm aa"
                      showTimeInput
                      showMonthDropdown
                      showYearDropdown
                      scrollableYearDropdown
                    />
                  </div>

                </div>
                <div className="detailItem">
                  <div className="itemKey">Phòng ban:</div>
                  <div className="itemValue">
                    {department && <Select
                      defaultValue={department}
                      onChange={setDepartment}
                      options={departments}
                    />}
                  </div>

                </div>
                <div className="detailItem">
                  <div className="itemKey">Chức vụ:</div>
                  <div className="itemValue">
                    {position && <Select
                      defaultValue={position}
                      onChange={setPosition}
                      options={positions}
                    />}

                  </div>

                </div>
                <div className="detailItem">
                  <div className="itemKey">Ảnh:</div>
                  <div className="itemValue">
                    <input
                      style={{
                        padding: 10,
                        borderColor: "#D0D0D0",
                        borderWidth: 2,
                        marginTop: 5,
                        marginLeft: 5,
                        borderRadius: 5,
                        fontSize: 15
                      }}
                      value={avt}
                      type="text" placeholder="Enter your img url"
                      onChange={(e) => setAvt(e.target.value)}
                    />
                  </div>
                </div>
                <Button onClick={() => updateUser(userId, token)} style={{ borderRadius: 5, background: "green" }}> Cập nhật </Button>
              </div>
            </div>
          </div>
          <div className="right">
            <h1 className="title">Thông Báo Cá Nhân</h1>
          </div>
        </div>
        <div className="bottom">
          <h1 className="title">Lịch làm việc</h1>
          <List />
        </div>
      </div>
    </div>
  );
};

export default Single;
