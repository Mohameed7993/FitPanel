import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form ,Row,Col} from "react-bootstrap";
import {Timestamp} from "firebase/firestore";

import { getFunctions, httpsCallable } from "firebase/functions"; // Import Firebase Functions
import Pagination from 'react-bootstrap/Pagination';
import LoadingModal from '../LoadingModal';



const TrainersManagement = () => {
  const [users, setUsers] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // New state for search query
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 7;

  const [editUser, setEditUser] = useState({
    id: '',
    FirstName: '',
    LastName: '',
    EmailAddress: '',
    membershipStatus: '',
    PlanID: ''
  });
  const [previousPlanID, setPreviousPlanID] = useState(''); // State to track previous plan ID
  const [imageFile, setImageFile] = useState(null);
  const [months, setMonths] = useState(""); // State to store the selected number of months

  
  const functions = getFunctions(); // Initialize Firebase Functions

  const fetchUsers = async () => {
    try {

      const response = await fetch('/MoDumbels/Users');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const userData = await response.json();
   
      setUsers(userData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter customers based on search query
    if (searchQuery) {
      setFilteredCustomers(users.filter(user => user.UserId.includes(searchQuery)));
    } else {
      setFilteredCustomers(users);
    }
  }, [searchQuery, users]);


  const handleEditModalShow = (user) => {
    setEditUser(user);
    setPreviousPlanID(user.PlanID); // Set previous plan ID
    setShowEditModal(true);
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
    setImageFile(null);
    setMonths(""); // Reset the months selection
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prevUser) => ({
      ...prevUser,
      [name]: value
    }));

    // Reset months selection if PlanID changes
    if (name === "PlanID") {
      setMonths("");
    }
  };

  const handleImageFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const calculateExpirationDate = () => {
    const currentDate = new Date();
  
    if (editUser.PlanID === "111") {
      // Trial Plan: 1 month
      currentDate.setMonth(currentDate.getMonth() + 1);
    } else if (editUser.PlanID === "211") {
      // Elite Plan: 3 months
      currentDate.setMonth(currentDate.getMonth() + 3);
    } else if (editUser.PlanID === "241") {
      // Premium Plan: 6 months
      currentDate.setMonth(currentDate.getMonth() + 6);
    }
  
    return currentDate;
  };
  

  const updatePlanCount = async (oldPlanID, newPlanID) => {
    try {
      const response = await fetch('/MoDumbels/UpdateCounterAtTrainersPlan', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oldPlanID, newPlanID }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log(result.message); // Log success message
    } catch (error) {
      console.error('Error updating plan counts:', error);
    }
  };
  

  const handleUpdateUser = async () => {
    setShowLoadingModal(true)
    try {
      const formData = new FormData();
      const expirationDate = calculateExpirationDate();

        // Ensure previousPlanID and editUser.PlanID are valid
        const oldPlanID = previousPlanID;
        const newPlanID = editUser.PlanID;
    
        // Update plan counts only if the plan has changed
        if (oldPlanID !== newPlanID) {
          await updatePlanCount(oldPlanID, newPlanID);
          formData.append('planID', editUser.PlanID);
          formData.append('expirationDate',expirationDate);
        }

       // Ensure editUser.id is valid
       if (!editUser.id) {
        throw new Error("User ID is missing.");
      }
  

      
      formData.append('userId', editUser.id);
      formData.append('firstName', editUser.FirstName);
      formData.append('lastName', editUser.LastName);
      formData.append('emailAddress', editUser.EmailAddress);
      
      
      if (imageFile) {
        formData.append('imageFile', imageFile);
        console.log(1)
      }
  
      // Send the update request
      const response = await fetch('/MoDumbels/UpdateTrainerDetails', {
        method: 'PUT',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      await response.json();
  
      fetchUsers();
      setShowEditModal(false);
      setImageFile(null);
    } catch (error) {
      console.error("Error updating user:", error.message); // Log error message for debugging
    }
    setShowLoadingModal(false)

  };
  

  const handleSuspendToggle = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'activated' ? 'suspended' : 'activated';
    try {
      // Make a PUT request to the server to update membership status
      const response = await fetch('/MoDumbels/UpdateTrainerStatus', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, newStatus }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Update the local state after a successful update
      const updatedUser = await response.json();
      setUsers(users.map(user => user.id === userId ? { ...user, membershipStatus: newStatus } : user));
    } catch (error) {
      console.error("Error toggling membership status:", error);
    }
  };

  const getFormattedDate = (time) => {
    let timestamp;
  
    // Check if 'time' is already a Timestamp object
    if (time instanceof Timestamp) {
      timestamp = time;
    } else if (time && time.seconds !== undefined && time.nanoseconds !== undefined) {
      // If 'time' is raw data, convert it to a Timestamp object
      timestamp = new Timestamp(time.seconds, time.nanoseconds);
    } else {
      // Invalid input
      return "Invalid Date";
    }
  
    // Convert Timestamp to Date and format it
    const date = timestamp.toDate();
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };


  const handleDeleteUser = async (user) => {
    setShowLoadingModal(true);
    try {
      const res = await fetch(`/MoDumbels/deleteTrainer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          TrainerId: user.UserId,
          email: user.EmailAddress
        })
      });
      if (res.ok) {
        await fetchUsers(); // ✅ ensure data refreshes after deletion
      }else {
        console.error('Failed to delete customer.');
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
    setShowLoadingModal(false);
  };


  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage);
  
    return (
      <Pagination>
        {Array.from({ length: totalPages }, (_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    );
  };

  const indexOfLastCustomer = currentPage * rowsPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - rowsPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  const filteredUsers = currentCustomers.filter(user => user.role <= 9);
  return (
    
    <div className=" mt-4">
     <Row className="justify-content-end mb-3">
        <Col md={4}>
          <h5 className="text-end">:חיפוש לפי מספר זהות</h5>
          <Form.Control
          className="text-end"
              placeholder="מספר זהות"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Col>
        </Row>
      <h2>Online Trainers</h2>
      <div style={{ maxHeight: '400px', overflowY: 'scroll' }}>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Name</th>
            <th>Email Address</th>
            <th>Trainees Number</th>
            <th>Expiration Date</th>
            <th>Membership Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              
              <td>{user.id}</td>
              <td>
                {user.ImageURL ? (
                  <img src={user.ImageURL} alt="User" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                ) : (
                  'No Image'
                )}
              </td>
              <td>{user.FirstName} {user.LastName}</td>
              <td>{user.EmailAddress}</td>
              <td>{user.traineesNumber}</td>

            
              <td>{user.PlanID === "" ? "99/99/9999" : getFormattedDate(user.expirationDate)}</td>
              <td>{user.membershipStatus}</td>
              <td>
                <Button variant="primary" size="sm" onClick={() => handleEditModalShow(user)}>Edit</Button>{' '}
                <Button variant="danger" size="sm" onClick={() => handleDeleteUser(user)}>Delete</Button>{' '}
                <Button
                  size="sm"
                  variant={user.membershipStatus === 'activated' ? 'warning' : 'success'}
                  onClick={() => handleSuspendToggle(user.id, user.membershipStatus)}
                >
                  {user.membershipStatus === 'activated' ? 'Suspend' : 'Activate'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      </div>
      {renderPagination()}
      <Modal show={showEditModal} onHide={handleEditModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicFirstName">
              <Form.Label>First Name *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter first name"
                name="FirstName"
                value={editUser.FirstName}
                onChange={handleEditInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicLastName">
              <Form.Label>Last Name *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter last name"
                name="LastName"
                value={editUser.LastName}
                onChange={handleEditInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email Address *</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="EmailAddress"
                value={editUser.EmailAddress}
                onChange={handleEditInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPlan">
              <Form.Label>Plan *</Form.Label>
              <Form.Control
                as="select"
                name="PlanID"
                value={editUser.PlanID}
                onChange={handleEditInputChange}
              >
                <option value="">Select Plan</option>
                <option value="">Choose...</option>
  <option value="111">1 Month Plan</option>
  <option value="211">3 Months Plan</option>
  <option value="241">6 Months Plan</option>
              </Form.Control>
            </Form.Group>

         
            <Form.Group controlId="formFile">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control type="file" onChange={handleImageFileChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateUser}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <LoadingModal show={showLoadingModal} />

    </div>
  );
};

export default TrainersManagement;
