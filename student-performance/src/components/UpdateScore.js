import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from './images/logo.png';

function UpdateScore() {
    const { teacherId, studentId, scoreId } = useParams();
    const navigate = useNavigate();
    const [studentName, setStudentName] = useState('');
    const [event, setEvent] = useState('');
    const [scoreValue, setScoreValue] = useState('');
    const [totalscoreValue, setTotalScoreValue] = useState('');
    const [scoreDate, setScoreDate] = useState('');

    useEffect(() => {
        axios.get(`http://localhost:3001/${teacherId}/getstudent/${studentId}`)
            .then(res => {
                setStudentName(res.data.name);
            })
            .catch(err => console.log(err));

        axios.get(`http://localhost:3001/${teacherId}/getscore/${studentId}`)
            .then(res => {
                const foundScore = res.data.find(score => score._id === scoreId);
                if (foundScore) {
                    setEvent(foundScore.event);
                    setScoreValue(foundScore.score);
                    setTotalScoreValue(foundScore.totalscore);
                    setScoreDate(foundScore.date);
                }
            })
            .catch(err => console.log(err));
    }, [teacherId, studentId, scoreId]);

    const handleUpdate = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:3001/${teacherId}/updatescore/${studentId}/${scoreId}`, { 
            event: event,
            score: scoreValue,
            totalscore: totalscoreValue,
            date: scoreDate 
        })
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
                        <h2>Update Score for {studentName}</h2>
                        <form onSubmit={handleUpdate}>
                            <div className="mb-3">
                                <label>Event</label>
                                <input type="text" className="form-control" value={event} onChange={(e) => setEvent(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label>Score</label>
                                <input type="text" className="form-control" value={scoreValue} onChange={(e) => setScoreValue(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label>Total Score</label>
                                <input type="text" className="form-control" value={totalscoreValue} onChange={(e) => setTotalScoreValue(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label>Date</label>
                                <input type="date" className="form-control" value={scoreDate} onChange={(e) => setScoreDate(e.target.value)} />
                            </div>
                            <div className="d-flex justify-content-between">
                                <Link to={`/${teacherId}/getscore/${studentId}`} className="btn btn-sm btn-danger mb-3">Cancel</Link>
                                <button type="submit" className="btn btn-sm btn-success mb-3">Update</button>
                            </div>        
                        </form>
                    </div>
                </div>
            </div>
        </div> 
    );
}

export default UpdateScore;