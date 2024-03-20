import "./table.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from 'axios';
import styles from './table.module.scss'
import { useState, useEffect } from 'react';
const List = () => {
  useEffect(() => {
    loadSVT();
  }, []);
  const [tableDataSVT, setTableDataSVT] = useState([]);
  const loadSVT = async () => {
    axios
      .get('https://uitcinema.devhungops.website/api/statistics/getLatestTicket')
      .then((response) => {
        setTableDataSVT(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="tableCell">ID</TableCell>
            <TableCell className="tableCell">Phim</TableCell>
            <TableCell className="tableCell">Ghế ngồi</TableCell>
            <TableCell className="tableCell">Thanh Toán</TableCell>
            
            <TableCell className="tableCell">Rạp</TableCell>
            <TableCell className="tableCell">Giá</TableCell>
            <TableCell className="tableCell">Mã Đặt Vé</TableCell>
            <TableCell className="tableCell">Ngày lập</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableDataSVT?.RecentTickets?.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="tableCell">{row.id}</TableCell>
              <TableCell className="tableCell" style={{display:"flex"}}>
              <div className={styles.cellWithImg}>
                    <img className={styles.cellImg} src={row.movieImage} alt="avatar" />
                    
              </div>
                {row.movieName}
                </TableCell>
              <TableCell className="tableCell">{row.seat.join(", ")}</TableCell>
              <TableCell className="tableCell">{row.paymentMethod}</TableCell>
              <TableCell className="tableCell">{row.cinemaName}</TableCell>
              <TableCell className="tableCell">{row.totalTicket?.toLocaleString('vi', {style : 'currency', currency : 'VND'})}</TableCell>
              <TableCell className="tableCell">{row.code}</TableCell>
              <TableCell className="tableCell">{row.createdAt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default List;
