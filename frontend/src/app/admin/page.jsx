"use client";

import { useState, useEffect, useRef } from "react";

// From Toastify
import { Bounce, toast } from "react-toastify";
import Swal from "sweetalert2";

// Component from shadcn
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Import from MUI
import { TablePagination } from "@mui/material";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";

// Import icon
import { TiCancel } from "react-icons/ti";
import { FiEdit } from "react-icons/fi";
import { Label } from "@/components/ui/label";

const Page = () => {
  const [data, setData] = useState([]);
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("http://");
  const [image, setImage] = useState(null);
  const [videoId, setVideoId] = useState("");
  const [department, setDepartment] = useState("");
  const [type, setType] = useState("");
  const [currentId, setCurrentId] = useState(-1);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const searchRef = useRef();

  const types = [
    { value: "gambar", label: "Gambar" },
    { value: "video", label: "Video" },
    { value: "dokumen", label: "Dokumen" },
    { value: "web", label: "Web" },
  ];

  const departments = [
    { value: "quality assurance", label: "Quality Assurance" },
    { value: "quality system", label: "Quality System" },
    { value: "quality control", label: "Quality Control" },
    { value: "warehouse", label: "Warehouse" },
    { value: "produksi", label: "Produksi" },
    { value: "teknik", label: "Teknik" },
    { value: "general affair", label: "General Affair" },
    { value: "manufacturing development", label: "Manufacturing Development" },
    { value: "analytical development", label: "Analytical Development" },
    { value: "packaging development", label: "Packaging Development" },
    { value: "formula development", label: "Formula Development" },
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin-data`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then((data) => {
          setData(data);
          // console.log(data);
        })
        .catch((error) => {
          console.error("error", error.message);
        });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Search
  const [search, setSearch] = useState("");

  useEffect(() => {
    const filteredData = data.filter((item) => item.title.toLowerCase().includes(search.toLowerCase())) || [];

    setData(filteredData);
  }, []);

  // Table Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Sort table data
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("title");

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const getComparator = (order, orderBy) => {
    return order === "desc" ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const columns = [
    { id: "title", label: "Title" },
    { id: "description", label: "Description" },
    { id: "type", label: "Type" },
    { id: "url", label: "Url" },
    { id: "video_link", label: "Video" },
    { id: "author", label: "Author" },
    { id: "department", label: "Department" },
    { id: "action", label: "Action" },
  ];

  const handleInputNewData = async () => {
    const formData = new FormData();
    formData.append("author", author);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("url", url);
    formData.append("image", image);
    formData.append("video_id", videoId);
    formData.append("department", department);
    formData.append("type", type);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/input-data`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("Data berhasil di input", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeButton: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });

        setAuthor("");
        setTitle("");
        setDescription("");
        setUrl("");
        setImage(null); // Assuming image is a file input
        setVideoId("");
        setDepartment("");
        setType("");
      } else {
        toast.error("Error during data input", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeButton: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }
    } catch (error) {
      toast.error("Network or server error", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeButton: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  const handleUpdateData = async () => {
    const formData = new FormData();
    formData.append("id", currentId);
    formData.append("author", author);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("url", url);
    formData.append("image", image);
    formData.append("video_id", videoId);
    formData.append("department", department);
    formData.append("type", type);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/update-data`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        setAuthor("");
        setTitle("");
        setDescription("");
        setUrl("");
        setImage(null);
        setVideoId("");
        setDepartment("");
        setType("");
        setCurrentId(-1);

        toast.success("Data berhasil di input", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeButton: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      } else {
        toast.error("Error during data input", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeButton: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Network or server error", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeButton: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  const handleEdit = (row) => {
    setAuthor(row.author);
    setTitle(row.title);
    setDescription(row.description);
    setUrl(row.url);
    setImage(row.image);
    setVideoId(row.video_link);
    setDepartment(row.department);
    setType(row.type);
    setCurrentId(row.id);
    setIsEditDialogOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentId === -1) {
      handleInputNewData();
    } else {
      handleUpdateData();
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't to delete this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/delete-data`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
          }).then(async (response) => {
            if (!response.ok) {
              throw new Error("Failed to delete data");
            }

            if (response.ok) {
              toast.success("delete successfully", {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeButton: false,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "light",
                transition: Bounce,
              });
            }
          });
        } catch (error) {
          console.error(error);
        }
      }
    });
  };

  return (
    <>
      <section>
        <main className="py-4">
          <div className="w-full h-full flex items-center mt-5">
            <div className="w-full border rounded-lg p-8 shadow-xl">
              <div className="flex justify-between items-center">
                <div>
                  <Input ref={searchRef} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search..." className="bg-gray-100"></Input>
                </div>
                <div>
                  {/* Add Data */}
                  <Button onClick={() => setIsEditDialogOpen(true)}>+ Add data</Button>
                </div>
              </div>

              {/* Show data */}
              <div className="overflow-auto mt-10">
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead className="bg-gray-100">
                      <TableRow>
                        {columns.map((column) => (
                          <TableCell key={column._id} sortDirection={orderBy === column.id ? order : false}>
                            <TableSortLabel hideSortIcon direction={orderBy === column.id ? order : "asc"} onClick={() => handleRequestSort(column.id)}>
                              <span className="font-bold">{column.label}</span>
                            </TableSortLabel>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stableSort(data, getComparator(order, orderBy))
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => (
                          <TableRow key={row.id}>
                            <TableCell>{row.title}</TableCell>
                            <TableCell>{row.description}</TableCell>
                            <TableCell>{row.type}</TableCell>
                            <TableCell>{row.url}</TableCell>
                            <TableCell>{row.video_link}</TableCell>
                            <TableCell>{row.author}</TableCell>
                            <TableCell>{row.department}</TableCell>
                            <TableCell className="whitespace-nowrap">
                              <button onClick={() => handleEdit(row)} className="w-10 bg-[#3C84AB] mr-2 p-2 rounded hover:bg-[#6096B4] focus:outline-none">
                                <FiEdit size={21} color={"white"} className="mx-auto" />
                              </button>
                              <button onClick={() => handleDelete(row.id)} className="w-10 bg-[#EB455F] p-2 rounded hover:bg-[#C92C6D] focus:outline-none">
                                <TiCancel size={21} color={"white"} className="mx-auto" />
                              </button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              <TablePagination
                rowsPerPageOptions={[5, 10, 15]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={Math.max(0, Math.min(page, Math.ceil(data.length / rowsPerPage) - 1))}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </div>
          </div>
        </main>
      </section>

      {/* Dialog Add or Edit Data */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Data</DialogTitle>
            <DialogDescription>Pastikan url dengan benar</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="my-2">
              <Label htmlFor="title">Title</Label>
              <Input type="text" placeholder="Input title" value={title} onChange={(e) => setTitle(e.target.value)} required></Input>
            </div>
            <div className="my-2">
              <Label htmlFor="description">Description</Label>
              <textarea type="text" placeholder="Input description" className="w-full h-[100px] pl-2 pt-1 border rounded-md" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
            </div>
            <div className="my-2">
              <Label htmlFor="image">Upload Image</Label>
              <Input type="file" onChange={(e) => setImage(e.target.files[0])}></Input>
            </div>
            <div className="my-2">
              <Label htmlFor="type">Select Type</Label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="w-full border p-2 rounded-md" required>
                <option value="" disabled>
                  Select a type
                </option>
                {types.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="my-2">
              <Label htmlFor="url">URL address</Label>
              <Input type="text" placeholder="Input url" value={url} onChange={(e) => setUrl(e.target.value)} required></Input>
            </div>
            <div className="my-2">
              <Label htmlFor="video">ID Video</Label>
              <Input type="text" placeholder="Input id video" value={videoId} onChange={(e) => setVideoId(e.target.value)}></Input>
            </div>
            <div className="my-2">
              <Label htmlFor="author">Author</Label>
              <Input type="text" placeholder="Input author" value={author} onChange={(e) => setAuthor(e.target.value)} required></Input>
            </div>
            <div className="my-2">
              <Label htmlFor="department">Select Department</Label>
              <select value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full border p-2 rounded-md" required>
                <option value="" disabled>
                  Select a department
                </option>
                {departments.map((department) => (
                  <option key={department.value} value={department.value}>
                    {department.label}
                  </option>
                ))}
              </select>
            </div>

            {currentId === -1 ? (
              <Button type="submit" className="mt-4">
                Submit
              </Button>
            ) : (
              <Button type="submit" className="mt-4" onClick={handleUpdateData}>
                Update
              </Button>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Page;
