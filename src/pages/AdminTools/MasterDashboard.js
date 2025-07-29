import React, { useState, useEffect } from "react";
import { Card, Container, Table } from "react-bootstrap";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement
} from "chart.js";
import useFetchPlans from '../useFetchGymPlans';
import { getFirestore } from "firebase/firestore";

// Register Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement

);

const MasterDashboard = () => {
  const SERVERSIDEURL="https://fitpanelserverside.onrender.com"
  const { plans, loading, error } = useFetchPlans();
  const [monthlyRegistrations, setMonthlyRegistrations] = useState([]);
  const [expiringUsers, setExpiringUsers] = useState([]);
  const [profitDataByMonth, setProfitDataByMonth] = useState([]);
  const [userData,setUserData]=useState()

  useEffect(() => {
    const fetchUserData = async () => {
    
      try {
        // Fetch user data from the server endpoint
        const response = await fetch(`${SERVERSIDEURL}/MoDumbels/Users`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const userData = await response.json();
        
        // Process the user data
        const registrations = {};
        userData.forEach(user => {
          // Convert Participating_from timestamp to Date object
          const participatingDate = new Date(user.Participating_from.seconds * 1000); // Assuming timestamp is in seconds
          const month = participatingDate.toLocaleString('default', { month: 'short', year: 'numeric' });
          registrations[month] = (registrations[month] || 0) + 1;
        });
        setMonthlyRegistrations(Object.entries(registrations).map(([month, count]) => ({ month, count })));
    
        // Find expiring users
        const now = new Date();
        const expiring = userData.filter(user => {
          // Convert expirationDate timestamp to Date object
          const expirationDate = user.expirationDate ? new Date(user.expirationDate.seconds * 1000) : null; // Assuming timestamp is in seconds
          return expirationDate && expirationDate <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // within next 7 days
        });
        setExpiringUsers(expiring);
    
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    

        // Calculate profit data
        const profitByMonth = plans.map(plan => ({
          month: plan.PlanName,
          profit: (plan.trainersNumber || 0) * (plan.Costs || 0),
        }));
        setProfitDataByMonth(profitByMonth);

   
    };

    fetchUserData();
  }, [ plans]);

  // Calculate total profit
  const totalProfit = plans.reduce((total, plan) => total + (plan.trainersNumber || 0) * (plan.Costs || 0), 0);

  const getProfitData = () => {
    if (!plans || plans.length === 0) {
      return {
        labels: [],
        datasets: [
          {
            label: 'Profit',
            data: [],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      };
    }

    return {
      labels: plans.map(plan => plan.PlanName),
      datasets: [
        {
          label: 'Profit',
          data: plans.map(plan => (plan.trainersNumber || 0) * (plan.Costs || 0)),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const getMonthlyRegistrationData = () => {
    return {
      labels: monthlyRegistrations.map(reg => reg.month),
      datasets: [
        {
          label: 'Monthly Registrations',
          data: monthlyRegistrations.map(reg => reg.count),
          fill: false,
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
        },
      ],
    };
  };


  const getOptions = (title) => ({
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: title,
      },
    },
  });

  return (
    <Container className="mt-4">
      <h2 >Studio Plans Statistics</h2>
      <Card className="mt-4 bg-success text-white">
        <Card.Body>
          <Card.Title>Total Profit:</Card.Title>
          <Card.Text>
            Total Profit: {totalProfit.toFixed(2)}₪
          </Card.Text>
        </Card.Body>
      </Card>
      <div className="d-flex flex-wrap">
        <div className="mx-5" style={{ width: '45%', maxWidth: '500px', height: '400px' }}>
          <Bar data={getProfitData()} options={getOptions("Profit by Plan")} />
        </div>
        <div className="mx-5" style={{ width: '45%', maxWidth: '500px', height: '400px' }}>
          <Line data={getMonthlyRegistrationData()} options={getOptions("Monthly User Registrations")} />
        </div>
      </div>

      <h3 className=" mt-4">Users with Expiring Accounts</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email Address</th>
            <th>Expiration Date</th>
          </tr>
        </thead>
        <tbody>
          {expiringUsers.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.FirstName}</td>
              <td>{user.LastName}</td>
              <td>{user.EmailAddress}</td>
              <td>{user.expirationDate ? user.expirationDate.toDate().toLocaleDateString() : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default MasterDashboard;
