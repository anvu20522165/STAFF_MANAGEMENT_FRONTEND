import "./list_request.scss"
import Sidebar from "../../../components/sidebar/Sidebar"
import Navbar from "../../../components/navbar/Navbar"
import Datatable_request from "../../../components/datatable/datatable_requestMultiTask/Datatable_request"

const List_request = () => {
  return (
    <div className="list">
      <Sidebar/>
      <div className="listContainer">
        <Navbar/>
        <Datatable_request/>
      </div>
    </div>
  )
}

export default List_request;