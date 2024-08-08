import React, { useRef, useState } from 'react';
import { CardBody, CardTitle, Container, Form, Button, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle, faStopCircle } from '@fortawesome/free-solid-svg-icons';

export default function Calori_Calculate() {
    const age = useRef();
    const Height = useRef();
    const Weight = useRef();
    const [loading, setLoading] = useState(false);
    const [gender, setGender] = useState('');
    const [goal, setGoal] = useState('');
    const [activityLevel, setActivityLevel] = useState('');
    const [caloriesPerDay, setCaloriesPerDay] = useState(null);
    const [showResults, setShowResults] = useState(false);

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const ageValue = age.current.value;
        if (ageValue < 15 || ageValue > 80) {
            alert("Age must be between 15 and 80.");
            return;
        }

        const BMR = calculateBMR(ageValue, gender, Height.current.value, Weight.current.value);
        const TDEE = BMR * activityLevel;

        const losingWeightOptions = {
            'Maintain Weight': TDEE,
            'Mild Weight Loss (0.25 kg/week)': TDEE - 250,
            'Weight Loss (0.5 kg/week)': TDEE - 500,
            'Extreme Weight Loss (1 kg/week)': TDEE - 1000,
        };

        const gainingWeightOptions = {
            'Maintain Weight': TDEE,
            'Mild Weight Gain (0.25 kg/week)': TDEE + 250,
            'Weight Gain (0.5 kg/week)': TDEE + 500,
            'Fast Weight Gain (1 kg/week)': TDEE + 1000,
        };
        setShowResults(true);
        setCaloriesPerDay({ losingWeightOptions, gainingWeightOptions });
    };

    const calculateBMR = (age, gender, height, weight) => {
        let BMR = 0;
        if (gender === 'male') {
            BMR = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
        } else if (gender === 'female') {
            BMR = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
        }
        return BMR;
    };

    const handleClear = () => {
        age.current.value = '';
        Height.current.value = '';
        Weight.current.value = '';
        setGender('');
        setActivityLevel('');
        setGoal('');
        setShowResults(false);
    };

    return (
        <Container className='d-flex flex-column align-items-center my-4'>
            <Card className='m-3 text-black bg-info bg-opacity-50' style={{ maxWidth: '600px', width: '100%' }}>
                <CardTitle className='text-center'>
                    Calories Calculator
                </CardTitle>
                <CardBody>
                    <Form onSubmit={handleFormSubmit} className="font-weight-bold">
                        <Form.Group id="age">
                            <Form.Label>Age (15-80):</Form.Label>
                            <Form.Control type="number" ref={age} required />
                        </Form.Group>

                        <Form.Group id="gender">
                            <Form.Label>Gender:</Form.Label>
                            <Form.Check
                                type="radio"
                                id="female"
                                label="Female"
                                name="gender"
                                value="female"
                                checked={gender === 'female'}
                                onChange={() => setGender('female')}
                            />
                            <Form.Check
                                type="radio"
                                id="male"
                                label="Male"
                                name="gender"
                                value="male"
                                checked={gender === 'male'}
                                onChange={() => setGender('male')}
                            />
                        </Form.Group>

                        <Form.Group id="height">
                            <Form.Label>Height:</Form.Label>
                            <Form.Control type="number" placeholder='cm' ref={Height} required />
                        </Form.Group>

                        <Form.Group id="weight">
                            <Form.Label>Weight:</Form.Label>
                            <Form.Control type="number" placeholder='kg' ref={Weight} required />
                        </Form.Group>

                        <Form.Group id='goal'>
                            <Form.Label>Goal:</Form.Label>
                            <Form.Check
                                type="radio"
                                id="loseWeight"
                                label="Lose Weight"
                                name="goal"
                                value="loseWeight"
                                checked={goal === 'loseWeight'}
                                onChange={() => setGoal('loseWeight')}
                            />
                            <Form.Check
                                type="radio"
                                id="gainWeight"
                                label="Gain Weight"
                                name="goal"
                                value="gainWeight"
                                checked={goal === 'gainWeight'}
                                onChange={() => setGoal('gainWeight')}
                            />
                        </Form.Group>

                        <Form.Group id="activityLevel">
                            <Form.Label>Activity Level:</Form.Label>
                            <Form.Control as="select" value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)} required>
                                <option value="">Select your activity level</option>
                                <option value="1.2">Sedentary (little or no exercise)</option>
                                <option value="1.375">Lightly active (light exercise/sports 1-3 days/week)</option>
                                <option value="1.55">Moderately active (moderate exercise/sports 3-5 days/week)</option>
                                <option value="1.725">Very active (hard exercise/sports 6-7 days a week)</option>
                                <option value="1.9">Super active (very hard exercise/sports & a physical job)</option>
                            </Form.Control>
                        </Form.Group>

                        <div className="text-center">
                            <Button disabled={loading} className="btn btn-success my-2" type="submit">
                                Calculate
                                <FontAwesomeIcon icon={faPlayCircle} className="ms-2" />
                            </Button>
                            <Button className="btn btn-secondary my-2 mx-3" type="button" onClick={handleClear}>
                                Clear
                            </Button>
                        </div>
                    </Form>
                </CardBody>
            </Card>

            {showResults && (
                <Card className='m-3 text-black bg-success bg-opacity-50' style={{ maxWidth: '600px', width: '100%' }}>
                    <CardTitle className='text-center'>
                        Calories per Day
                    </CardTitle>
                    <CardBody>
                        {caloriesPerDay !== null ? (
                            <div>
                                {goal === 'loseWeight' && (
                                    <div>
                                        <h5>Calories per day for losing weight:</h5>
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Option</th>
                                                    <th>Calories</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.entries(caloriesPerDay.losingWeightOptions).map(([option, calories]) => (
                                                    <tr key={option}>
                                                        <td>{option}</td>
                                                        <td>{calories}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                                {goal === 'gainWeight' && (
                                    <div>
                                        <h5>Calories per day for gaining weight:</h5>
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Option</th>
                                                    <th>Calories</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.entries(caloriesPerDay.gainingWeightOptions).map(([option, calories]) => (
                                                    <tr key={option}>
                                                        <td>{option}</td>
                                                        <td>{calories}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p>Please fill out the form to calculate your calories per day.</p>
                        )}
                    </CardBody>
                </Card>
            )}
        </Container>
    );
}
