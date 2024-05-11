import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Logo from './images/logo.png';

function UpdateTeacher() {
    const { teacherId } = useParams();
    const [name, setName] = useState()
    const [sex, setSex] = useState()
    const [subject, setSubject] = useState()
    const [username, setUsername] = useState()
    const [password, setPassword] = useState()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/admin/getteacher/${teacherId}`);
                setName(response.data.name);
                setSex(response.data.sex);
                setSubject(response.data.subject);
                setUsername(response.data.username);
                // setPassword(response.data.password);
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [teacherId]);

    const navigate = useNavigate();

    const handleUpdate = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:3001/admin/updateteacher/${teacherId}`, { name, sex, subject, username, password })
            .then(res => {
                console.log(res);
                navigate('/admin/view');
            })
            .catch(err => console.log(err));
    };

    const logout = () => {
        // Clear the token from local storage
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="background-container" style={{ backgroundColor: 'white', fontFamily: 'Arial, sans-serif', position: 'relative' }}>
            <div className="container d-flex flex-column" style={{ backgroundColor: '#ffffff', maxWidth: '700px', minHeight: '100vh' }}>
                <div className="top-bar d-flex justify-content-between align-items-center p-3" style={{ borderBottom: '1px solid #ccc' }}>
                    <img src={Logo} alt="Logo" style={{ height: '75px' }} />
                    <button onClick={logout} className="btn btn-danger">Logout</button>
                </div>
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <div className="register-container p-4" style={{ width: '500px' }}>
                        <form onSubmit={handleUpdate}>
                            <h2>Edit teacher details</h2>
                            <div className="mb-2">
                                <label htmlFor="">Name</label>
                                <input
                                    type="name"
                                    className="form-control"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <label htmlFor="">Sex</label>
                                <select className="form-control" value={sex} onChange={(e) => setSex(e.target.value)}>
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Prefer not to say">Prefer not to say</option>
                                </select>
                                <label htmlFor="">Subject</label>
                                <input
                                    type="subject"
                                    className="form-control"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                />
                                <label htmlFor="">Username</label>
                                <input
                                    type="username"
                                    className="form-control"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <label htmlFor="">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="d-flex justify-content-between">
                                <Link to={`/admin/view`} className="btn btn-sm btn-danger mb-3">Cancel</Link>
                                <button type="submit" className="btn btn-sm btn-success mb-3">Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UpdateTeacher;