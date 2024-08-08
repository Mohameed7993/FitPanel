import { Container, Spinner } from "react-bootstrap";
import React, { useEffect, useState } from 'react';
import getWorkoutPlan from './workoutPlanService';
import { Table, Modal, Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle, faStopCircle } from '@fortawesome/free-solid-svg-icons';



import gymImage from './image/begginer.png'

const Workoutplan = () => {
    const [plan, setPlan] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const { planName } = location.state;
    const [planActive, setPlanActive] = useState(false);
    const [startTime, setStartTime] = useState(null);
   

    useEffect(() => {
        const fetchWorkoutPlan = async () => {
            const planData = await getWorkoutPlan(planName);
            setPlan(planData);
            setLoading(false);
        };

        fetchWorkoutPlan();
    }, [planName]);

    const togglePlanStatus = () => {
        if (planActive) {
            // End the plan
            setPlanActive(false);
            // Calculate and display the duration
            const endTime = new Date();
            const duration = (endTime - startTime) / 1000; // Duration in seconds
            alert(`Plan ended. Duration: ${duration} seconds`);
        } else {
            // Start the plan
            setPlanActive(true);
            setStartTime(new Date());
        }
    };

    const handleShowModal = (day) => {
        setSelectedDay(day);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedDay(null);
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    return (
        <Container className="">
            <div className="row align-items-center">
                <div className="col-md-6">
                    <div>
                        <h1>{planName.charAt(0).toUpperCase() + planName.slice(1)} Plan</h1>
                        <Table striped bordered hover >
                            <thead>
                                <tr>
                                    <th>Days</th>
                                    <th>Exercises Type</th>
                                    <th>Exercise Number</th>
                                    <th>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {plan.map((day, index) => (
                                    <tr key={index}>
                                        <td>{day.dayNumber}</td>
                                        <td>{day.exercisesType}</td>
                                        <td>{day.exercises.length}</td>
                                        <td>
                                            <Button variant="primary" onClick={() => handleShowModal(day)}>
                                                Show Details
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        {planActive && (
                            <div>
                                <p>Plan started: {startTime.toLocaleString()}</p>
                                <p>Duration: {Math.floor((new Date() - startTime) / 1000)} seconds</p>
                            </div>
                        )}

                        <Modal show={showModal} onHide={handleCloseModal}>
                            <Modal.Header closeButton>
                                <Modal.Title> {selectedDay?.dayNumber} - {selectedDay?.exercisesType}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {selectedDay?.exercises.length === 0 ? (
                                    <p>Rest day :)</p>
                                ) : (
                                    selectedDay?.exercises.map((exercise, i) => (
                                        <div key={i}>
                                            <p><strong>Exercise {i + 1}</strong></p>
                                            <p><strong>Name:</strong> {exercise.name}</p>
                                            <p><strong>Sets:</strong> {exercise.sets}</p>
                                            <p><strong>Reps:</strong> {exercise.reps}</p>
                                            
                                            <hr />
                                        </div>
                                    ))
                                )}
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleCloseModal}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>
                <Container className="col-md-3 col-sm-6 d-flex justify-content-end ">
                    <img src={gymImage} alt="Gym" className="img-fluid " />
                    
                </Container>
                <div className="col-md-3 col-sm-6 d-flex justify-content-end">
    <Button variant={planActive ? "danger" : "success"} onClick={togglePlanStatus}>
        {planActive ? "End Plan" : "Start Plan"}
        <FontAwesomeIcon icon={planActive ? faStopCircle : faPlayCircle} className="ms-2" />
    </Button>
    
</div>
                

            </div>
        </Container>
    )
}

export default Workoutplan;
