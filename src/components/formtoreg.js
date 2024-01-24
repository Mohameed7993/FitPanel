import { useState } from 'react';
import './form.css';
import { Outlet, Link } from "react-router-dom";

function Custdetails() {
  const [inputs, setInputs] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if all required fields are filled
    if (inputs.username && inputs.age && inputs.Address && inputs.Email) {
      setSubmitted(true);

      // Your fetch logic can go here
      // const response = await fetch('http://localhost:5000/user', {
      //   method: 'POST',
      //   body: JSON.stringify(inputs),
      //   headers: {
      //     'Content-Type': 'application/json'
      //   }
      // });
      // console.log(await response);
    } else {
      alert('Please fill in all required fields.');
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form">
        <label className="form-label">
        <h2>Registration</h2>
          Enter your name:  
          <input
            type="text"
            name="username"
            value={inputs.username}
            onChange={handleChange}
            className="form-input"
          />
        </label>

        <label className="form-label">
          Enter your age:
          <input
            type="number"
            name="age"
            value={inputs.age}
            onChange={handleChange}
            className="form-input"
          />
        </label>

        <label className="form-label">
          Enter your address:
          <input
            type="text"
            name="Address"
            value={inputs.Address}
            onChange={handleChange}
            className="form-input"
          />
        </label>

        <label className="form-label">
          Enter your email:
          <input
            type="email"
            name="Email"
            value={inputs.Email}
            onChange={handleChange}
            className="form-input"
          />
        </label>

        <button type="submit" className="form-button">
          Submit
        </button>


        
      </form>

      

      {submitted && (
        <div className="result-message">
          <h1>
                <h1>  </h1>Welcome to the club, <span>{inputs.username}</span>!
                <Link to="/login" className="gym-home-button">Login</Link>
          </h1>
        </div>
      )}
<div className="center">
        <div className="line"/>
        <div className="or">OR</div>
      </div>

    </div>
  );
}

export default Custdetails;
