// import "./list_user.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Datatable_feedback from "../../components/datatable/datatable_feedbacks/Datatable_feedback";

const Feedback = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <Datatable_feedback />
      </div>
    </div>
  );
};

export default Feedback;
