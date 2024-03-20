//import "./list_user.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"

import Calendar from "../../components/calendar/Calendar"
const MakeCalendar = () => {
  return (
    <div className="list">
      <Sidebar/>
      <div className="listContainer">
        <Navbar/>
        <Calendar/>
      </div>
    </div>
  )
}

export default MakeCalendar;