import React, { useState } from 'react';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

import { Container, Toast, Button } from 'react-bootstrap';

const AddNewTrainningPlan = () => {
  const [planName, setPlanName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [days, setDays] = useState([]);
  const [dayCount, setDayCount] = useState(1); // Track the number of days
  const [showToast, setShowToast] = useState(false);
  const { userlogindetails } = useAuth();

  // Function to handle adding a new day
  const addNewDay = () => {
    setDays([...days, { dayNumber: dayCount, exerciseType: '', exercises: [] }]);
    setDayCount(dayCount + 1); // Increment day count for the next day
  };

  // Function to handle adding a new exercise to a specific day
  const addNewExercise = (dayIndex) => {
    const newExercise = { exerciseNumber: '', exerciseName: '', reps: '', sets: '' };
    const updatedDays = [...days];
    updatedDays[dayIndex].exercises.push(newExercise);
    setDays(updatedDays);
  };

  // Function to handle deleting a specific exercise from a day
  const deleteExercise = (dayIndex, exerciseIndex) => {
    const updatedDays = [...days];
    updatedDays[dayIndex].exercises.splice(exerciseIndex, 1);
    setDays(updatedDays);
  };

  // Function to handle deleting an entire day
  const deleteDay = (dayIndex) => {
    const updatedDays = [...days];
    updatedDays.splice(dayIndex, 1);
    setDays(updatedDays);
    // Reset day numbers after deletion
    updatedDays.forEach((day, index) => {
      day.dayNumber = index + 1;
    });
    setDayCount(updatedDays.length + 1); // Update day count
    setDays(updatedDays);
  };

  // Function to save the new plan to Firestore
  const saveNewPlan = async () => {
    const dbFirestore = getFirestore();
    const plansRef = collection(dbFirestore, 'membershipPlans');

    // Generate a new document ID (assuming sequential numbering)
    const querySnapshot = await getDocs(plansRef);
    const newPlanId = querySnapshot.size + 1; // Example of generating a sequential ID

    // Construct the new plan object
    const newPlan = {
      IDstudio: userlogindetails.IDstudio,
      PlanName: planName,
      description: description,
      duration: duration,
      planMember: 0,
      Days: days,
    };

    // Save the new plan to Firestore
    try {
      const docRef = await addDoc(plansRef, newPlan);
      console.log('Document written with ID: ', docRef.id);
      setShowToast(true); // Show toast on successful save
      // Reset form fields and state after saving
      setPlanName('');
      setDescription('');
      setDuration('');
      setDays([]);
      setDayCount(1); // Reset day count
    } catch (error) {
      console.error('Error adding document: ', error);
      // Handle error here, you can also show a toast for error if needed
      setShowToast(false); // Hide toast on error
    }
  };

  return (
    <Container>
      <h2>Add New Plan</h2>
      <div>
        <label>Plan Name:</label>
        <input type="text" value={planName} onChange={(e) => setPlanName(e.target.value)} />
      </div>
      <div>
        <label>Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <label>Duration:</label>
        <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} />
      </div>

      <h3>Days and Exercises:</h3>
      {days.map((day, dayIndex) => (
        <div key={dayIndex}>
          <h4>Day {day.dayNumber}</h4> {/* Display day number */}
          <div>
            <label>Exercise Type:</label>
            <input
              type="text"
              value={day.exerciseType}
              onChange={(e) => {
                const updatedDays = [...days];
                updatedDays[dayIndex].exerciseType = e.target.value;
                setDays(updatedDays);
              }}
            />
          </div>
          <Button variant="primary" className="mb-2" onClick={() => addNewExercise(dayIndex)}>
            Add New Exercise
          </Button>
          {day.exercises.map((exercise, exerciseIndex) => (
            <div key={exerciseIndex}>
              <label>Exercise Number:</label>
              <input
                type="text"
                value={exercise.exerciseNumber}
                onChange={(e) => {
                  const updatedDays = [...days];
                  updatedDays[dayIndex].exercises[exerciseIndex].exerciseNumber = e.target.value;
                  setDays(updatedDays);
                }}
              />
              <label>Exercise Name:</label>
              <input
                type="text"
                value={exercise.exerciseName}
                onChange={(e) => {
                  const updatedDays = [...days];
                  updatedDays[dayIndex].exercises[exerciseIndex].exerciseName = e.target.value;
                  setDays(updatedDays);
                }}
              />
              <label>Reps:</label>
              <input
                type="text"
                value={exercise.reps}
                onChange={(e) => {
                  const updatedDays = [...days];
                  updatedDays[dayIndex].exercises[exerciseIndex].reps = e.target.value;
                  setDays(updatedDays);
                }}
              />
              <label>Sets:</label>
              <input
                type="text"
                value={exercise.sets}
                onChange={(e) => {
                  const updatedDays = [...days];
                  updatedDays[dayIndex].exercises[exerciseIndex].sets = e.target.value;
                  setDays(updatedDays);
                }}
              />
              <Button variant="danger" size="sm" className="ml-2" onClick={() => deleteExercise(dayIndex, exerciseIndex)}>
                Delete Exercise
              </Button>
            </div>
          ))}
          <Button variant="danger" onClick={() => deleteDay(dayIndex)}>
            Delete Day
          </Button>
        </div>
      ))}
      <Button variant="success" className="mr-2" onClick={addNewDay}>
        Add New Day
      </Button>
      <Button variant="primary" onClick={saveNewPlan}>
        Save New Plan
      </Button>

      {/* Toast for success message */}
      <Toast show={showToast} onClose={() => setShowToast(false)} className="mt-3">
        <Toast.Header>
          <strong className="mr-auto">Success!</strong>
        </Toast.Header>
        <Toast.Body>New plan added successfully!</Toast.Body>
      </Toast>
    </Container>
  );
};

export default AddNewTrainningPlan;
