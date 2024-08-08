import React from 'react';
import { Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDumbbell } from '@fortawesome/free-solid-svg-icons';

const LoadingModal = ({ show }) => {
  return (
    <Modal show={show} centered>
      <Modal.Body className="d-flex justify-content-center align-items-center text-info">
        <FontAwesomeIcon icon={faDumbbell} spin size="3x" />
      </Modal.Body>
    </Modal>
  );
};

export default LoadingModal;
