import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useTheme } from './context/ThemeContext';

import Home from './Home';
import About from './About';
import Contact from './Contact';
import ProtectedRoute from '../ProtectedRoute';
import PublicRoute from '../PublicRoute';
import NotFound from '../NotFound';
import Master from './Master';
import Login from './Login';
import ForgotPassword from './ForgotPassword';
import UpdateProfile from './UpdateProfile';
import Layouts from './Layouts'; 
import Signup from './Signup';
import Footer from './footer';
import Workoutplan from './Workoutplan';
import Trainers from '../pages/OnlineTrainers/Trainers';
import Manager from '../pages/MangersTool/Manager';
import Customer from './Subscriber/Customers';
import '../index.css';

// const PublicRoute = ({ element: Component, ...rest }) => {
//   const { currentUser,getUserRole } = useAuth();


//   return  getUserRole&& !currentUser ? <Component {...rest} /> :getUserRole()===8? <Navigate to="/trainer"/>:getUserRole()===10? <Navigate to="/master"/>:
//   getUserRole()===2? <Navigate to="/customer"/>:getUserRole()===9? <Navigate to="/manger"/>: <Navigate to="*"/>;
// };



function App() {
 const { theme } = useTheme();

 useEffect(() => {
  document.documentElement.setAttribute('data-theme', theme);
}, [theme]);

  return (
    <Router>
      <AuthProvider>
     
        <Layouts />
          <div className="d-flex flex-column min-vh-100">
            <div className="flex-grow-1">
              <Routes>
                <Route path="/" element={<PublicRoute element={Home} />} />  
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login/>} />  
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/trainer" element={<ProtectedRoute element={Trainers} requiredRole={8} />} />
                <Route path="/customer" element={<ProtectedRoute element={Customer} requiredRole={2} />} />
                <Route path="/forgot-password" element={<ProtectedRoute element={ForgotPassword} />} />
                <Route path="/update-profile" element={<ProtectedRoute element={UpdateProfile} />} /> 
                <Route path="/workoutplan" element={<ProtectedRoute element={Workoutplan} />} /> 
                <Route path="/master" element={<ProtectedRoute element={Master} requiredRole={10}/>} />
                <Route path="/manager" element={<ProtectedRoute element={Manager} requiredRole={9}/>} /> 
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Footer />
          </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
