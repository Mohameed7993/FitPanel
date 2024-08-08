import React, { useState, useEffect } from "react";
import { getFirestore, collection, addDoc, query, where, getDocs, setDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { Modal, Button, Form, Toast, Table, Container, Row, Col } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext'; // Adjust the path as needed
import 'bootstrap/dist/css/bootstrap.min.css';

const SteroidPlans = () => {
  const { userlogindetails } = useAuth(); // Get userlogindetails from context
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [plans, setPlans] = useState([]);
  const [newPlan, setNewPlan] = useState({
    PlanName: '',
    PlanCost: '',
    PlanDetails: '',
    Duration: '1'
  });
  const [editPlan, setEditPlan] = useState(null);

  const db = getFirestore();

  useEffect(() => {
    const fetchPlans = async () => {
      if (!userlogindetails) return;
      const plansCollection = collection(db, 'SteroidPlan');
      const plansQuery = query(plansCollection, where('TrainerID', '==', userlogindetails.role === 2 ? userlogindetails.trainerID : userlogindetails.UserId));
      const plansSnapshot = await getDocs(plansQuery);
      const plansList = plansSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPlans(plansList);
    };

    fetchPlans();
  }, [db, userlogindetails]);

  const handleAddPlan = async () => {
    setShowAddModal(false);
    const planID = Math.floor(100 + Math.random() * 900); // Generate a random 3-digit number
    const planRef = doc(collection(db, 'SteroidPlan'), planID.toString());

    try {
      const planData = {
        ...newPlan,
        PlanID: planID,
        TrainerID: userlogindetails.UserId,
        subscriberNumber: 0
      };

      await setDoc(planRef, planData);
      setPlans([...plans, { id: planID.toString(), ...planData }]);
      setShowToast(true);
    } catch (error) {
      console.error('Error adding plan:', error);
    }
  };

  const handleDeletePlan = async (planID) => {
    try {
      await deleteDoc(doc(db, 'SteroidPlan', planID));
      setPlans(plans.filter(plan => plan.id !== planID));
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  };

  const handleEditPlan = async () => {
    setShowEditModal(false);
    if (!editPlan) return;

    try {
      await updateDoc(doc(db, 'SteroidPlan', editPlan.id), {
        PlanName: editPlan.PlanName,
        PlanCost: editPlan.PlanCost,
        PlanDetails: editPlan.PlanDetails,
        Duration: editPlan.Duration
      });

      setPlans(plans.map(plan => (plan.id === editPlan.id ? editPlan : plan)));
      setShowToast(true);
    } catch (error) {
      console.error('Error updating plan:', error);
    }
  };

  const handleInputChange = (e, setPlan) => {
    const { name, value } = e.target;
    setPlan(prevState => ({ ...prevState, [name]: value }));
  };

  const handleOpenAddModal = () => {
    setNewPlan({
      PlanName: '',
      PlanCost: '',
      PlanDetails: '',
      Duration: '1'
    });
    setShowAddModal(true);
  };

  const handleOpenEditModal = (plan) => {
    setEditPlan(plan);
    setShowEditModal(true);
  };

  return (
    <Container fluid className="my-4">
      <Row className="mb-4">
        {userlogindetails.role === 8 && (
          <Col xs={12} className="text-end">
            <Button variant="primary" onClick={handleOpenAddModal}>
              הוספת תוכנית חדשה
            </Button>
          </Col>
        )}
        <Col xs={12}>
          <h2 className="text-right">תוכניות סטרואידים</h2>
          <Table striped bordered hover responsive="md" className="text-end">
            <thead>
              <tr>
                {userlogindetails.role === 8 && <th>פעולות</th>}
                {userlogindetails.role === 8 && <th>מספר משתתפים</th>}
                <th>מחיר</th>
                <th>פרטים</th>
                <th>משך</th>
                <th>שם תוכנית</th>
              </tr>
            </thead>
            <tbody>
              {plans.map(plan => (
                <tr key={plan.id}>
                  {userlogindetails.role === 8 && (
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => handleOpenEditModal(plan)}
                      >
                        עריכה
                      </Button>{' '}
                      <Button
                        disabled={plan.subscriberNumber !== 0}
                        variant="danger"
                        size="sm"
                        className="my-2"
                        onClick={() => handleDeletePlan(plan.id)}
                      >
                        מחיקה
                      </Button>
                    </td>
                  )}
                  {userlogindetails.role === 8 && <td>{plan.subscriberNumber}</td>}
                  <td>₪{plan.PlanCost}</td>
                  <td>
                    {plan.PlanDetails.split('.').map((sentence, i) => (
                      <div key={i}>{sentence.trim() ? sentence.trim() + '.' : ''}</div>
                    ))}
                  </td>
                  <td>כ- {plan.Duration} חודשים</td>
                  <td>{plan.PlanName}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* Add Plan Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>הוספת תוכנית חדשה</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="PlanName">
              <Form.Label>שם תוכנית</Form.Label>
              <Form.Control
                type="text"
                name="PlanName"
                value={newPlan.PlanName}
                onChange={(e) => handleInputChange(e, setNewPlan)}
              />
            </Form.Group>
            <Form.Group controlId="PlanCost">
              <Form.Label>מחיר תוכנית</Form.Label>
              <Form.Control
                type="number"
                name="PlanCost"
                value={newPlan.PlanCost}
                onChange={(e) => handleInputChange(e, setNewPlan)}
              />
            </Form.Group>
            <Form.Group controlId="PlanDetails">
              <Form.Label>פרטי תוכנית</Form.Label>
              <Form.Control
                type="text"
                name="PlanDetails"
                value={newPlan.PlanDetails}
                onChange={(e) => handleInputChange(e, setNewPlan)}
              />
            </Form.Group>
            <Form.Group controlId="Duration">
              <Form.Label>משך בחודשים</Form.Label>
              <Form.Control
                as="select"
                name="Duration"
                value={newPlan.Duration}
                onChange={(e) => handleInputChange(e, setNewPlan)}
              >
                <option>1</option>
                <option>3</option>
                <option>6</option>
                <option>12</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>ביטול</Button>
          <Button variant="primary" onClick={handleAddPlan}>הוספת תוכנית</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Plan Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>עריכת תוכנית</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editPlan && (
            <Form>
              <Form.Group controlId="PlanName">
                <Form.Label>שם תוכנית</Form.Label>
                <Form.Control
                  type="text"
                  name="PlanName"
                  value={editPlan.PlanName}
                  onChange={(e) => handleInputChange(e, setEditPlan)}
                />
              </Form.Group>
              <Form.Group controlId="PlanCost">
                <Form.Label>מחיר תוכנית</Form.Label>
                <Form.Control
                  type="number"
                  name="PlanCost"
                  value={editPlan.PlanCost}
                  onChange={(e) => handleInputChange(e, setEditPlan)}
                />
              </Form.Group>
              <Form.Group controlId="PlanDetails">
                <Form.Label>פרטי תוכנית</Form.Label>
                <Form.Control
                  type="text"
                  name="PlanDetails"
                  value={editPlan.PlanDetails}
                  onChange={(e) => handleInputChange(e, setEditPlan)}
                />
              </Form.Group>
              <Form.Group controlId="Duration">
                <Form.Label>משך בחודשים</Form.Label>
                <Form.Control
                  as="select"
                  name="Duration"
                  value={editPlan.Duration}
                  onChange={(e) => handleInputChange(e, setEditPlan)}
                >
                  <option>1</option>
                  <option>3</option>
                  <option>6</option>
                  <option>12</option>
                </Form.Control>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>ביטול</Button>
          <Button variant="primary" onClick={handleEditPlan}>שמור שינויים</Button>
        </Modal.Footer>
      </Modal>

      {/* Toast for success messages */}
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        className="position-fixed top-0 end-0 m-3"
      >
        <Toast.Body>הפעולה בוצעה בהצלחה!</Toast.Body>
      </Toast>
    </Container>
  );
};

export default SteroidPlans;
