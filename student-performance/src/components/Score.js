import { useParams, Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import Logo from './images/logo.png';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

function Score() {
    const { studentId } = useParams();
    const { teacherId } = useParams();
    const [score, setScore] = useState([]);
    const [studentName, setStudentName] = useState('');
    const navigate = useNavigate();
    const chartRef = useRef(null);

    useEffect(() => {
        axios.get(`http://localhost:3001/${teacherId}/getstudent/${studentId}`)
            .then(res => {
                setStudentName(res.data.name);
            })
            .catch(err => console.log(err));

        axios.get(`http://localhost:3001/${teacherId}/getscore/${studentId}`)
            .then(res => {
                console.log('Score API Response:', res.data);
                setScore(res.data);
            })
            .catch(err => console.log(err));
    }, [studentId, teacherId]);

    useEffect(() => {
        if (score.length > 0) {
            const scoresByWeek = groupScoresByWeek(score);
            renderChart(scoresByWeek);
        }
    }, [score]);

    const handleDeleteScore = (scoreId) => {
        axios.delete(`http://localhost:3001/${teacherId}/deletescore/${scoreId}`)
            .then(res => {
                console.log(res);
                setScore(score.filter(score => score._id !== scoreId));
            })
            .catch(err => console.log(err));
    };

    const logout = () => {
        // Clear the token from local storage
        localStorage.removeItem('token');
        navigate('/');
    };

    const getWeekNumber = (date) => {
        const oneJan = new Date(date.getFullYear(), 0, 1);
        const numberOfDays = Math.floor((date - oneJan) / (1000 * 60 * 60 * 24));
        const weekNumber = Math.ceil(numberOfDays / 7);
        return weekNumber;
    };

    const groupScoresByWeek = (scores) => {
        const weeks = {};
        scores.forEach((score) => {
            const date = new Date(score.date);
            const weekNumber = getWeekNumber(date);
            if (!weeks[weekNumber]) {
                weeks[weekNumber] = { week: weekNumber, scores: [] };
            }
            weeks[weekNumber].scores.push(score);
        });
        return Object.values(weeks);
    };

    let myChart = null; // Define a reference to the Chart instance

    const renderChart = (scoresByWeek) => {
        // Get chart canvas element
        const ctx = chartRef.current.getContext('2d');
    
        // Destroy the previous Chart instance if it exists
        if (Chart.getChart(ctx)) {
            Chart.getChart(ctx).destroy();
        }
    
        // Calculate overall score and totalscore
        let overallScore = 0;
        let overallTotalScore = 0;
    
        score.forEach((entry) => {
            overallScore += parseInt(entry.score);
            overallTotalScore += parseInt(entry.totalscore);
        });
    
        // Calculate percentage of overall score
        const scorePercentage = (overallScore / overallTotalScore) * 100;
        const remainingPercentage = 100 - scorePercentage;
    
        // Create chart data
        const chartData = {
            labels: ['Current Score', 'Total Score'],
            datasets: [{
                data: [scorePercentage.toFixed(2), remainingPercentage.toFixed(2)],
                backgroundColor: ['#36A2EB', '#FFCE56'],
            }],
        };
    
        // Chart options
        const chartOptions = {
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                },
                datalabels: {
                    display: true,
                    formatter: (value) => `${value}%`,
                    color: '#fff',
                },
            },
        };
    
        // Create new chart instance
        new Chart(ctx, {
            type: 'pie',
            data: chartData,
            options: chartOptions,
        });
    };


    // const randomColor = () => {
    //     const red = Math.floor(Math.random() * 256);
    //     const green = Math.floor(Math.random() * 256);
    //     const blue = Math.floor(Math.random() * 256);

    //     return `rgb(${red}, ${green}, ${blue})`;
    // };

    return (
        <div className="background-container" style={{ backgroundColor: '#fe830b', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
            <div className="container d-flex flex-column justify-content-start align-items-center" style={{ backgroundColor: '#ffffff', width: '1500px', minHeight: '100vh' }}>
                <div className="top-bar d-flex justify-content-between align-items-center p-3" style={{ width: '100%', borderBottom: '1px solid #ccc' }}>
                    <img src={Logo} alt="Logo" style={{ height: '75px' }} />
                    <button onClick={logout} className="btn btn-danger">Logout</button>
                </div>
                <div className="score-container p-4 d-flex justify-content-between" style={{ width: '100%' }}>
                    <div className="table-container" style={{ width: 'calc(50% - 10px)' }}>
                        <div className="d-flex justify-content-between align-items-center">
                            <Link to={`/${teacherId}`} className="btn btn-sm btn-danger mb-3">Back</Link>
                            <Link to={`/${teacherId}/addscore/${studentId}`} className="btn btn-sm btn-success mb-3">New Score</Link>
                        </div>
                        <h2>Record of {studentName}</h2>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Event</th>
                                    <th>Score</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {score.map(score => (
                                    <tr key={score._id}>
                                        <td>{score.event}</td>
                                        <td>{score.score}</td>
                                        <td>{score.date}</td>
                                        <td>
                                            <Link to={`/${teacherId}/updatescore/${studentId}/${score._id}`} className="btn btn-sm btn-primary me-2">Edit</Link>
                                            <button onClick={() => handleDeleteScore(score._id)} className="btn btn-sm btn-danger">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                        <div className="text-center">
                            <Link to={`/${teacherId}/addscore/${studentId}`} className="text-muted" style={{ textDecoration: 'none' }}>+ Add</Link>
                        </div>
                    </div>
                    <div className="chart-container" style={{ width: 'calc(50% - 10px)', maxHeight: '500px', overflowY: 'auto' }}>
                        <h2>Score visualization</h2>
                        <canvas id="scoreChart" ref={chartRef} style={{ width: '100%', height: '400px' }}></canvas>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Score;