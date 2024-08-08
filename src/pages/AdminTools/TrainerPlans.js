import React, { useEffect, useState } from "react";
import { getFirestore, collection, query, getDocs } from "firebase/firestore"; // Ensure you're using the correct imports for Firestore
import { Container,Table } from "react-bootstrap";

const TrainersPlan = () => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const db = getFirestore(); // Initialize Firestore
        const plansCollection = collection(db, 'TrainersPlans'); // Reference to TrainersPlans collection
        const q = query(plansCollection); // Create query (add conditions if needed)
        const plansSnapshot = await getDocs(q); // Execute the query
        const plansData = plansSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Map documents to data
        setPlans(plansData); // Set state with fetched data
      } catch (error) {
        console.error("Error fetching plans: ", error); // Handle errors
      }
    };

    fetchPlans();
  }, []);

  return (
    <Container>
      <h2 className="text-info">Trainers Plans</h2>
      <Table className="table text-end" striped bordered hover>
        <thead>
          <tr>
          <th>מה מכילה התוכנית</th>
          <th>מספר מאמנים</th>
          <th>מחיר לחודש</th>
            <th>שם תוכנית</th>
          </tr>
        </thead>
        <tbody>
          {plans.map(plan => (
            <tr key={plan.id}>
                <td>
                <ul>
                  {plan.descrption.split('.').map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </td>
              <td>{plan.trainersNumber}</td>
              <td className="text-info">{plan.Costs} ש"ח/חודש</td>
              <td>{plan.PlanName}</td>
            </tr>
          ))}
        </tbody>
 
      </Table>
      <h6 className=" text-end ">
  :הנחות <br/>
  3 Month = 10% <br></br>6 Month = 15%<br/>12 Month = 20%
</h6>
    </Container>
  );
};

export default TrainersPlan;
