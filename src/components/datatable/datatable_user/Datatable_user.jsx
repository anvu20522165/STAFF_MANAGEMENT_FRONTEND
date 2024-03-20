
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import { jwtDecode } from "jwt-decode"
import { useState, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useNavigate } from "react-router-dom";
import styles from './datatable_user.module.css';
import Button from 'react-bootstrap/Button';
import ReactPaginate from "react-paginate";

const Datatable_user = () => {

  const [tableDataSVT, setTableDataSVT] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  //Pagination
  const [svtPerPage, setSvtPerPage] = useState(4)
  const [CsvtPerPage, setCSvtPerPage] = useState(1)
  const numOfToTalPages = Math.ceil(tableDataSVT?.length / svtPerPage);
  // const pages = [...Array(numOfToTalPages + 1).keys()].slice(1);
  const indexOfLastSVT = CsvtPerPage * svtPerPage;
  const indexOfFirstSVT = indexOfLastSVT - svtPerPage;
  // const visibleSVT = tableDataSVT.data?.slice(indexOfFirstSVT, indexOfLastSVT)
  const visibleSVT = tableDataSVT?.slice(indexOfFirstSVT, indexOfLastSVT)

  const navigate = useNavigate();
  const changePage = ({ selected }) => {
    setCSvtPerPage(selected + 1);
  };

  useEffect(() => {
    async function checkAuth() {
      try {

        const accessToken = await AsyncStorage.getItem("accessToken");
        const refreshToken = await AsyncStorage.getItem("refreshToken");
        const decodedToken = jwtDecode(accessToken);
        console.log(decodedToken)
        let curTime = Date.now() / 1000;
        if (decodedToken.exp < curTime) {
          console.log("need to refresh token")
          window.location.replace("/login");
        }
        setIsAdmin(decodedToken.isAdmin)

      } catch (error) {
        // Handle errors here
        console.log("lỗi cmnr")
      }

    }
    checkAuth()
  }, [])


  useEffect(() => {
    loadSVT();
  }, []);

  const loadSVT = async () => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    console.log(accessToken)
    axios
      .get('http://localhost:5000/v1/user/users', { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((response) => {
        setTableDataSVT(response.data);
        console.log("all users:", response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function editUser(id) {
    navigate(`/users/${id}`);
  }

  function addNewUser(id) {
    navigate(`/users/add`);
  }

  const deleteUser = async (id) => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    console.log(id)
    axios
      .delete(`http://localhost:5000/v1/user/${id}`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        window.alert(
          "You don't have the permission to fulfill this action"
      );

      });
    loadSVT();
  };


  return (
    <div className={styles.servicePage}>
      <div className={styles.datatable}>
        <div className={styles.datatableTitle}>
          <b>Danh Sách Nhân Viên</b>
        </div>

        {isAdmin == true ? (
          <div style={{ marginBottom: 10 }}>
            <Button
              onClick={() => addNewUser()}
              style={{ background: "green", fontSize: 15, fontWeight: "bold" }}
            >
              Thêm NV
            </Button>
          </div>
        ) : (
          <div style={{ marginBottom: 10 }}>
          </div>
        )}

        <TableContainer component={Paper} className={styles.table}>
          <Table sx={{ minWidth: 1200 }} aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell className={styles.tableCell + ' text-center'}>
                  STT
                </TableCell>
                <TableCell className={styles.tableCell + ' text-center'}>
                  Ảnh
                </TableCell>
                <TableCell className={styles.tableCell + ' text-center'}>
                  Tên
                </TableCell>
                <TableCell className={styles.tableCell + ' text-center'}>
                  Email
                </TableCell>
                <TableCell className={styles.tableCell + ' text-center'}>
                  SĐT
                </TableCell>
                <TableCell className={styles.tableCell + ' text-center'}>
                  Ngày Sinh
                </TableCell>
                <TableCell className={styles.tableCell + ' text-center'}>
                  Giới Tính
                </TableCell>
                <TableCell className={styles.tableCell + ' text-center'}>
                  Lựa Chọn

                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleSVT?.length > 0 && visibleSVT?.map((item, index) => (
                <TableRow
                  key={index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell className={styles.tableCell + ' text-center'}>
                    {index + 1}
                  </TableCell>
                  <TableCell className={styles.tableCell + ' text-center'}>
                    <img
                      style={{ width: 35, height: 35, borderRadius: 20 }}
                      src={item.avt}
                      alt=""
                      className="itemImg"
                    />
                  </TableCell>
                  <TableCell className={styles.tableCell + ' text-center'}>
                    {item.username}
                  </TableCell>
                  <TableCell className={styles.tableCell + ' text-center'}>
                    {item.email}
                  </TableCell>
                  <TableCell className={styles.tableCell + ' text-center'}>
                    {item.phone}
                  </TableCell>
                  <TableCell className={styles.tableCell + ' text-center'}>
                    {item.birthDay}
                  </TableCell>
                  <TableCell className={styles.tableCell + ' text-center'}>
                    {item.gender}
                  </TableCell>
                  <TableCell className={styles.tableCell + ' text-center'}>
                    <div className={styles.cellAction}>

                      <Button
                        onClick={() => editUser(item._id)}
                        className={styles.editButton}
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => deleteUser(item._id)}
                        className={styles.deleteButton}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>


                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <ReactPaginate
          previousLabel={"Prev"}
          nextLabel={"Next"}
          pageCount={numOfToTalPages}
          onPageChange={changePage}
          containerClassName={styles.myContainerPagination}
          pageClassName={styles.pageItem}
          pageLinkClassName={styles.pageLink}
          previousClassName={styles.pageItem}
          previousLinkClassName={styles.pageLink}
          nextClassName={styles.pageItem}
          nextLinkClassName={styles.pageLink}
          breakClassName={styles.pageItem}
          breakLinkClassName={styles.pageLink}
          activeClassName={styles.active}

        />
      </div>
    </div>
  );
};

export default Datatable_user;
