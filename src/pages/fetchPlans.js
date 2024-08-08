//import { getFirestore, collection, getDocs } from "firebase/firestore";

// const db = getFirestore();

// export const fetchPlans = async () => {
//   const plansCollection = collection(db, 'plans');
//   const plansSnapshot = await getDocs(plansCollection);

//   const plans = {};
//   for (const planDoc of plansSnapshot.docs) {
//     const planData = planDoc.data();
//     const planId = planDoc.id; // Use the document ID as the key
//     console.log(planId);
//     const daysCollection = collection(db, `plans/${planId}/days`);
//     const daysSnapshot = await getDocs(daysCollection);
//     const days = {};
//     for (const dayDoc of daysSnapshot.docs) {
//       const dayData = dayDoc.data();
//       const dayId = dayDoc.id; // Use the document ID as the key
//       const exercisesCollection = collection(db, `plans/${planId}/days/${dayId}/exercises`);
//       const exercisesSnapshot = await getDocs(exercisesCollection);
//       const exercises = {};
//       for (const exerciseDoc of exercisesSnapshot.docs) {
//         const exerciseData = exerciseDoc.data();
//         const exerciseId = exerciseDoc.id; // Use the document ID as the key
//         exercises[exerciseId] = exerciseData;
//       }
//       days[dayId] = { ...dayData, exercises };
//     }
//     plans[planId] = { ...planData, days };
//   }
//   return plans;
// };

import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';

const db = getFirestore();

export const fetchPlanNames = async () => {
  const plansCollection = collection(db, 'plans');
  const snapshot = await getDocs(plansCollection);
  const names = snapshot.docs.map(doc => doc.id);
  return names;
};

export const fetchPlanDetails = async (planId) => {
  const planDoc = doc(db, 'plans', planId);
  const planSnapshot = await getDoc(planDoc);
  if (planSnapshot.exists()) {
    return planSnapshot.data();
  } else {
    throw new Error(`Plan with ID ${planId} does not exist.`);
  }
};
