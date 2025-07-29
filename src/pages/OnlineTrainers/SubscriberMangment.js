import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Form, Col, Row } from 'react-bootstrap';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 7;
  const [sortOption, setSortOption] = useState('default');
  const [newMeasurements, setNewMeasurements] = useState({
    back: '', chest: '', abdomen: '', shoulders: '', weight: '',
    rightArm: '', leftArm: '', rightLeg: '', leftLeg: '', images: [],
    // updatedAt: new Date().toISOString(),
  });
  const [newImages, setNewImages] = useState([]);

  const hebrewLabels = {
    back: 'גב', chest: 'חזה', abdomen: 'בטן', shoulders: 'כתפיים',
    weight: 'משקל', rightArm: 'יד ימין', leftArm: 'יד שמאל',
    rightLeg: 'רגל ימין', leftLeg: 'רגל שמאל',
     updatedAt: 'עודכן בתאריך',
  };

  const fetchCustomers = async () => {
    if (!userlogindetails) return;
    try {
      const url = `/MoDumbels/customers?trainerID=${encodeURIComponent(userlogindetails.UserId)}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setCustomers(data.customers);
      } else {
        console.error('Failed to fetch customers');
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  useEffect(() => { fetchCustomers(); }, [userlogindetails]);

  useEffect(() => {
    setFilteredCustomers(
      searchQuery ? customers.filter(c => c.id.includes(searchQuery)) : customers
    );
  }, [searchQuery, customers]);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = async (customer) => {
    setShowLoadingModal(true);
    try {
      const res = await fetch(`/MoDumbels/deleteCustomer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trainerID: userlogindetails.UserId,
          customerID: customer.id,
          email: customer.email
        })
      });
      if (res.ok) {
        await fetchCustomers(); // ✅ ensure data refreshes after deletion
      }else {
        console.error('Failed to delete customer.');
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
    setShowLoadingModal(false);
    
  };
    const handleViewDetails = (customerId) => {
    onSelectCustomer('SubscriberDetails', customerId);
  };

    const handleMeasurementsChange = (e) => {
    const { name, value } = e.target;
    setNewMeasurements({ ...newMeasurements, [name]: value });
  };
  const handleEdit = async () => {
    if (!selectedCustomer) return;
    try {
      const res = await fetch(`/MoDumbels/updateCustomer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerID: selectedCustomer.id,
          name: editName,
          phoneNumber: editPhone,
          expirationDate: editExpirationDate
        })
      });
      if (res.ok) {
        fetchCustomers();
        setShowEditModal(false);
      }
    } catch (err) {
      console.error('Error updating customer:', err);
    }
  };

  const handleSuspendToggle = async (customerId, currentStatus) => {
    const newStatus = currentStatus === 'activated' ? 'suspended' : 'activated';
    try {
      const res = await fetch(`/MoDumbels/toggleStatus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerID: customerId, status: newStatus })
      });
      if (res.ok) fetchCustomers();
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };

  const handleAddMeasurements = async () => {
    if (!selectedCustomer) return;
    setShowLoadingModal(true);
    const formData = new FormData();
    newImages.forEach(file => formData.append('images', file));
    formData.append('customerID', selectedCustomer.id);
    formData.append('measurements', JSON.stringify(newMeasurements));
    try {
      const res = await fetch('/MoDumbels/addMeasurements', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        fetchCustomers();
        setShowMeasurementsModal(false);
      }
    } catch (err) {
      console.error('Error:', err);
    }
    setShowLoadingModal(false);
  };

  const handleOpenEditModal = (customer) => {
    setSelectedCustomer(customer);
    setEditName(customer.name);
    setEditPhone(customer.phoneNumber);
    setEditExpirationDate(customer.expirationDate ? new Date(customer.expirationDate.seconds * 1000).toISOString().split('T')[0] : '');
    setShowEditModal(true);
  };

  const handleOpenMeasurementsModal = (customer) => {
    setSelectedCustomer(customer);
    setShowMeasurementsModal(true);
  };

  const currentCustomers = filteredCustomers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <div className="container mt-5">
      <h2 className="text-end my-3">רשימת מתאמנים</h2>
      <Row className="justify-content-end mb-3">
        <Col md={4}>
          <h5 className="text-end">:חיפוש לפי מספר זהות</h5>
          <Form.Control className="text-end" placeholder="מספר זהות" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </Col>
        <Col md={4}>
          <h5 className="text-end">:מיון לפי</h5>
          <Form.Control as="select" value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="text-end">
            <option value="default">כללי</option>
            <option value="suspend">לא פעילים</option>
          </Form.Control>
        </Col>
      </Row>

      <LoadingModal show={showLoadingModal} />

      <div style={{ maxHeight: '400px', overflowY: 'scroll' }}>
        <Table className="table table-striped text-end" striped bordered hover>
          <thead>
            <tr>
              <th>פעולות</th><th>מייל</th><th>תאריך פקיעת המנוי</th><th>סטטוס חברות</th><th>שם</th><th>מספר זהות</th>
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
                </td>
                <td>{customer.email}</td>
                <td>{new Date(customer.expirationDate?.seconds * 1000).toLocaleDateString()}</td>
                <td>{customer.membershipStatus}</td>
                <td>{customer.name}</td>
                <td>{customer.id}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      {customers.length === 0 && (
  <p className="text-center">לא נמצאו מתאמנים במאגר.</p>
)}

      <Pagination>
        {Array.from({ length: Math.ceil(filteredCustomers.length / rowsPerPage) }, (_, index) => (
          <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => handlePageChange(index + 1)}>
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} className="text-dark">
        <Modal.Header closeButton><Modal.Title>עריכת פרטי לקוח</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group><Form.Label>שם</Form.Label><Form.Control type="text" value={editName} onChange={(e) => setEditName(e.target.value)} /></Form.Group>
            <Form.Group><Form.Label>מספר טלפון</Form.Label><Form.Control type="text" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} /></Form.Group>
            <Form.Group><Form.Label>תאריך פקיעת המנוי</Form.Label><Form.Control type="date" value={editExpirationDate} onChange={(e) => setEditExpirationDate(e.target.value)} /></Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>בטל</Button>
          <Button variant="primary" onClick={handleEdit}>שמור שינויים</Button>
        </Modal.Footer>
      </Modal>

      <MeasurementsModal
        show={showMeasurementsModal}
        onHide={() => setShowMeasurementsModal(false)}
        onChange={handleMeasurementsChange}
        onAdd={handleAddMeasurements}
        measurements={newMeasurements}
        hebrewLabels={hebrewLabels}
        onImageChange={(e) => setNewImages([...e.target.files])}
      />
    </div>
  );
};

export default SubscriberMang;
