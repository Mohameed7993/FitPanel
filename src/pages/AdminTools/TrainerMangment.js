import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form ,Row,Col} from "react-bootstrap";
import { getFirestore, collection, query, where, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
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

  const db = getFirestore();
  const storage = getStorage();
  const functions = getFunctions(); // Initialize Firebase Functions

  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, 'Users');
      const q = query(usersCollection, where("role", "==", 8));
      const usersSnapshot = await getDocs(q);
      const userData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
      // Trial Plan: expiration date after 2 weeks
      currentDate.setDate(currentDate.getDate() + 14);
    } else if (editUser.PlanID === "211" || editUser.PlanID === "241") {
      // Elite or Premium Plan: expiration date based on months
      const numOfMonths = parseInt(months, 10);
      currentDate.setMonth(currentDate.getMonth() + numOfMonths);
    }
    return currentDate;
  };

  const updatePlanCount = async (oldPlanID, newPlanID) => {
    const planCollection = collection(db, 'TrainersPlans');

    if(oldPlanID!==""){
        const oldPlanDocRef = doc(planCollection, oldPlanID);
        const oldPlanDoc = await getDoc(oldPlanDocRef);

        if (oldPlanDoc.exists()) {
            const oldPlanData = oldPlanDoc.data();
            await updateDoc(oldPlanDocRef, { trainersNumber: oldPlanData.trainersNumber - 1 });
          }
    }
    if(newPlanID!==""){
        const newPlanDocRef = doc(planCollection, newPlanID);
        const newPlanDoc = await getDoc(newPlanDocRef);

        if (newPlanDoc.exists()) {
            const newPlanData = newPlanDoc.data();
                  await updateDoc(newPlanDocRef, { trainersNumber: newPlanData.trainersNumber + 1 });
          }

    }
  };

  const handleUpdateUser = async () => {
    setShowLoadingModal(true)
    try {
      let imageURL = editUser.ImageURL;
  
      if (imageFile) {
        const imageRef = ref(storage, `Users/${editUser.id}`);
        await uploadBytes(imageRef, imageFile);
        imageURL = await getDownloadURL(imageRef);
      }
  
      const expirationDate = calculateExpirationDate();
  
      // Ensure previousPlanID and editUser.PlanID are valid
      const oldPlanID = previousPlanID;
      const newPlanID = editUser.PlanID;
  
      // Update plan counts only if the plan has changed
      if (oldPlanID !== newPlanID) {
        await updatePlanCount(oldPlanID, newPlanID);
      }
  
      // Ensure editUser.id is valid
      if (!editUser.id) {
        throw new Error("User ID is missing.");
      }
  
      const userDocRef = doc(db, 'Users', editUser.id);
      await updateDoc(userDocRef, {
        FirstName: editUser.FirstName,
        LastName: editUser.LastName,
        EmailAddress: editUser.EmailAddress,
        membershipStatus: editUser.membershipStatus,
        PlanID: newPlanID, // Update the user's plan
        ImageURL: imageURL,
        expirationDate: expirationDate
      });
  
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
      await updateDoc(doc(db, 'Users', userId), { membershipStatus: newStatus });
      setUsers(users.map(user => user.id === userId ? { ...user, membershipStatus: newStatus } : user));
    } catch (error) {
      console.error("Error toggling membership status:", error);
    }
  };

  const getFormattedDate = (timestamp) => {
    if (!timestamp || isNaN(timestamp)) {
      return "Invalid Date";
    }

    const date = new Date(timestamp.toDate());
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDeleteUser = async (user) => {
    setShowLoadingModal(true)

    const deleteUserFunction = httpsCallable(functions, 'deleteUser'); // Initialize Cloud Function
    try {
      await deleteUserFunction({ email: users.find(users => users.id === user.UserId).EmailAddress, id:user.UserId});
      updatePlanCount(user.PlanID,"")
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
    setShowLoadingModal(false)

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
      <h2  className="text-info">Online Trainers</h2>
      <div style={{ maxHeight: '400px', overflowY: 'scroll' }}>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Name</th>
            <th>Email Address</th>
            <th>Trainees Number</th>
            <th>Plan Subscription</th>
            <th>Expiration Date</th>
            <th>Membership Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentCustomers.map((user) => (
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

              <td>
                {user.PlanID === '111' ? "Trial Plan" :
                 user.PlanID === '241' ? "Premium Plan" :
                 user.PlanID === "211" ? "Elite Plan" :
                 "No Chosen Plan"}
              </td>
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
                <option value="111">Trial Plan</option>
                <option value="211">Elite Plan</option>
                <option value="241">Premium Plan</option>
              </Form.Control>
            </Form.Group>

            {editUser.PlanID === "211" || editUser.PlanID === "241" ? (
              <Form.Group controlId="formBasicMonths">
                <Form.Label>Number of Months *</Form.Label>
                <Form.Control
                  as="select"
                  value={months}
                  onChange={(e) => setMonths(e.target.value)}
                >
                  <option value="">Select Months</option>
                  <option value="3">3 Months</option>
                  <option value="6">6 Months</option>
                  <option value="12">12 Months</option>
                </Form.Control>
              </Form.Group>
            ) : null}

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
