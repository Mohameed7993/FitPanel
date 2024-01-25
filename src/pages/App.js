import { AuthProvider } from '../context/AuthContext';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import About from './About';
import Contact from './Contact';
import NoPage from  './NoPage';
import Blogs from './Blogs';
import Layout from './Layout'; 
import { Container } from 'react-bootstrap';
import Signup from '../components/Signup';
import LoginForm from '../components/loginform';




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
         <Route path="blogs" element={<Blogs />} />
         <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="New Member" element={
          <AuthProvider> 
          <Container className="d-flex align-items-center justify-content-center" style={{minHeight: "550px"}}>
              <div className="w-100" style={{maxWidth:"400px"}}>
             < Signup/>
             </div>
          </Container>
                </AuthProvider>
              } 
              />
          <Route path="Login" element={< LoginForm/>} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;



/*import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;*/
