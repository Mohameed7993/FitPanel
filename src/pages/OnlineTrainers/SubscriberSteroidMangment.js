import React, { useState, useEffect } from "react";
import { collection, query, Timestamp, where, getDocs,
  getDoc, getFirestore, doc, updateDoc } from "firebase/firestore";
import { useAuth } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';

const SteroidManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [steroidPlans, setSteroidPlans] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [selectedPlanID, setSelectedPlanID] = useState("");
  const [selectedPlanDuration, setSelectedPlanDuration] = useState(0);
  const db = getFirestore();
  const { userlogindetails } = useAuth();

  const fetchCustomers = async () => {
    if (!userlogindetails) return;

    const customersCollection = collection(db, 'customers');
    const customersQuery = query(customersCollection, where('trainerID', '==', userlogindetails.UserId));
    const customerSnapshot = await getDocs(customersQuery);
    const customerList = customerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setCustomers(customerList);
  };

  const fetchSteroidPlans = async () => {
    const steroidPlansCollection = collection(db, 'SteroidPlan');
    const steroidPlansSnapshot = await getDocs(steroidPlansCollection);
    const steroidPlansList = steroidPlansSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setSteroidPlans(steroidPlansList);
  };

  useEffect(() => {
    fetchCustomers();
    fetchSteroidPlans();
  }, [db, userlogindetails]);

  const getSteroidPlanName = (planID) => {
    const plan = steroidPlans.find(plan => plan.id === planID);
    return plan ? plan.PlanName : '/';
  };

  const getSteroidPlanDuration = (planID) => {
    const plan = steroidPlans.find(plan => plan.id === planID);
    return plan ? parseInt(plan.Duration, 10) : 0; // Convert Duration to a number
  };



  const updateSubscriberNumber = async (planID, increment) => {
    const planDoc = doc(db, 'SteroidPlan', planID);
    const planSnapshot = await getDoc(planDoc); // Use getDoc instead of getDocs
    const currentSubscriberNumber = planSnapshot.exists() ? planSnapshot.data().subscriberNumber : 0;
    await updateDoc(planDoc, {
      subscriberNumber: currentSubscriberNumber + increment
    });
  };

  const handleEdit = (customer) => {
    setCurrentCustomer(customer);
    setSelectedPlanID(customer.SteroidPlanID);
    setSelectedPlanDuration(getSteroidPlanDuration(customer.SteroidPlanID));
    setShowEditModal(true);
  };

  const calculateExpirationDate = (durationMonths) => {
    const currentDate = new Date();
    const expirationDate = new Date(currentDate.setMonth(currentDate.getMonth() + durationMonths));
    return expirationDate;
  };

  const handleSaveEdit = async () => {
    if (currentCustomer) {
      const newExpirationDate = calculateExpirationDate(selectedPlanDuration);
      const oldPlanID = currentCustomer.SteroidPlanID;
      const newPlanID = selectedPlanID;

      // Update the new plan's subscriber number
      if (newPlanID !== "0000") {
        await updateSubscriberNumber(newPlanID, 1);
      }

      // Decrease the old plan's subscriber number, if not "0000"
      if (oldPlanID !== "0000" && oldPlanID) {
        await updateSubscriberNumber(oldPlanID, -1);
      }

      // Update the customer document
      const customerDoc = doc(db, 'customers', currentCustomer.id);
      await updateDoc(customerDoc, {
        SteroidPlanID: newPlanID,
        expirationDateSteroidPlan: newExpirationDate,
        joinDate: Timestamp.fromDate(new Date()) // Save the join date
      });

      fetchCustomers();
      setShowEditModal(false);
    }
  };

  const handleDeletePlan = async (customer) => {
    if (customer) {
      const oldPlanID = customer.SteroidPlanID;
      
      // Decrease the old plan's subscriber number, if not "0000"
      if (oldPlanID !== "0000" && oldPlanID) {
        await updateSubscriberNumber(oldPlanID, -1);
      }

      // Update the customer document
      const customerDoc = doc(db, 'customers', customer.id);
      await updateDoc(customerDoc, {
        SteroidPlanID: null, // Set SteroidPlanID to null to remove it
        expirationDateSteroidPlan: null, // Set expirationDateSteroidPlan to null to remove it
        joinDate: null // Optionally remove joinDate if needed
      });

      fetchCustomers();
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

  // Filter customers who have a SteroidPlanID
  const filteredCustomers = customers.filter(customer => customer.SteroidPlanID);

  return (
    <div className="container mt-4">
      <h2 className="text-end text-info">תוכניות סטרוידים</h2>
      <table className="table table-striped text-end">
        <thead>
          <tr>

          <th>פעולות</th>
          <th>תחילת מינו</th> 
          <th>תאריך פגיעת התוכנית</th>
          <th>תוכנית סטרויד</th>
          <th>שם</th>
            <th>מספר ת,ז</th>
            
            
            
            
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map(customer => (
            <tr key={customer.id}>

              <td>
                <Button variant="warning" size="sm" className="mx-1" onClick={() => handleEdit(customer)}>עריכה</Button>
                <Button variant="danger" size="sm" className="mx-1" onClick={() => handleDeletePlan(customer)}>מחיקה</Button>
              </td>
              <td>{getFormattedDate(customer.joinDate)}</td> {/* Display join date */}
              <td>{getFormattedDate(customer.expirationDateSteroidPlan)}</td>
              <td>{getSteroidPlanName(customer.SteroidPlanID)}</td>
              <td>{customer.name}</td>
              <td>{customer.id}</td>

            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Steroid Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formPlanSelect">
              <Form.Label>Select Steroid Plan</Form.Label>
              <Form.Control
                as="select"
                value={selectedPlanID}
                onChange={(e) => {
                  const newPlanID = e.target.value;
                  setSelectedPlanID(newPlanID);
                  setSelectedPlanDuration(getSteroidPlanDuration(newPlanID));
                }}
              >
                <option value="">Select a plan</option>
                {steroidPlans.map(plan => (
                  <option key={plan.id} value={plan.id}>{plan.PlanName}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SteroidManagement;
