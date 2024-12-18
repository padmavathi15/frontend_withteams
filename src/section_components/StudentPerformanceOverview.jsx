import React, { useState } from "react";
import { Form, Button, Table, Modal, Alert } from "react-bootstrap";
const StudentPerformanceOverview = () => {
  // Initial hardcoded student data
  const initialStudentsData = [
    { id: 1, name: "Alice", marks: [80, 90, 85, 88] },
    { id: 2, name: "Bob", marks: [70, 75, 80, 78] },
    { id: 3, name: "Charlie", marks: [95, 98, 100, 99] },
    { id: 4, name: "David", marks: [60, 65, 55, 70] },
  ];

  const [students, setStudents] = useState(initialStudentsData);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [editStudent, setEditStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentMarks, setNewStudentMarks] = useState("");
  const [showAddStudentForm, setShowAddStudentForm] = useState(false); // State to toggle the form visibility

  // Function to calculate total and average marks
  const calculateTotalAndAverage = (marks) => {
    const totalMarks = marks.reduce((sum, mark) => sum + mark, 0);
    const average = totalMarks / marks.length;
    return { totalMarks, average };
  };

  // Function to handle appreciation/warning based on average marks
  const handleNotification = (student) => {
    const { average } = calculateTotalAndAverage(student.marks);
    if (average >= 90) {
      setMessage(`Appreciation email sent to ${student.name}`);
    } else {
      setMessage(`Warning: ${student.name} needs improvement.`);
    }
  };

  // Function to handle editing marks
  const handleEditMarks = (student) => {
    setEditStudent(student);
    setShowModal(true);
  };

  // Function to update marks after editing
  const handleUpdateMarks = () => {
    const updatedStudents = students.map((student) =>
      student.id === editStudent.id
        ? { ...student, marks: editStudent.marks }
        : student
    );
    setStudents(updatedStudents);
    setShowModal(false);
  };

  // Function to handle adding a new student
  const handleAddStudent = () => {
    const marksArray = newStudentMarks.split(",").map(Number); // Convert marks to an array of numbers
    const newStudent = {
      id: students.length + 1,
      name: newStudentName,
      marks: marksArray,
    };
    setStudents([...students, newStudent]);
    setNewStudentName("");
    setNewStudentMarks("");
    setShowAddStudentForm(false); // Hide the form after adding the student
  };

  // Handle email input change
  const handleEmailChange = (e) => setEmail(e.target.value);

  return (
    <div className="container mt-5">
      <h2>Student Performance Overview</h2>

      {/* Show message (Appreciation or Warning) */}
      {message && (
        <Alert variant={message.includes("Appreciation") ? "success" : "danger"}>
          {message}
        </Alert>
      )}

      {/* Email Input for sending notifications */}
      <Form.Group controlId="emailInput" className="mb-3">
        <Form.Label>Enter Parent's Email for Notification:</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter parent's email"
          value={email}
          onChange={handleEmailChange}
        />
      </Form.Group>

      {/* Toggle Add New Student Form */}
      <Button
        variant="primary"
        onClick={() => setShowAddStudentForm(!showAddStudentForm)} // Toggle form visibility
      >
        {showAddStudentForm ? "Cancel" : "Add New Student"}
      </Button>

      {/* Add New Student Form */}
      {showAddStudentForm && (
        <Form className="mt-3">
          <Form.Group>
            <Form.Label>Student's Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Student's Name"
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mt-2">
            <Form.Label>Marks (comma-separated)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Marks"
              value={newStudentMarks}
              onChange={(e) => setNewStudentMarks(e.target.value)}
            />
          </Form.Group>
          <Button variant="success" className="mt-2" onClick={handleAddStudent}>
            Add Student
          </Button>
        </Form>
      )}

      {/* Students' Performance Table */}
      <Table striped bordered hover responsive className="mt-4">
        <thead>
          <tr>
            <th>Name</th>
            <th>Total Marks</th>
            <th>Average</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => {
            const { totalMarks, average } = calculateTotalAndAverage(
              student.marks
            );
            return (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{totalMarks}</td>
                <td>{average.toFixed(2)}</td>
                <td>
                  <Button variant="info" onClick={() => handleEditMarks(student)}>
                    Edit Marks
                  </Button>{" "}
                  <Button
                    variant="success"
                    onClick={() => handleNotification(student)}
                  >
                    Send Notification
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {/* Modal for Editing Marks */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Marks for {editStudent?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            value={editStudent?.marks.join(", ")}
            onChange={(e) => {
              const newMarks = e.target.value.split(",").map(Number);
              setEditStudent({ ...editStudent, marks: newMarks });
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateMarks}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StudentPerformanceOverview;
