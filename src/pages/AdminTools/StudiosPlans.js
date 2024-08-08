import React, { useState } from "react";
import { Modal, Button, Form, Table, Container } from "react-bootstrap";
import { getFirestore, doc, setDoc, deleteDoc } from 'firebase/firestore';
import useFetchPlans from '../useFetchGymPlans'; 

const StudiosPlan = () => {
  const { plans, loading, error } = useFetchPlans();
  const [showModal, setShowModal] = useState(false);
  const [planName, setPlanName] = useState('');
  const [costsPlan, setCostsPlan] = useState('');
  const [definition, setDefinition] = useState('');
  const [editingPlan, setEditingPlan] = useState(null);
  const db = getFirestore();

  const handleSavePlan = async () => {
    if (!planName || !costsPlan || !definition) {
      alert('Please fill in all fields.');
      return;
    }

    const planId = editingPlan || Math.floor(100 + Math.random() * 900).toString(); // Random 3-digit number

    try {
      await setDoc(doc(db, 'StudioPlans', planId), {
        planName: planName,
        costsPlan: costsPlan,
        definition: definition,
        Gymssubscrbtions: [] // Empty array for Gymssubscrbtions
      });
      console.log("Document successfully written with ID: ", planId);
      handleCloseModal();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setPlanName('');
    setCostsPlan('');
    setDefinition('');
    setEditingPlan(null);
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan.id);
    setPlanName(plan.planName);
    setCostsPlan(plan.costsPlan);
    setDefinition(plan.definition);
    setShowModal(true);
  };

  const handleDelete = async (planId) => {
    try {
      await deleteDoc(doc(db, 'StudioPlans', planId));
      console.log("Document successfully deleted with ID: ", planId);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  return (
    <>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      <Container className="mt-4">
        <div>
          <Button variant="primary" onClick={() => setShowModal(true)}>Add New Plan</Button>
        </div>
        <h2  className="text-info">Studios Plans:</h2> 
        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th>#</th>
              <th>Plan Name</th>
              <th>Costs Plan</th>
              <th>Definition</th>
              <th>Subscriptions</th> {/* New column for subscriptions */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan, index) => (
              <tr key={plan.id}>
                <td>{index + 1}</td>
                <td>{plan.planName}</td>
                <td>{plan.costsPlan}</td>
                <td>{plan.definition.split('.').map((sentence, i) => (
                  <div key={i}>{sentence.trim()}</div>
                ))}</td>
                <td>{plan.Gymssubscrbtions.length}</td> {/* Display number of subscriptions */}
                <td>
                  <Button variant="info" onClick={() => handleEdit(plan)}>Edit</Button>
                  <Button variant="danger" onClick={() => handleDelete(plan.id)} className="ms-2">Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingPlan ? "Edit Plan" : "Add New Plan"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Plan Name:</Form.Label>
              <Form.Control type="text" value={planName} onChange={(e) => setPlanName(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Costs Plan:</Form.Label>
              <Form.Control type="text" value={costsPlan} onChange={(e) => setCostsPlan(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Definition:</Form.Label>
              <Form.Control as="textarea" rows={3} value={definition} onChange={(e) => setDefinition(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSavePlan}>
            {editingPlan ? "Update Plan" : "Save Plan"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default StudiosPlan;
