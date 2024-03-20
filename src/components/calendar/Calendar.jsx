import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import styles from "./Calendar.module.css";
import { makeStyles } from "@mui/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { MultiSelect } from "react-multi-select-component";

import { useState, useEffect } from "react";
const useStyles = makeStyles({
  paper: {
    overflowX: "scroll",
    width: "250px",
    overflowY: "scroll",
  },
});


const Calendar = () => {
  const classes = useStyles();
  const MenuProps = {
    autoFocus: false,
  };

  const [showtimes, setShowtimes] = React.useState();



  //Province
  const [province, setProvince] = useState();
  const [provinceSelected, setProvinceSelected] = useState();

  const loadProvince = async () => {
    axios
      .get("https://uitcinema.devhungops.website/api/province?filter=notnull")
      .then((response) => {
        setProvince(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };


  const handleChangeProvince = (event) => {
    if (province.data.length === 0 || !province.data) return;
    const curProvince = province?.data?.filter(
      (item) => item.id === event.target.value
    )[0];
    setProvinceSelected(curProvince);
  };
  /////
  //Cinema

  const [listCinema, setListCinema] = React.useState("");
  const handleChangeCinema = (event) => {
    setListCinema(event.target.value);
  };

  ///////
  // Movie
  const [movie, setMovie] = useState([]);

  const loadMovie = async () => {
    axios
      .get("https://uitcinema.devhungops.website/api/movie")
      .then((response) => {
        setMovie(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const [selected, setSelected] = useState([]);



  //buttons function
  const handleSubmit = (event) => {
    event.preventDefault();
    const movieIds = selected.map((movie) => movie.value);
    axios
      .post("https://uitcinema.devhungops.website/api/showtime/generate", {
        date: event.target[5].value,
        movieIds: movieIds,
        cinemaId: event.target[2].value,
      })
      .then((res) => {
        setShowtimes(res.data);
      });

  };

  const handleAddShowTimes = (event) => {
    if (showtimes && Object.keys(showtimes?.showtimes).length > 0) {
      const roomShowtimes = {};
      for (let room of Object.keys(showtimes.showtimes)) {
        roomShowtimes[room] = showtimes.showtimes[room].map(
          (showtime) => showtime.movie.id
        );
      }

      event.preventDefault();
  
      try {
        const response = axios.post('https://uitcinema.devhungops.website/api/showtime', {
          date: showtimes.date,
          cinemaId: showtimes.cinema.id + "",
          roomShowtimes: roomShowtimes,
        } );
   
      } catch (error) {
        console.error(error);

    }

    }
    console.log("hihi")
    alert("Thêm các lịch chiếu thành công !");
  }

  useEffect(() => {
    loadProvince();
    loadMovie();
  }, []);

  ////////////
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", margin: "20px" }}>
          <div style={{ marginRight: "45px" }}>
            <FormControl required sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-required-label">
                Tỉnh
              </InputLabel>
              <Select
                MenuProps={{
                  ...MenuProps,
                  classes: {
                    paper: classes.paper,
                  },
                }}
                labelId="demo-simple-select-required-label"
                id="demo-simple-select-required"
                label="listProvince *"
                onChange={handleChangeProvince}
              >
                {province?.data?.length > 0 &&
                  province?.data?.map((province, index) => (
                    <MenuItem value={province.id}>{province.name}</MenuItem>
                  ))}
              </Select>
              <FormHelperText>Yêu Cầu</FormHelperText>
            </FormControl>

            <FormControl required sx={{ m: 1, minWidth: 120 }} name="cinema">
              <InputLabel id="demo-simple-select-required-label">
                Rạp
              </InputLabel>
              <Select
                labelId="demo-simple-select-required-label"
                id="demo-simple-select-required"
                maxMenuHeight={250}
                label="listCinema *"
                onChange={handleChangeCinema}
              >
                {provinceSelected?.cinemas?.length > 0 &&
                  provinceSelected?.cinemas?.map((cinema, index) => (
                    <MenuItem value={cinema.id}>{cinema.name}</MenuItem>
                  ))}
              </Select>
              <FormHelperText>Yêu Cầu</FormHelperText>
            </FormControl>

            <FormControl required sx={{ m: 1, minWidth: 200 }} name="movies">
              <label id="demo-simple-select-required-label">
                Phim
              </label>

              <MultiSelect
                options={movie.map((mv) => {
                  return {
                    label: mv.name,
                    value: mv.id,
                  };
                })}
                value={selected}
                onChange={setSelected}
                
              />
              
              <FormHelperText>Yêu Cầu</FormHelperText>
            </FormControl>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              float: "right",
            }}
          >
            <div className={styles.myDate}>
              <label>Ngày Chiếu</label>
              <input type="date" name="releaseDate" />
            </div>
            <div className={styles.buttonUpdate}>
              <button
                type="submit"
                
                className={styles.myButton}
              >
                Tạo
              </button>
              
            </div>
            
          </div>
        </div>
      </form>
      <div className={styles.buttonUpdate}>
              <button
                type="submit"
                onClick={handleAddShowTimes}
                className={styles.myButton}
              >
                Thêm
              </button>
              
            </div> 
      <div className={styles.servicePage}>
        <div className={styles.datatable}>
          <div className={styles.datatableTitle}>
            <b>Danh Sách Lịch Chiếu Từng Rạp</b>
          </div>

          <TableContainer component={Paper} className={styles.table}>
            <Table sx={{ minWidth: 650 }} aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell className={styles.tableCell + " text-center"}>
                    <b>Rạp 1</b>
                  </TableCell>{" "}
                  <TableCell className={styles.tableCell + " text-center"}>
                  <b>Rạp 2</b>
                  </TableCell>{" "}
                  <TableCell className={styles.tableCell + " text-center"}>
                  <b>Rạp 3</b>
                  </TableCell>{" "}
                  <TableCell className={styles.tableCell + " text-center"}>
                  <b>Rạp 4</b>
                  </TableCell>{" "}
                </TableRow>
              </TableHead>
              <TableBody>
                {showtimes &&
                  Object.keys(showtimes.showtimes).map(
                    (showtimeColumn, index) => (
                      <TableCell
                        key={index}
                        className={styles.tableCell + " text-center"}
                      >
                        {showtimeColumn.length > 0 &&
                          showtimes.showtimes[showtimeColumn].map(
                            (showtime) => (
                              <TableRow>
                                <div
                               
                                  className={styles.myTable}
                                >
                                  <div
                                    style={{
                                      marginRight: 5,
                                    }}
                                    className={styles.cellWithImg}
                                  >
                                    <img
                                      src={showtime.movie.image}
                                      alt=""
                                      width={50}
                                      className={styles.cellImg}
                                    />
                                  </div>
                                  <div
                                    style={{ marginTop: "20px", width: 200 }}
                                    className={styles.infos}
                                  >
                                    <div className={styles.info}>
                                      Bắt đầu:  
                                      <b>
                                      {new Date(
                                        showtime.start
                                      ).toLocaleTimeString()}
                                      </b>
                                    </div>
                                    <div className={styles.info}>
                                      Kết thúc:
                                      <b>
                                      {new Date(
                                        showtime.end
                                      ).toLocaleTimeString()}
                                      </b>
                                    </div>
                                    <div className={styles.info}>Phim: <b>{showtime.movie.name}</b></div>
                                  </div>
                                </div>
                              </TableRow>
                            )
                          )}
                      </TableCell>
                    )
                  )}
              </TableBody>
            </Table>
          </TableContainer>


        </div>
      </div>
    </div>
  );
};

export default Calendar;
