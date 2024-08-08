import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="container text-center my-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="jumbotron bg-light p-5 rounded">
            <h1 className="display-1 text-danger">404</h1>
            <h2 className="display-4">Oops! Page not found</h2>
            <p className="lead text-muted">
              The page you are looking for does not exist. It might have been moved or deleted.
            </p>
            <button onClick={handleGoBack} className="btn btn-primary btn-lg">Go Back</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
