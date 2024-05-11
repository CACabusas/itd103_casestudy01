import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from './images/logo.png';

function AddScore() {

    const { studentId, teacherId } = useParams();
    const navigate = useNavigate();
    const [studentName, setStudentName] = useState('');
    const [event, setEvent] = useState('');
    const [score, setScore] = useState('');
    const [totalscore, setTotalScore] = useState('');
    const [date, setDate] = useState('');

    useEffect(() => {
        axios.get(`http://localhost:3001/${teacherId}/getstudent/${studentId}`)
            .then(res => {
                setStudentName(res.data.name);
            })
            .catch(err => console.log(err));
    }, [studentId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`http://localhost:3001/${teacherId}/addscore/${studentId}`, { event, score, totalscore, date })
            .then(res => {
                console.log(res);
                navigate(`/${teacherId}/getscore/${studentId}`);
            })
            .catch(err => console.log(err));
    };
    

    const logout = () => {
        // Clear the token from local storage
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="background-container" style={{ backgroundColor: '#fe830b', fontFamily: 'Arial, sans-serif', position: 'relative' }}>
            <div className="container d-flex flex-column" style={{ backgroundColor: '#ffffff', maxWidth: '700px', minHeight: '100vh' }}>
                <div className="top-bar d-flex justify-content-between align-items-center p-3" style={{ borderBottom: '1px solid #ccc' }}>
                    <img src={Logo} alt="Logo" style={{ height: '75px' }} />
                    <button onClick={logout} className="btn btn-danger">Logout</button>
                </div>
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <div className="register-container p-4" style={{ width: '500px' }}>
                        <h2>Add Score for {studentName}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label>Event</label>
                                <input type="text" className="form-control" value={event} onChange={(e) => setEvent(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label>Score</label>
                                <input type="text" className="form-control" value={score} onChange={(e) => setScore(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label>Total Score</label>
                                <input type="text" className="form-control" value={totalscore} onChange={(e) => setTotalScore(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label>Date</label>
                                <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
                            </div>
                            <div className="d-flex justify-content-between">
                                <Link to={`/${teacherId}/getscore/${studentId}`} className="btn btn-sm btn-danger mb-3">Cancel</Link>
                                <button type="submit" className="btn btn-sm btn-success mb-3">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddScore;