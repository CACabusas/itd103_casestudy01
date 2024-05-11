import { Link, useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react'
import axios from "axios";
import Logo from './images/logo.png';

function Student() {
    const { teacherId } = useParams();
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredStudent, setFilteredStudent] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate(`/`);
            return;
        }

        axios.get(`http://localhost:3001/${teacherId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                setData(res.data);
                setFilteredStudent(res.data);
            })
            .catch(err => console.log(err));
    }, [teacherId])

    const handleSearch = async () => {
        if (!searchTerm) {
            alert('Please enter a search term');
            return;
        }

        try {
            const response = await axios.get(`http://localhost:3001/${teacherId}/searchstudent?q=${searchTerm}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}` // Include JWT token in the request header
                }
            });
            setData(response.data);
        } catch (error) {
            console.error(error);
            alert('An error occurred while searching');
        }
    };

    const handleDelete = (studentId) => {
        axios.delete(`http://localhost:3001/${teacherId}/deletestudent/${studentId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}` // Include JWT token in the request header
            }
        })
            .then(res => {
                console.log(res);
                setData(data.filter(student => student._id !== studentId));
            })
            .catch(err => console.log(err))
    }

    const logout = () => {
        // Clear the token from local storage
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="background-container" style={{ backgroundColor: '#fe830b', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
            <div className="container d-flex flex-column justify-content-start align-items-center" style={{ backgroundColor: '#ffffff', width: '1500px', minHeight: '100vh' }}>
                <div className="top-bar d-flex justify-content-between align-items-center p-3" style={{ width: '100%', borderBottom: '1px solid #ccc' }}>
                    <img src={Logo} alt="Logo" style={{ height: '75px' }}/>
                    <button onClick={logout} className="btn btn-danger">Logout</button>
                </div>
                <div className="student-container p-4" style={{ width: '1000px' }}>
                    <div className="d-flex justify-content-between align-items-center">
                        <form className="d-flex justify-content-center align-items-center" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                            <input
                                type="text"
                                placeholder="Search student name"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ marginRight: '5px' }}
                            />
                            <button type="submit" className="btn btn-sm btn-primary">Search</button>
                        </form>
                        <Link to={`/${teacherId}/addstudent/`} className="btn btn-sm btn-success">Add Student</Link>
                    </div>
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
                            {
                                data.map((student, index) => {
                                    return <tr key={index}>
                                        <td>{student.name}</td>
                                        <td>{student.sex}</td>
                                        <td>{student.section}</td>
                                        <td>
                                            <Link to={`/${teacherId}/getscore/${student._id}`} className="btn btn-sm btn-success me-2">View</Link>
                                            <Link to={`/${teacherId}/updatestudent/${student._id}`} className="btn btn-sm btn-primary me-2">Edit</Link>
                                            <button onClick={() => handleDelete(student._id)} className="btn btn-sm btn-danger">Delete</button>
                                        </td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                    <div className="text-center">
                        <Link to={`/${teacherId}/addstudent/`} className="text-muted" style={{ textDecoration: 'none' }}>+ Add</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Student;