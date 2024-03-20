
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';

import { useState, useEffect } from 'react';

import styles from './datatable.module.css';
import Button from 'react-bootstrap/Button';
import ReactPaginate from "react-paginate";

const Datatable_order = () => {
 
  const [tableDataTicket, setTableDataTicket] = useState([]);

  //Pagination
  const [TicketPerPage, setTicketPerPage] = useState(7)
  const [CTicketPerPage, setCTicketPerPage] = useState(1)
  const numOfToTalPages = Math.ceil(tableDataTicket?.length / TicketPerPage)
  const indexOfLastTicket = CTicketPerPage*TicketPerPage;
  const indexOfFirstTicket = indexOfLastTicket - TicketPerPage;
  const visibleTicket = tableDataTicket?.slice(indexOfFirstTicket, indexOfLastTicket)

  

  const changePage = ({ selected }) => {
    setCTicketPerPage(selected + 1);
  };


  useEffect(() => {
    loadTicket();
  }, []);

  const loadTicket = async () => {
    axios
      .get('https://uitcinema.devhungops.website/api/ticket')
      .then((response) => {
        setTableDataTicket(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className={styles.servicePage}>
      <div className={styles.datatable}>
        <div className={styles.datatableTitle}>
          <b>Danh Sách Hóa đơn</b>
         
        </div>

        <TableContainer component={Paper} className={styles.table}>
          <Table sx={{ minWidth: 1200 }} aria-label="a denses table">
            <TableHead>
              <TableRow>
                <TableCell className={styles.tableCell + ' text-center'}>
                  STT
                </TableCell>{' '}
                <TableCell className={styles.tableCell + ' text-center'}>
                  Tên phim
                </TableCell>{' '}
                <TableCell className={styles.tableCell + ' text-center'}>
                  Chỗ ngồi
                </TableCell>{' '}
                <TableCell className={styles.tableCell + ' text-center'}>
                  Tiền vé
                </TableCell>{' '}
                <TableCell className={styles.tableCell + ' text-center'}>
                  Tiền đồ ăn
                </TableCell>{' '}
                <TableCell className={styles.tableCell + ' text-center'}>
                  Tổng tiền hóa đơn
                </TableCell>{' '}
                <TableCell className={styles.tableCell + ' text-center'}>
                  Phương thức thanh toán
                </TableCell>{' '}
                <TableCell className={styles.tableCell + ' text-center'}>
                  Trạng thái
                </TableCell>{' '}
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleTicket?.length > 0 && visibleTicket?.map((tableDataTicket, index) => (
                
                <TableRow
                  key={tableDataTicket.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell className={styles.tableCell + ' text-center'}>
                    {index + 1}
                  </TableCell>{' '}
                  <TableCell className={styles.tableCell + ' text-center'} style={{display:"flex"}}>
                    {tableDataTicket.movieName}
                  </TableCell>{' '}
                  <TableCell className={styles.tableCell + ' text-center'}>
                    {tableDataTicket.seat.join(", ")}
                  </TableCell>{' '}
                  <TableCell className={styles.tableCell + ' text-center'}>
                    {tableDataTicket.totalTicket?.toLocaleString('vi', {style : 'currency', currency : 'VND'})}
                  </TableCell>{' '}
                  <TableCell className={styles.tableCell + ' text-center'}>
                    {tableDataTicket.totalFood?.toLocaleString('vi', {style : 'currency', currency : 'VND'})} 
                  </TableCell>{' '}
                  <TableCell className={styles.tableCell + ' text-center'}>
                    {(tableDataTicket.totalTicket + tableDataTicket.totalFood)?.toLocaleString('vi', {style : 'currency', currency : 'VND'})} 
                  </TableCell>{' '}
                  <TableCell className={styles.tableCell + ' text-center'}>
                    {tableDataTicket.paymentMethod} 
                  </TableCell>{' '}
                  <TableCell className={styles.tableCell + ' text-center'}>
                    <div className={styles.cellAction}>
                      <Button>
                        Đã thanh toán
                      </Button>{' '}
                    </div>
                  </TableCell>{' '}
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

export default Datatable_order;
