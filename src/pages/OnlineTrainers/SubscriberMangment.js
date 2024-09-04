import React, { useState, useEffect } from "react";
import { getFirestore, runTransaction, collection, Timestamp, query, where, getDocs, getDoc, doc, updateDoc } from 'firebase/firestore';
import { Button, Table,Modal, Form,Col,Row } from 'react-bootstrap';
import { getFunctions, httpsCallable } from "firebase/functions";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../context/AuthContext';
import LoadingModal from '../LoadingModal';
import MeasurementsModal from "../MeasurementsModal";
import Pagination from 'react-bootstrap/Pagination';



const SubscriberMang = ({ onSelectCustomer }) => {
  const { userlogindetails } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMeasurementsModal, setShowMeasurementsModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editExpirationDate, setEditExpirationDate] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // New state for search query
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 7;
  const [sortOption, setSortOption] = useState('default');


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
  const [newMeasurements, setNewMeasurements] = useState({
    back: '',
    chest: '',
    abdomen: '',
    shoulders: '',
    weight: '',
    rightArm: '',
    leftArm: '',
    rightLeg: '',
    leftLeg: '',
    images: [],
    updatedAt: getFormattedDate(Timestamp.now()),
  });
  const [newImages, setNewImages] = useState([]);
  const [isSteroidPlanAdded, setIsSteroidPlanAdded] = useState({}); // State to manage steroid plan status

  const functions = getFunctions();
  const db = getFirestore();
  const storage = getStorage();

  const hebrewLabels = {
    back: 'גב',
    chest: 'חזה',
    abdomen: 'בטן',
    shoulders: 'כתפיים',
    weight: 'משקל',
    rightArm: 'יד ימין',
    leftArm: 'יד שמאל',
    rightLeg: 'רגל ימין',
    leftLeg: 'רגל שמאל',
    updatedAt: 'עודכן בתאריך',
  };

  const fetchCustomers = async () => {
    if (!userlogindetails) return;
  
    try {
      // Construct the URL with the UserId as a query parameter
      const url = `/MoDumbels/customers?trainerID=${encodeURIComponent(userlogindetails.UserId)}`;
  
      const response = await fetch(url, {
        method: 'GET', // Use GET since we're passing parameters in the URL
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        setCustomers(data.customers);
      } else {
        console.error('Failed to fetch customers:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [db, userlogindetails]);

  useEffect(() => {
    // Filter customers based on search query
    if (searchQuery) {
      setFilteredCustomers(customers.filter(customer => customer.id.includes(searchQuery)));
    } else {
      setFilteredCustomers(customers);
    }
  }, [searchQuery, customers]);

  const handleDelete = async (customer) => {
    const deleteUserFunction = httpsCallable(functions, 'deleteCustomer');
    setShowLoadingModal(true);
    try {
      await deleteUserFunction({ email: customer.email, id: customer.id });
      fetchCustomers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }

    try {
      if (userlogindetails && userlogindetails.UserId) {
        const userDocRef = doc(db, 'Users', userlogindetails.UserId);
        await runTransaction(db, async (transaction) => {
          const userDoc = await transaction.get(userDocRef);
          if (!userDoc.exists()) {
            throw new Error('Document does not exist!');
          }

          const currentTraineesNumber = userDoc.data().traineesNumber || 0;
          const newTraineesNumber = currentTraineesNumber - 1;

          transaction.update(userDocRef, { traineesNumber: newTraineesNumber });
        });
      } else {
        console.error('User details are not properly defined.');
      }
    } catch (error) {
      console.error('Error decrementing trainees number:', error);
    }
    setShowLoadingModal(false);
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

  const handleEdit = async () => {
    if (selectedCustomer) {
      const customerRef = doc(db, 'customers', selectedCustomer.id);
      try {
        await updateDoc(customerRef, {
          name: editName || selectedCustomer.name,
          phoneNumber: editPhone || selectedCustomer.phoneNumber,
          expirationDate: editExpirationDate ? Timestamp.fromDate(new Date(editExpirationDate)) : selectedCustomer.expirationDate
        });
        setCustomers(customers.map(customer =>
          customer.id === selectedCustomer.id ? { ...customer, name: editName || customer.name, phoneNumber: editPhone || customer.phoneNumber, expirationDate: editExpirationDate ? Timestamp.fromDate(new Date(editExpirationDate)) : customer.expirationDate } : customer
        ));
        setShowEditModal(false);
      } catch (error) {
        console.error('Error updating customer:', error);
      }
    }
  };

  const handleSuspendToggle = async (customerId, currentStatus) => {
    const newStatus = currentStatus === 'activated' ? 'suspended' : 'activated';
    try {
      await updateDoc(doc(db, 'customers', customerId), { membershipStatus: newStatus });
      setCustomers(customers.map(customer => customer.id === customerId ? { ...customer, membershipStatus: newStatus } : customer));
    } catch (error) {
      console.error("Error toggling membership status:", error);
    }
  };

  const handleViewDetails = (customerId) => {
    onSelectCustomer('SubscriberDetails', customerId);
  };

  const handleOpenEditModal = (customer) => {
    setSelectedCustomer(customer);
    setEditName(customer.name);
    setEditPhone(customer.phoneNumber);
    setEditExpirationDate(customer.expirationDate ? customer.expirationDate.toDate().toISOString().split('T')[0] : '');
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => setShowEditModal(false);

  const handleOpenMeasurementsModal = (customer) => {
    setSelectedCustomer(customer);
    setShowMeasurementsModal(true);
  };

  const handleCloseMeasurementsModal = () => setShowMeasurementsModal(false);

  const handleMeasurementsChange = (e) => {
    const { name, value } = e.target;
    setNewMeasurements({ ...newMeasurements, [name]: value });
  };

  const handleImagesChange = (e) => {
    setNewImages([...e.target.files]);
  };

  const handleAddMeasurements = async () => {
    if (selectedCustomer) {
      setShowLoadingModal(true);
      const customerRef = doc(db, 'customers', selectedCustomer.id);
      try {
        const customerDoc = await getDoc(customerRef);
        if (customerDoc.exists()) {
          const customerData = customerDoc.data();

          // Upload images to Firebase Storage
          const imageUrls = await Promise.all(newImages.map(async (imageFile) => {
            const storageRef = ref(storage, `customers/${selectedCustomer.id}/images/${imageFile.name}`);
            await uploadBytes(storageRef, imageFile);
            return getDownloadURL(storageRef);
          }));

          const updatedWeek = { ...newMeasurements, images: imageUrls };
          const updatedWeeks = customerData.weeks ? [...customerData.weeks, updatedWeek] : [updatedWeek];

          await updateDoc(customerRef, { weeks: updatedWeeks });
          setCustomers(customers.map(customer =>
            customer.id === selectedCustomer.id ? { ...customer, weeks: updatedWeeks } : customer
          ));
          setShowMeasurementsModal(false);
        }
      } catch (error) {
        console.error('Error adding measurements:', error);
      }
      setShowLoadingModal(false);
    }
  };

  const handleAddSteroidPlan = async (customer) => {
    if (!customer || !customer.id) {
      console.error('Invalid customer object or ID');
      return; // Exit the function if customer or ID is invalid
    }
  
    const customerRef = doc(db, 'customers', customer.id);
    try {
      const customerDoc = await getDoc(customerRef);
      if (customerDoc.exists()) {
        const customerData = customerDoc.data();
        if (!customerData.SteroidPlanID || !customerData.expirationDateSteroidPlan) {
          await updateDoc(customerRef, {
            SteroidPlanID: "0000",
            expirationDateSteroidPlan: Timestamp.fromDate(new Date()) // Replace with appropriate date logic
          });
          setCustomers(prevCustomers => prevCustomers.map(cust =>
            cust.id === customer.id ? { ...cust, SteroidPlanID: "New Steroid Plan ID", expirationDateSteroidPlan: Timestamp.fromDate(new Date()) } : cust
          ));
          setIsSteroidPlanAdded(prevState => ({ ...prevState, [customer.id]: true })); // Mark steroid plan as added
        }
      }
    } catch (error) {
      console.error('Error adding steroid plan:', error);
    }
  };

  useEffect(() => {
    let sortedCustomers = [...customers];

    // Apply sorting based on the selected option
    if (sortOption === 'suspend') {
      sortedCustomers = sortedCustomers.filter(customer => customer.membershipStatus === 'suspended');
    } else if (sortOption === 'steroidPlan') {
      sortedCustomers = sortedCustomers.filter(customer => customer.SteroidPlanID);
    } 

    // Set the filtered and sorted customers
    setFilteredCustomers(sortedCustomers);
  }, [sortOption, customers]);


  const indexOfLastCustomer = currentPage * rowsPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - rowsPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  return (
    <div className="container ">
    <div className="container mt-5 ">
    <h2 className="text-end my-3" style={{ color: 'var(--text-color)' }}>רשימת מתאמנים</h2>

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

        <Row className="justify-content-end mb-3">
          
        <Col md={4}>
          <h5 className="text-end">:מיון לפי</h5>
          <Form.Control
            as="select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="text-end"
          >
            <option value="default">כללי</option>
            <option value="suspend"> לא פעילים</option>
            {userlogindetails.PlanID === '241' &&(<option value="steroidPlan">תוכנית סטרויד</option>)}
          </Form.Control>
        </Col>
      </Row>
      
      <LoadingModal show={showLoadingModal} />
    

      <div style={{ maxHeight: '400px', overflowY: 'scroll' }}>
      <Table className="table table-striped text-end " striped bordered hover>
        <thead>
          <tr>
            <th>פעולות</th>
            <th>תאריך פקיעת המנוי</th>
            <th>סטטוס חברות</th>
            <th>שם</th>
            <th>מספר זהות</th>
          </tr>
        </thead>
        <tbody>
          {currentCustomers.map((customer) => (
            <tr key={customer.id}>
              <td>
                <Button className="mx-1" size="sm" variant="danger" onClick={() => handleDelete(customer)}>מחק</Button>
                <Button className="mx-1" size="sm" variant="warning" onClick={() => handleOpenEditModal(customer)}>ערוך</Button>
                <Button className="mx-1" size="sm" variant={customer.membershipStatus === 'activated' ? 'warning' : 'success'} onClick={() => handleSuspendToggle(customer.id, customer.membershipStatus)}>
                  {customer.membershipStatus === 'activated' ? 'השעיה' : 'הפעל'}
                </Button>
                <Button className="mx-1" size="sm" variant="info" onClick={() => handleViewDetails(customer)}>צפה בפרטים</Button>
                <Button className="mx-1" size="sm" variant="primary" onClick={() => handleOpenMeasurementsModal(customer)}>הוסף מדידות</Button>
                {userlogindetails.PlanID === '241' &&(<Button
                  className="mx-1"
                  size="sm"
                  variant="dark"
                  onClick={() => handleAddSteroidPlan(customer)} // Pass customer to the function
                  disabled={isSteroidPlanAdded[customer.id] || (customer.SteroidPlanID && customer.expirationDateSteroidPlan)} // Disable if plan already added
                >
                  {isSteroidPlanAdded[customer.id] || (customer.SteroidPlanID && customer.expirationDateSteroidPlan) ? 'תוכנית סטרואידים קיימת' : 'הוסף תוכנית סטרואידים'}
                </Button>)}
              </td>
              <td>{getFormattedDate(customer.expirationDate)}</td>
              <td>{customer.membershipStatus}</td>
              <td>{customer.name}</td>
              <td>{customer.id}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      </div>
      {renderPagination()}

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal} className="text-dark">
        <Modal.Header closeButton>
          <Modal.Title>עריכת פרטי לקוח</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="editName">
              <Form.Label>שם</Form.Label>
              <Form.Control
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="editPhone">
              <Form.Label>מספר טלפון</Form.Label>
              <Form.Control
                type="text"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="editExpirationDate">
              <Form.Label>תאריך פקיעת המנוי</Form.Label>
              <Form.Control
                type="date"
                value={editExpirationDate}
                onChange={(e) => setEditExpirationDate(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            בטל
          </Button>
          <Button variant="primary" onClick={handleEdit}>
            שמור שינויים
          </Button>
        </Modal.Footer>
      </Modal>

      <MeasurementsModal
        show={showMeasurementsModal}
        onHide={handleCloseMeasurementsModal}
        onChange={handleMeasurementsChange}
        onAdd={handleAddMeasurements}
        measurements={newMeasurements}
        hebrewLabels={hebrewLabels}
        onImageChange={handleImagesChange}
      />
    </div>
    </div>

  );
};

export default SubscriberMang;
