import "./datatable.scss";

import { DataGrid } from "@mui/x-data-grid";
import { cinemaColumns } from "../../../datatablesource_cinemas.js";
import { cinemaRows } from "../../../datatablesource_cinemas.js";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
const Datatable_cinemas = () => {
  const [data, setData] = useState(cinemaRows);
  useEffect(() => {
    setData(cinemaRows);
  }, [cinemaRows]);
  // const handleAction = (id) => {
  //   const index = data.findIndex((item) => item.id === id);
  //   if (index !== -1) {
  //     const confirmed = window.confirm("Are you sure you want to change the active status?");
  //     if (confirmed) {
  //       const newData = [...data];
  //       newData[index].isActive = !newData[index].isActive;
  //       setData(newData);
  //     }
  //   }
  // };

  // const provinceColumn = [
  //   {
  //     field: "province",
  //     headerName: "Province",
  //     width: 200,
  //     renderCell: (params) => {
  //       return (
  //         <div>
  //           {params.row.province.name}
  //         </div>
  //       );
  //     },
  //   },
  // ];
  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            {/* <button className="activeButton" onClick={() => handleAction(params.row.id)} >{params.row.isActive ? "🔒": "🔓"}</button> */}
            <Link className="editButton" to={`${params.row.id}/edit`} style={{ textDecoration: "none" }}>
              Edit
            </Link>
          </div>
        );
      },
    },
  ];
  return (
    <div className="datatable">
      <div className="datatableTitle">
        Add New Cinema
        <Link to="/cinemas/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={cinemaColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        hideFooterRowCount
      />
    </div>
  );
};

export default Datatable_cinemas;
