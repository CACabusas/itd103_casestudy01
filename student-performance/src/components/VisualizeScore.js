import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Chart from 'chart.js/auto';

function VisualizeScore() {
    const { studentId } = useParams();
    const [scores, setScores] = useState([]);
    const [studentName, setStudentName] = useState('');

    useEffect(() => {
        axios.get(`http://localhost:3001/getstudent/${studentId}`)
            .then(res => {
                setStudentName(res.data.name);
            })
            .catch(err => console.log(err));

        axios.get(`http://localhost:3001/getscore/${studentId}`)
            .then(res => {
                setScores(res.data);
                renderChart(res.data);
            })
            .catch(err => console.log(err));
    }, [studentId]);

    const renderChart = (scores) => {
        const scoreData = {};
        scores.forEach(score => {
            const date = score.date.split('T')[0]; // Extracting date without time
            if (scoreData[date]) {
                scoreData[date] += score.score;
            } else {
                scoreData[date] = score.score;
            }
        });

        const labels = Object.keys(scoreData);
        const data = Object.values(scoreData);

        const ctx = document.getElementById('scoreChart');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Score',
                    data: data,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    };

    return (
        <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
            <div className="w-50 bg-white rounded p-3">
                <Link to={`/getscore/${studentId}`} className="btn btn-sm btn-success mb-3">Back</Link>
                <h2>Visualization of Scores for {studentName}</h2>
                <canvas id="scoreChart"></canvas>
            </div>
        </div>
    );
}

export default VisualizeScore;