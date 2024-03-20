import "./list_user.scss"
import Sidebar from "../../../components/sidebar/Sidebar"
import Navbar from "../../../components/navbar/Navbar"
import Datatable_user from "../../../components/datatable/datatable_user/Datatable_user"

const List_user = () => {
  return (
    <div className="list">
      <Sidebar/>
      <div className="listContainer">
        <Navbar/>
        <Datatable_user/>
      </div>
    </div>
  )
}

export default List_user;