import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from './images/logo.png';

function AdminHome() {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/admin/teachers');
        setTeachers(response.data);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };

    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:3001/admin/students');
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchTeachers();
    fetchStudents();
  }, []);

  const handleDeleteTeacher = async (teacherId) => {
    try {
      await axios.delete(`http://localhost:3001/admin/teachers/${teacherId}`);
      setTeachers(teachers.filter((teacher) => teacher._id !== teacherId));
    } catch (error) {
      console.error('Error deleting teacher:', error);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    try {
      await axios.delete(`http://localhost:3001/admin/deletestudent/${studentId}`);
      setStudents(students.filter((student) => student._id !== studentId));
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const logout = () => {
    // Clear the token from local storage
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="background-container" style={{ backgroundColor: 'white', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <div className="container d-flex flex-column justify-content-start align-items-center" style={{ backgroundColor: '#ffffff', width: '1500px', minHeight: '100vh' }}>
        <div className="top-bar d-flex justify-content-between align-items-center p-3" style={{ width: '100%', borderBottom: '1px solid #ccc' }}>
          <img src={Logo} alt="Logo" style={{ height: '75px' }} />
          <button onClick={logout} className="btn btn-danger">Logout</button>
        </div>
        <div className="d-flex justify-content-between w-100">
          <div className="teacher-container p-4" style={{ width: '49%' }}>
            <h3 className="mb-4">Teachers</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Subject</th>
                  <th>Username</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => (
                  <tr key={teacher._id}>
                    <td>{teacher.name}</td>
                    <td>{teacher.subject}</td>
                    <td>{teacher.username}</td>
                    <td>
                      <Link to={`/admin/updateteacher/${teacher._id}`} className="btn btn-sm btn-primary me-2">Edit</Link>
                      <button onClick={() => handleDeleteTeacher(teacher._id)} className="btn btn-sm btn-danger">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="student-container p-4" style={{ width: '49%' }}>
            <h3 className="mb-4">Students</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Sex</th>
                  <th>Section</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td>{student.name}</td>
                    <td>{student.sex}</td>
                    <td>{student.section}</td>
                    <td>
                      <Link to={`/admin/${student.teacher}/updatestudent/${student._id}`} className="btn btn-sm btn-primary me-2">Edit</Link>
                      <button onClick={() => handleDeleteStudent(student._id)} className="btn btn-sm btn-danger">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;