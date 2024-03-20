import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import {
  feedbackColumns,
  feedbackRows,
} from "../../../datatablesource_feedback";
import { Link } from "react-router-dom";
import { useState } from "react";
import { CheckBox } from "@mui/icons-material";

const Datatable_feedback = () => {
  const [data, setData] = useState(feedbackRows);

  const handleAction = (id) => {
    const index = data.findIndex((item) => item.id === id);
    if (index !== -1) {
      const newData = [...data];
      newData[index].isInspected = !newData[index].isInspected;
      setData(newData);
    }
  };

  const actionColumn = [
    {
      field: "inspected",
      headerName: "Inspected",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <button
              className="activeButton"
              onClick={() => handleAction(params.row.id)}
            >
              {params.row.isInspected ? "✅" : "❌"}
            </button>
          </div>
        );
      },
    },
  ];
  return (
    <div className="datatable">
      <div className="datatableTitle">
        Add New Feedback
        <Link to="/feedbacks/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={feedbackColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
      />
    </div>
  );
};

export default Datatable_feedback;
