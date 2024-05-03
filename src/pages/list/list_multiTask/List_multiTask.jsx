import "./list_multiTask.scss"
import Sidebar from "../../../components/sidebar/Sidebar"
import Navbar from "../../../components/navbar/Navbar"
import Datatable_multiTask from "../../../components/datatable/datatable_multiTask/Datatable_multiTask"

const list_multiTask = () => {
  return (
    <div className="list">
      <Sidebar/>
      <div className="listContainer">
        <Navbar/>
        <Datatable_multiTask/>
      </div>
    </div>
  )
}

export default list_multiTask;