import { getFirestore, collection, doc, getDocs } from 'firebase/firestore';

const getWorkoutPlan = async (planName) => {
    const db = getFirestore();
    const planRef = doc(collection(db, 'plans'), planName);
    const daysSnapshot = await getDocs(collection(planRef, 'days'));

    const days = [];
    for (const dayDoc of daysSnapshot.docs) {
        const dayData = dayDoc.data();
        const exercisesSnapshot = await getDocs(collection(dayDoc.ref, 'exercises'));
        const exercises = exercisesSnapshot.docs.map(doc => doc.data());

        days.push({
            dayNumber: dayDoc.id,
            exercisesType: dayData.exercisesType,
            exercises: exercises,
        });
    }

    return days;
};

export default getWorkoutPlan;
