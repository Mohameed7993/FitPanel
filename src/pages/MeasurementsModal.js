// MeasurementsModal.js
import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const MeasurementsModal = ({
  show,
  onHide,
  onChange,
  onAdd,
  measurements,
  hebrewLabels,
  onImageChange,
}) => {
  return (
    <Modal show={show} onHide={onHide} className='text-dark'>
      <Modal.Header closeButton>
        <Modal.Title>הוספת מדידות</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {Object.keys(measurements).map(key => key !== 'images' && (
            <Form.Group key={key} controlId={`measurement-${key}`}>
              <Form.Label>{hebrewLabels[key]}</Form.Label>
              <Form.Control
                type="text"
                name={key}
                value={measurements[key]}
                onChange={onChange}
              />
            </Form.Group>
          ))}
          <Form.Group controlId="measurement-images">
            <Form.Label>תמונות</Form.Label>
            <Form.Control
              type="file"
              multiple
              onChange={onImageChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          בטל
        </Button>
        <Button variant="primary" onClick={onAdd}>
          הוסף מדידות
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MeasurementsModal;
