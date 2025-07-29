import { useState, useEffect } from 'react';

const useFetchPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const SERVERSIDEURL="https://fitpanelserverside.onrender.com"

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch(`${SERVERSIDEURL}/MoDumbels/plans`); // Endpoint to fetch plans from the server
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
