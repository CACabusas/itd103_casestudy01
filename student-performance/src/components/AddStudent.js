import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import Logo from './images/logo.png';

function AddStudent() {

    const [name, setName] = useState("");
    const [sex, setSex] = useState("");
    const [section, setSection] = useState("");
    const { teacherId } = useParams();

    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate(`/`);
            return;
        }
    }, [navigate])

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post(`http://localhost:3001/${teacherId}/addstudent`, { name, sex, section })
            .then(res => {
                console.log(res);
                navigate(`/${teacherId}`)
            })
            .catch(err => console.log(err))
    }

    const logout = () => {
        // Clear the token from local storage
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="background-container" style={{ backgroundColor: '#fe830b', fontFamily: 'Arial, sans-serif', position: 'relative' }}>
            <div className="container d-flex flex-column" style={{ backgroundColor: '#ffffff', maxWidth: '700px', minHeight: '100vh' }}>
                <div className="top-bar d-flex justify-content-between align-items-center p-3" style={{ borderBottom: '1px solid #ccc'  }}>
                    <img src={Logo} alt="Logo" style={{ height: '75px' }}/>
                    <button onClick={logout} className="btn btn-danger">Logout</button>
                </div>
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <div className="new-student-container p-4" style={{ width: '500px' }}>
                        <form onSubmit={handleSubmit}>
                            <h2 className="text-center mb-4">Add a new student</h2>
                            <div className="mb-2">
                                <label htmlFor="">Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="">Sex</label>
                                <select
                                    className="form-control"
                                    value={sex}
                                    onChange={(e) => setSex(e.target.value)}
                                >
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Prefer not to say">Prefer not to say</option>
                                </select>
                            </div>
                            <div className="mb-2">
                                <label htmlFor="">Section</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={section}
                                    onChange={(e) => setSection(e.target.value)}
                                />
                            </div>
                            <div className="d-flex justify-content-between">
                                <Link to={`/${teacherId}`} className="btn btn-sm btn-danger mb-3">Cancel</Link>
                                <button type="submit" className="btn btn-sm btn-success mb-3">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddStudent;