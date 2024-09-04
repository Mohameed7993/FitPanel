import { useState, useEffect } from 'react';

const useFetchPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('/MoDumbels/plans'); // Endpoint to fetch plans from the server
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const plansData = await response.json();
        setPlans(plansData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return { plans, loading, error };
};

export default useFetchPlans;
