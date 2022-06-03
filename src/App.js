import { useState, useEffect } from "react";
import "./App.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Checkbox from "@mui/material/Checkbox";
import SearchIcon from "@mui/icons-material/Search";
// import InfiniteScroll from "react-infinite-scroll-component";

import CircularProgress from "@mui/material/CircularProgress";

const url =
  "https://storage.googleapis.com/thereviewindex-generalindex-views/tmp/users.json";

// const counter = 1;

function App() {
  const [input, setInput] = useState({
    title: "",
    firstName: "",
    lastName: "",
  });

  const [records, setRecords] = useState([]);
  const [filteredrecords, setFilteredrecords] = useState([]);
  const [idarr, setIdarr] = useState([]);
  const [checked, setChecked] = useState(false);
  const [checkedAll, setCheckedAll] = useState(false);
  const [selected, setSelected] = useState(false);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(20);

  window.onscroll = function (ev) {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight &&
      end < records.length
    ) {
      document.getElementById("loader").style.display = "block";
      setTimeout(() => {
        setStart(0);
        setEnd(end + 11);
      }, 1000);
    } else {
      document.getElementById("loader").style.display = "none";
    }
  };

  async function getData() {
    const response = await fetch(url, { method: "GET" });
    const data = await response.json();
    setRecords(data.data);
    setFilteredrecords(data.data);
  }

  useEffect(() => {
    getData();
  }, []);

  const handleDelete = (id) => {
    const updatedRecords = records.filter((items) => {
      return items.id !== id;
    });
    setFilteredrecords(updatedRecords);
  };

  const handleDeleteMultiple = (id) => {
    const updatedRecords = records.filter((items) => {
      return !id.includes(items.id);
    });
    setFilteredrecords(updatedRecords);
    setChecked(false);
  };

  const handleChange = (event) => {
    console.log(event.target.value);
    let keyword = event.target.value;
    var output = records.filter((item) => {
      return (
        item.firstName.toLowerCase().includes(keyword.toLowerCase()) ||
        item.lastName.toLowerCase().includes(keyword.toLowerCase())
      );
    });
    setFilteredrecords(output);
  };

  const handleCheck = (id) => {
    document.getElementById("deleteActive").style.backgroundColor = "#4d94ff";
    document.getElementById("deleteActive").style.color = "white";
    idarr.push(id);
  };

  const handleCheckAll = (event) => {
    setChecked(event.target.checked);
    setCheckedAll(event.target.checked);
    setSelected(event.target.checked);
    document.getElementById("deleteActive").style.backgroundColor = "#4d94ff";
    document.getElementById("deleteActive").style.color = "white";
    records.map((items) => {
      return idarr.push(items.id);
    });
  };

  const handleInput = (event) => {
    setInput({ ...input, [event.target.name]: event.target.value });
  };

  const handleEdit = (items) => {
    setInput(items);
    document.getElementById("focusTitle").focus();
    document.getElementById("userForm").style.display = "block";
  };

  const handleUpdate = () => {
    window.alert("Error: PATCH API MISSING");
  };

  const displayRecords = (start, end) => {
    if (filteredrecords) {
      return filteredrecords.slice(start, end).map((items) => (
        <TableRow key={items.id} selected={selected}>
          <TableCell align="center">
            {/* <input type="checkbox" onClick={() => handleCheck(iAlltems.id)} /> */}
            <Checkbox
              // checked={checkedAll}
              onClick={() => handleCheck(items.id)}
            />
          </TableCell>

          <TableCell align="center">
            <img src={items.picture} alt="userpicture" height={20} width={20} />
          </TableCell>
          <TableCell align="center"> {items.title}</TableCell>
          <TableCell align="center">{items.firstName}</TableCell>
          <TableCell align="center">{items.lastName}</TableCell>
          <TableCell align="center">
            <EditIcon className="icon" onClick={() => handleEdit(items)} />
            &nbsp; &nbsp;
            <DeleteIcon
              className="icon"
              onClick={() => handleDelete(items.id)}
            />
          </TableCell>
        </TableRow>
      ));
    }
  };

  return (
    <>
      <div className="table">
        <div className="userControl">
          <div className="keywordFilter">
            {/* <label htmlFor="">Search by First Name</label> */}
            <div className="search">
              <SearchIcon />
              <input
                id="searchFilter"
                type="text"
                onChange={handleChange}
                placeholder="Search by first name, last name"
              />
            </div>
          </div>
          <div className="deleteMultiple">
            <div>
              <button
                className="deleteSelected"
                id="deleteActive"
                onClick={() => handleDeleteMultiple(idarr)}
              >
                Delete Selected
              </button>
            </div>
          </div>
        </div>
        <div id="userForm">
          <div className="editForm">
            <input
              type="text"
              placeholder="Enter title"
              name="title"
              id="focusTitle"
              value={input.title}
              onChange={handleInput}
            />
            <input
              type="text"
              placeholder="Enter first name"
              name="firstName"
              value={input.firstName}
              onChange={handleInput}
            />
            <input
              type="text"
              placeholder="Enter second name"
              name="lastName"
              value={input.lastName}
              onChange={handleInput}
            />
            <button type="submit" onClick={handleUpdate} className="update">
              Update
            </button>
          </div>
        </div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  <Checkbox checked={checked} onChange={handleCheckAll} />
                </TableCell>
                <TableCell align="center" className="title">
                  Image
                </TableCell>
                <TableCell align="center" className="title">
                  Title
                </TableCell>
                <TableCell align="center" className="title">
                  First Name
                </TableCell>
                <TableCell align="center" className="title">
                  Last Name
                </TableCell>
                <TableCell align="center" className="title">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>{displayRecords(start, end)}</TableBody>
          </Table>
        </TableContainer>
        <div id="loader">
          <div className="circularProgress">
            <CircularProgress size={20} />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
