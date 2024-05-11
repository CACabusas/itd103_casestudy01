import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [name, setName] = useState('');
  const [sex, setSex] = useState('');
  const [subject, setSubject] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/register', {
        name,
        sex,
        subject,
        username,
        password
      });

      // Assuming registration is successful
      console.log(response.data);
      navigate('/'); // Redirect to the login page after registration
    } catch (error) {
      setError('Registration failed');
      console.error(error);
    }
  };

  return (
    <div className="background-container" style={{backgroundColor: '#fe830b', fontFamily: 'Arial, sans-serif'}}>
      <div className="container d-flex justify-content-center align-items-center vh-100" style={{backgroundColor: '#ffffff', width: '700px'}}>
        <div className="register-container p-4" style={{width: '500px'}}>
          <h2 className="text-center mb-4">Create an account</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="sex" className="form-label">Sex</label>
              <select
                className="form-select"
                id="sex"
                value={sex}
                onChange={(e) => setSex(e.target.value)}
                required
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="subject" className="form-label">Subject</label>
              <input
                type="text"
                className="form-control"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="text-center">
                <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '50px', backgroundColor: '#fe830b', borderColor: '#fe830b', borderRadius: '25px', fontWeight: '550' }}>Register</button>
              </div>
          </form>
          <div className="text-center mt-3">
            <p className="mt-3">Already have an account? <Link to="/">Login</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
