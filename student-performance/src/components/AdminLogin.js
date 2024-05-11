import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from './images/logo-vertical.png';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/admin/login', {
        username,
        password
      });

      const { message } = response.data;
      if (message === 'Admin login successful') {
        navigate('/admin/view');
      } else {
        setError('Login failed');
      }
    } catch (error) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="background-container" style={{ backgroundColor: 'white', fontFamily: 'Arial, sans-serif' }}>
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="login-container-wrapper d-flex justify-content-around" style={{ width: '100%', maxWidth: '2000px' }}>
          <div className="login-content" style={{ width: '1000px', marginRight: '20px' }}> {/* Added marginRight to create space */}
            <div className="d-flex justify-content-center align-items-center mb-4">
              <img src={Logo} alt="Logo" style={{ width: '350px' }} />
            </div>
            <h2 className="text-center" style={{ fontSize: '24px', fontWeight: '400' }}>Admin Login</h2>
          </div>
          <div className="login-form bg-white p-4 d-flex flex-column justify-content-center" style={{ width: '1000px', height: '500px', borderRadius: '50px' }}>
            <h3 className="text-center mb-4">Login to continue</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Username"
                  className="form-control"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  placeholder="Password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="text-center">
                <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '50px', backgroundColor: '#fe830b', borderColor: '#fe830b', borderRadius: '25px', fontWeight: '550' }}>Login</button>
              </div>
            </form>
            <div className="text-center mt-3">
              <p>Back to <Link to="/">user login</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;