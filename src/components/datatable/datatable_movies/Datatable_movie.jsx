


import { Link } from "react-router-dom";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';

import { useState, useEffect } from 'react';

import styles from './datatable_movie.module.css';
import Button from 'react-bootstrap/Button';
import ReactPaginate from "react-paginate";

const Datatable_movie = () => {


  const [tableDataSVT, setTableDataSVT] = useState([]);

  //Pagination
  const [svtPerPage, setSvtPerPage] = useState(7)
  const [CsvtPerPage, setCSvtPerPage] = useState(1)
  const numOfToTalPages = Math.ceil(tableDataSVT.length / svtPerPage);
  // const pages = [...Array(numOfToTalPages + 1).keys()].slice(1);
  const indexOfLastSVT = CsvtPerPage*svtPerPage;
  const indexOfFirstSVT = indexOfLastSVT - svtPerPage;
  const visibleSVT = tableDataSVT.slice(indexOfFirstSVT, indexOfLastSVT)

  //

  const changePage = ({ selected }) => {
    setCSvtPerPage(selected + 1);
  };


  useEffect(() => {
    loadSVT();
  }, []);

  const loadSVT = async () => {
    axios
      .get('https://uitcinema.devhungops.website/api/movie')
      .then((response) => {
        setTableDataSVT(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function deleteSVT(id) {
    fetch(`https://uitcinema.devhungops.website/api/movie/${id}`, {
      method: 'DELETE',
    }).then((result) => {
      result.json().then((resp) => {
        console.log(id);
        console.warn(resp);
      });
      loadSVT();
    });
    
  }

 

  return (
    <div className={styles.servicePage}>
      <div className={styles.datatable}>
        <div className={styles.datatableTitle}>
          <b>Danh Sách Phim</b>
          <Link to="/products/newMovie" className={styles.link}>
            Thêm Phim
          </Link>
        </div>

        <TableContainer component={Paper} className={styles.table}>
          <Table sx={{ minWidth: 1200 }} aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell className={styles.tableCell + ' text-center'}>
                  STT
                </TableCell>{' '}
                <TableCell className={styles.tableCell + ' text-center'}>
                  Tên phim
                </TableCell>{' '}
                <TableCell className={styles.tableCell + ' text-center'}>
                  Tên Tác Giả
                </TableCell>{' '}
                <TableCell className={styles.tableCell + ' text-center'}>
                  Thời Lượng
                </TableCell>{' '}
                <TableCell className={styles.tableCell + ' text-center'}>
                  Ngày Chiếu
                </TableCell>{' '}
                <TableCell className={styles.tableCell + ' text-center'}>
                  Lựa Chọn
                </TableCell>{' '}
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleSVT.map((tableDataSVT, index) => (
                <TableRow
                  key={tableDataSVT.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell className={styles.tableCell + ' text-center'}>
                    {index + 1}
                  </TableCell>{' '}
                  <TableCell className={styles.tableCell + ' text-center'} style={{display:"flex"}}>
                  <div className={styles.cellWithImg}>
                    <img className={styles.cellImg} src={tableDataSVT.image} alt="avatar" />
                    
                  </div>
                    {tableDataSVT.name}
                  </TableCell>{' '}
                  <TableCell className={styles.tableCell + ' text-center'}>
                    {tableDataSVT.director}
                  </TableCell>{' '}
                  <TableCell className={styles.tableCell + ' text-center'}>
                    {tableDataSVT.duration} phút
                  </TableCell>{' '}
                  <TableCell className={styles.tableCell + ' text-center'}>
                    {tableDataSVT.releaseDate} 
                  </TableCell>{' '}
                  <TableCell className={styles.tableCell + ' text-center'}>
                    <div className={styles.cellAction}>
                      {/* <Link
                        to={`/serviceType/adjustServiceType/${tableDataSVT.svt_id}`}
                        style={{ textDecoration: 'none' }}
                      >
                        <div className={styles.viewButton}>Edit</div>
                      </Link>{' '} */}
                      <Button
                        onClick={() => deleteSVT(tableDataSVT.id)}
                        className={styles.deleteButton}
                      >
                        Delete
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

export default Datatable_movie;
