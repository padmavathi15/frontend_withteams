import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const ClassroomOverview = () => {
  const [marksData, setMarksData] = useState([
    { studentId: 1, studentName: "kuldeep", subjectName: "Math", marks: 85 },
    { studentId: 2, studentName: "teja", subjectName: "Science", marks: 90 },
    { studentId: 3, studentName: "manisha", subjectName:"socail", marks:95},
  ]);

  const [attendanceData, setAttendanceData] = useState([
    { studentId: 1, studentName: "kuldeep", attendance: "Present", percentage: 90 },
    { studentId: 2, studentName: "teja", attendance: "Absent", percentage: 70 },
    { studentId: 3, studentName: "gnani", attendance: "present", percentage: 80 },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [modalType, setModalType] = useState("");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [marksPerPage] = useState(5);
  const [attendancePerPage] = useState(5);

  // Sort & Filter States
  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterText, setFilterText] = useState("");

  const openModal = (type, data = null) => {
    setModalType(type);
    setModalData(data);
    setIsModalOpen(true);
  };

  const handleSubmit = (data) => {
    if (modalType === "addMarks") {
      setMarksData([
        ...marksData,
        { ...data, studentId: marksData.length ? marksData[marksData.length - 1].studentId + 1 : 1 },
      ]);
    } else if (modalType === "editMarks") {
      setMarksData(
        marksData.map((student) => (student.studentId === data.studentId ? data : student))
      );
    } else if (modalType === "addAttendance") {
      setAttendanceData([
        ...attendanceData,
        {
          ...data,
          studentId: attendanceData.length
            ? attendanceData[attendanceData.length - 1].studentId + 1
            : 1,
        },
      ]);
    } else if (modalType === "editAttendance") {
      setAttendanceData(
        attendanceData.map((student) => (student.studentId === data.studentId ? data : student))
      );
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id, type) => {
    if (type === "marks") {
      setMarksData(marksData.filter((student) => student.studentId !== id));
    } else if (type === "attendance") {
      setAttendanceData(attendanceData.filter((student) => student.studentId !== id));
    }
  };

  const handleSort = (column) => {
    const newSortOrder = sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortOrder(newSortOrder);
  };

  const sortData = (data) => {
    return data.sort((a, b) => {
      if (a[sortColumn] < b[sortColumn]) return sortOrder === "asc" ? -1 : 1;
      if (a[sortColumn] > b[sortColumn]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  };

  const filterData = (data) => {
    return data.filter((item) => item.studentName.toLowerCase().includes(filterText.toLowerCase()));
  };

  const paginateData = (data, perPage, currentPage) => {
    const startIndex = (currentPage - 1) * perPage;
    return data.slice(startIndex, startIndex + perPage);
  };

  const totalMarksPages = Math.ceil(marksData.length / marksPerPage);
  const totalAttendancePages = Math.ceil(attendanceData.length / attendancePerPage);

  return (
    <div className="container mt-4">
      <h4 className="mb-4">Marks Overview</h4>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by student name"
        onChange={(e) => setFilterText(e.target.value)}
        value={filterText}
      />
      <button className="btn btn-primary mb-3" onClick={() => openModal("addMarks")}>Add Marks</button>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th onClick={() => handleSort("studentId")}>Student ID</th>
            <th onClick={() => handleSort("studentName")}>Student Name</th>
            <th onClick={() => handleSort("subjectName")}>Subject Name</th>
            <th onClick={() => handleSort("marks")}>Marks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginateData(sortData(filterData(marksData)), marksPerPage, currentPage).map((student) => (
            <tr key={student.studentId}>
              <td>{student.studentId}</td>
              <td>{student.studentName}</td>
              <td>{student.subjectName}</td>
              <td>{student.marks}</td>
              <td>
                <button className="btn btn-warning mr-2" onClick={() => openModal("editMarks", student)}>Edit</button>
                <button className="btn btn-danger" onClick={() => handleDelete(student.studentId, "marks")}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))} disabled={currentPage === 1}>Previous</button>
        <span> Page {currentPage} of {totalMarksPages} </span>
        <button onClick={() => setCurrentPage(Math.min(currentPage + 1, totalMarksPages))} disabled={currentPage === totalMarksPages}>Next</button>
      </div>

      <h4 className="mb-4 mt-5">Attendance Overview</h4>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by student name"
        onChange={(e) => setFilterText(e.target.value)}
        value={filterText}
      />
      <button className="btn btn-primary mb-3" onClick={() => openModal("addAttendance")}>Add Attendance</button>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Student Name</th>
            <th>Attendance</th>
            <th>Percentage</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginateData(sortData(filterData(attendanceData)), attendancePerPage, currentPage).map((student) => (
            <tr key={student.studentId}>
              <td>{student.studentId}</td>
              <td>{student.studentName}</td>
              <td>{student.attendance}</td>
              <td>{student.percentage}%</td>
              <td>
                <button className="btn btn-warning mr-2" onClick={() => openModal("editAttendance", student)}>Edit</button>
                <button className="btn btn-danger" onClick={() => handleDelete(student.studentId, "attendance")}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))} disabled={currentPage === 1}>Previous</button>
        <span> Page {currentPage} of {totalAttendancePages} </span>
        <button onClick={() => setCurrentPage(Math.min(currentPage + 1, totalAttendancePages))} disabled={currentPage === totalAttendancePages}>Next</button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        modalType={modalType}
        initialData={modalData}
      />
    </div>
  );
};

const Modal = ({ isOpen, onClose, onSubmit, modalType, initialData }) => {
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [marks, setMarks] = useState("");
  const [attendance, setAttendance] = useState("");
  const [percentage, setPercentage] = useState("");

  useEffect(() => {
    if (initialData) {
      setStudentId(initialData.studentId);
      setStudentName(initialData.studentName);
      if (modalType.includes("Marks")) {
        setSubjectName(initialData.subjectName);
        setMarks(initialData.marks);
      } else if (modalType.includes("Attendance")) {
        setAttendance(initialData.attendance);
        setPercentage(initialData.percentage);
      }
    } else {
      setStudentId("");
      setStudentName("");
      setSubjectName("");
      setMarks("");
      setAttendance("");
      setPercentage("");
    }
  }, [initialData, modalType]);

  const handleSubmit = () => {
    const data = {
      studentId: initialData ? studentId : undefined,
      studentName,
      ...(modalType.includes("Marks") ? { subjectName, marks: parseInt(marks, 10) } : {}),
      ...(modalType.includes("Attendance") ? { attendance, percentage: parseFloat(percentage) } : {}),
    };
    onSubmit(data);
    onClose();
  };

  if (!isOpen) return null;

  const actionType = modalType.includes("edit") ? "Edit" : "Add";
  const itemType = modalType.includes("Marks") ? "Marks" : "Attendance";

  return (
    <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{actionType} {itemType}</h5>
            <button type="button" className="close" onClick={onClose}>&times;</button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label>Student Name:</label>
              <input
                type="text"
                className="form-control"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
              />
            </div>
            {modalType.includes("Marks") && (
              <>
                <div className="form-group">
                  <label>Subject Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Marks:</label>
                  <input
                    type="number"
                    className="form-control"
                    value={marks}
                    onChange={(e) => setMarks(e.target.value)}
                  />
                </div>
              </>
            )}
            {modalType.includes("Attendance") && (
              <>
                <div className="form-group">
                  <label>Attendance:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={attendance}
                    onChange={(e) => setAttendance(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Percentage:</label>
                  <input
                    type="number"
                    className="form-control"
                    value={percentage}
                    onChange={(e) => setPercentage(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
            <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassroomOverview;