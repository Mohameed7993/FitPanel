import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const PlanModal = ({ show, handleClose, plan }) => {
    const nav=useNavigate();

     function handleClick(){
                nav('/workoutplan', { state: { planName:plan.planName} });
    }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{plan.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>{plan.subtitle}</h5>
        <p>{plan.description}</p>
        <ul>
          {plan.details.map((detail, index) => (
            <li key={index}>{detail}</li>
          ))}
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button className='bg-info'  onClick={handleClick}>
          Let's Start
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PlanModal;