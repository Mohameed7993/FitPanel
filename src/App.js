import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import NoPage from  './pages/NoPage';
import Blogs from './pages/Blogs';
import Layout from './pages/Layout'; 
import Custdetails from './components/formtoreg'; 
import LoginForm from './components/loginform';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
         <Route path="blogs" element={<Blogs />} />
         <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="New Member" element={< Custdetails/>} />
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
