// import "./newMovie.scss";
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import styles from "./newMovie.module.css"
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MultiSelect } from "react-multi-select-component";

const options = [
  { label: 'Hành động', value: 'Hành động' },
  { label: 'Tình cảm', value: 'Tình cảm' },
  { label: 'Hài', value: 'Hài'},
  { label: 'Khoa học viễn tưởng', value: 'Khoa học viễn tưởng'},
  { label: 'Hoạt hình', value: 'Hoạt hình'},
  { label: 'Tâm Lý', value: 'Tâm Lý'},
  { label: 'Tội phạm', value: 'Tội phạm'},
  { label: 'Phim tài liệu', value: 'Phim tài liệu'},
  { label: 'Phiêu Lưu', value: 'Phiêu Lưu'},
  { label: 'Thần thoại', value: 'Thần thoại'},
];
const NewMovie = ({  title }) => {
  const [file, setFile] = useState("");
  
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);

  
  const navigateToMoviePage = () => {
    // 👇️ navigate to /contacts
    navigate('/products');
  };
  const handleSubmit = async (e) => {
        e.preventDefault();
  
      try {
        const response = await axios.post('https://uitcinema.devhungops.website/api/movie', {
          name: e.target.name.value,
    
          image: e.target.image.value,
        
          director: e.target.director.value,
        
          actors: e.target.actors.value,
        
          releaseDate: e.target.releaseDate.value,
        
          genre: selected.map(genre => genre.value),
        
          duration: e.target.duration.value,
        
          language: e.target.language.value,
        
          description: e.target.description.value,
        
          rated: e.target.rated.value,
        
          trailer_url: e.target.trailer_url.value,
        } );


          
        
      } catch (error) {
        console.error(error);
        // console.log(selected);
        // console.log(selected.map(genre => genre.value));
    }
    navigateToMoviePage();
    console.log();
    
  };
  return (
    <div className={styles.new}>
      <Sidebar />
    
      <div className={styles.newContainer}>
        <Navbar />
        <div className={styles.top}>
          <h1>{title}</h1>
        </div>
        <div className={styles.bottom}>
          <div className={styles.left}>
          <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://img.freepik.com/premium-vector/cinema-movie-background-popcorn-filmstrip-clapboard-tickets-movie-time-background_41737-248.jpg"
              }
              alt=""
            />
          </div>
          <div className={styles.right}>
          <form onSubmit={handleSubmit}>
            
              <div class={styles.formInput}>
                <label>Hình Ảnh</label>
                <input
                  type="text"
                  
                  name="image"
                 
                />
              </div>
              <div class={styles.formInput}>
                <label>Tên Phim</label>
                <input
                  type="text"
                  name="name"
                  
                  placeholder="VD: svt01"
                />
              </div>

              <div class={styles.formInput}>
                <label>Đạo Diễn</label>
                <input
                  type="text"
                  name="director"
                  
                  placeholder="VD: An Vũ"
                />
              </div>
              <div class={styles.formInput}>
                <label>Diễn Viên</label>
                <input
                  type="text"
                  name="actors"
                  
                  placeholder="VD: HV-Hùng"
                />
              </div>
              <div class={styles.formInput}>
                <label>Thời Lượng</label>
                <input
                  type="number"
                  name="duration"
                  
                  placeholder="VD: 150"
                />
              </div>
              <div class={styles.formInput}>
                <label>Ngày Chiếu</label>
                <input
                  type="date"
                  name="releaseDate"
                  
                  
                />
              </div>

              <div class={styles.formInput}>
                <label>Ngôn Ngữ</label>
                <input
                  type="text"
                  name="language"
                  
                  placeholder="VD: R"
                />
              </div>

              <div class={styles.formInput}>
                <label>Mô Tả</label>
                <input
                  type="text"
                  name="description"
                  
                  placeholder="VD: R"
                />
              </div>

              <div class={styles.formInput}>
                <label>Rated</label>
                <input
                  type="text"
                  name="rated"
                  
                  placeholder="VD: R"
                />
              </div>
              
              <div class={styles.formInput}>
                <label>Trailer</label>
                <input
                  type="text"
                  name="trailer_url"
                  
                  placeholder="VD: Youtube Link"
                />
              </div>
              <div class={styles.formInput}>
                <label>Thể Loại</label>
                <MultiSelect
                options={options}
                value={selected}
                name="genre"
                onChange={setSelected}
                labelledBy="Select"
              />
              </div>
             
              <button
                type="submit"
                // onClick={handleSubmit}
                className={styles.myButton}
              >
                Thêm Phim
              </button>
            </form>
            <div className={styles.buttonUpdate}>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewMovie;