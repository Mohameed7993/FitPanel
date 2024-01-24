import React, { useState } from 'react';
import './loginform.css'; 


const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username') {
      setUsername(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    // Here you can add logic to handle the login submission
    // For simplicity, let's just log the username and password for now
    console.log('Submitted:', { username, password });
  };

  return (
    <div className="login-form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label className='form-label'>
          Username:
          <input
            type="text"
            name="username"
            value={username}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
          />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
      {submitted && (
        <p>Login information submitted. Check the console for details.</p>
      )}
    </div>
  );
};

export default LoginForm;
