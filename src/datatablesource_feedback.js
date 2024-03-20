export const feedbackColumns = [
  { field: "id", headerName: "ID", width: 70 },
  {
    field: "username",
    headerName: "User",
    width: 230,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img className="cellImg" src={params.row.img} alt="avatar" />
          {params.row.username}
        </div>
      );
    },
  },
  {
    field: "email",
    headerName: "Email",
    width: 230,
  },

  {
    field: "message",
    headerName: "Message",
    width: 400,
  },
  {
    field: "isInspected",
    headerName: "Status",
    width: 160,
    renderCell: (params) => {
      return (
        <div
          className={`cellWithStatus ${
            params.row.isInspected ? "Inspected" : "Uninspected"
          }`}
        >
          {params.row.isInspected ? "Inspected" : "Uninspected"}
        </div>
      );
    },
  },
  {
    field: "feedbackdate",
    headerName: "Feedback Date",
    width: 230,
  },
];

//temporary data
export const feedbackRows = [
  {
    id: 1,
    username: "Snow",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "1snow@gmail.com",
    message: "good",
    feedbackdate: "2023/05/20",
  },
  {
    id: 2,
    username: "Jamie Lannister",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "2snow@gmail.com",
    message: "nice",
    feedbackdate: "2023/05/17",
  },
];
