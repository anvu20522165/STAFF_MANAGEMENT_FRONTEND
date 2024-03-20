import "./order.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import Datatable_order from "../../components/datatable/datatable_orders/Datatable_order"

const List_order = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <Datatable_order />
      </div>
    </div>
  )
}

export default List_order;