import axios from "axios";

// export const cinemaColumns = [
//     { field: "id", headerName: "ID", width: 70 },
//     {
//       field: "name",
//       headerName: "Name",
//       width: 200,
//     },
//     {
//       field: "address",
//       headerName: "Address",
//       width: 150,
//     },
//       {
//       field: "address_url",
//       headerName: "Address URL",
//       width: 200,
//       renderCell: (params) => (
//         <a href={params.value} target="_blank" rel="noreferrer">{params.value}</a>)
//     },
//     {
//       field: "number_of_rooms",
//       headerName: "Number rooms",
//       width: 150,
//     },
//     {
//       field: "province",
//       headerName: "Province",
//       width: 150,
//     },

//     {
//       field: "showtimes",
//       headerName: "Show time",
//       width: 150,
//     },
//     {
//       field: "isActive",
//       headerName: "Status",
//       width: 160,
//       renderCell: (params) => {
//         return (
//           <div className={params.row.isActive ? "active" : "passive" }>{params.row.isActive ? "active" : "passive" }</div>
//         );
//       },
//     },
//   ];

export const cinemaColumns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Name", width: 250 },
  { field: "address", headerName: "Address", width: 250 },
  {
    field: "address_url",
    headerName: "Address URL",
    width: 350,
    renderCell: (params) => (
      <a href={params.value} target="_blank" rel="noreferrer">
        {params.value}
      </a>
    ),
  },
  { field: "number_of_rooms", headerName: "Number of Rooms", width: 150 }
];

export let cinemaRows = [];
const fetchCinemaData = async () => {
  if(cinemaRows.length<=0)
  {
    let temp, temp2 = [];
  await axios.get("https://uitcinema.devhungops.website/api/province?filter=notnull")
    .then(response => {
      temp = response.data.data;
      temp.forEach(element => {
        temp2 = element.cinemas;
        temp2.forEach(element2 => {
          if(element2.deleteAt==null)
            cinemaRows.push(element2)
        })
      });
    })
    .catch(error => {
      console.error('Error fetching cinema data:', error);
    });
  }
};
fetchCinemaData();

export let provinCinema = [];
const fetchprovinCinema = async () => {
  if(provinCinema.length<=0)
  {
    await axios.get("https://uitcinema.devhungops.website/api/province?filter=notnull")
    .then(response => {
      provinCinema = response.data;
    })
    .catch(error => {
      console.error('Error fetching cinema data:', error);
    });
  }
};
fetchprovinCinema();

