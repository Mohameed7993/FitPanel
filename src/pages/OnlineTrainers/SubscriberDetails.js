import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLevelUpAlt,faTrash, faImage,faLevelDownAlt } from '@fortawesome/free-solid-svg-icons'; // Import the icons
import { Toast, ToastContainer, Button, Form ,Modal, Table } from 'react-bootstrap';
import { getFirestore , Timestamp} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import MeasurementsModal from '../MeasurementsModal';



const SubscriberDetails = ({ customerId }) => {
  const SERVERSIDEURL="https://fitpanelserverside.onrender.com"
  const {userlogindetails}=useAuth()
  const [showToast, setShowToast] = useState(false);
  const [ShowToastfiles, setShowToastfiles] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedWeekImages, setSelectedWeekImages] = useState([]);
  const [showMeasurementsModal, setShowMeasurementsModal] = useState(false);
  const [newImages, setNewImages] = useState([]);
  const [measurements, setMeasurements] = useState([]);

  const db = getFirestore();
  useEffect(() => {
    const fetchMeasurements = async () => {
      try {
        if (customerId?.id) {
          const response = await fetch(`${SERVERSIDEURL}/MoDumbels/measurements/${customerId.id}`);
          const result = await response.json();
  
          if (response.ok) {
            setMeasurements(result.measurements || []);
          } else {
            console.error('Failed to fetch measurements:', result.message);
          }
        }
      } catch (error) {
        console.error('Error fetching measurements:', error);
      }
    };
  
    fetchMeasurements();
  }, [customerId?.id]);
  
  
  const getFormattedDate = (timestamp) => {
    try {
      // Case 1: Firestore Timestamp with .toDate()
      if (timestamp?.toDate) {
        const date = timestamp.toDate();
        return formatDate(date);
      }
  
      // Case 2: Firestore timestamp-like object from backend
      if (typeof timestamp?.seconds === 'number') {
        const date = new Date(timestamp.seconds * 1000);
        return formatDate(date);
      }
  
      // Case 3: ISO string or regular timestamp
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) throw new Error('Invalid date');
      return formatDate(date);
    } catch (error) {
      console.error('Invalid timestamp:', timestamp);
      return "Invalid Date";
    }
  };
  
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  
 

  const [newMeasurements, setNewMeasurements] = useState({
    back: '',
    chest: '',
    abdomen: '',
    shoulders: '',
    weight: '',
    rightArm: '',
    leftArm: '',
    rightLeg: '',
    leftLeg: '',
    images: [],
    updatedAt: getFormattedDate(Timestamp.now()),
  });

  const hebrewLabels = {
    back: 'גב',
    chest: 'חזה',
    abdomen: 'בטן',
    shoulders: 'כתפיים',
    weight: 'משקל',
    rightArm: 'יד ימין',
    leftArm: 'יד שמאל',
    rightLeg: 'רגל ימין',
    leftLeg: 'רגל שמאל',
    updatedAt: 'עודכן בתאריך',
  };
  

  const handleMeasurementsChange = (e) => {
    const { name, value } = e.target;
    setNewMeasurements({ ...newMeasurements, [name]: value });
  };

  const handleImagesChange = (e) => {
    setNewImages([...e.target.files]);
  };
  const handleAddMeasurements = async () => {
  if (!userlogindetails) return;

  const formData = new FormData();
  formData.append('customerId', customerId.id);
  formData.append('newMeasurements', JSON.stringify(newMeasurements));
  newImages.forEach((file) => {
    formData.append('images', file);
  });

  try {
    const response = await fetch(`${SERVERSIDEURL}/MoDumbels/addMeasurement`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload measurement');
    }

    const data = await response.json();
    setMeasurements(data.weeks);
    setShowMeasurementsModal(false);
  } catch (error) {
    console.error('Error adding measurements via backend:', error);
  }
};

  const handleOpenMeasurementsModal = () => setShowMeasurementsModal(true);

const handleCloseMeasurementsModal = () => setShowMeasurementsModal(false);

const handleButton = () => {
    handleOpenMeasurementsModal();
  // setLoading(false);
};

 

  // Determine the status class based on the membership status
  const statusClass = customerId?.membershipStatus === 'activated' ? 'text-success ' : 'text-danger ';

  // Function to calculate differences between the last two weeks
 
  const calculateDifferences = () => {
    if (measurements.length < 2) return {};

    const lastWeek = measurements[measurements.length - 1];
    const secondLastWeek = measurements[measurements.length - 2];

    const differences = {
      back: (lastWeek['back'] || 0) - (secondLastWeek['back'] || 0),
      chest: (lastWeek['chest'] || 0) - (secondLastWeek['chest'] || 0),
      abdomen: (lastWeek['abdomen'] || 0) - (secondLastWeek['abdomen'] || 0),
      shoulders: (lastWeek['shoulders'] || 0) - (secondLastWeek['shoulders'] || 0),
      weight: (lastWeek['weight'] || 0) - (secondLastWeek['weight'] || 0),
      rightArm: (lastWeek['rightArm'] || 0) - (secondLastWeek['rightArm'] || 0),
      leftArm: (lastWeek['leftArm'] || 0) - (secondLastWeek['leftArm'] || 0),
      rightLeg: (lastWeek['rightLeg'] || 0) - (secondLastWeek['rightLeg'] || 0),
      leftLeg: (lastWeek['leftLeg'] || 0) - (secondLastWeek['leftLeg'] || 0),
    };

    return differences;
  };

  const differences = calculateDifferences();

  const [trainingPlanFile, setTrainingPlanFile] = useState(null);
  const [foodPlanFile, setFoodPlanFile] = useState(null);



  const handleFileUpload = (e) => {
    const { name, files } = e.target;
    if (!files || files.length === 0) return;
  
    if (name === 'trainingPlan') setTrainingPlanFile(files[0]);
    if (name === 'foodPlan') setFoodPlanFile(files[0]);
  };
  
  const handelsaveFiles = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('customerId', customerId.id);
    formData.append('firstName', userlogindetails.FirstName);
    formData.append('lastName', userlogindetails.LastName);
  
    if (trainingPlanFile) formData.append('trainingPlan', trainingPlanFile);
    if (foodPlanFile) formData.append('foodPlan', foodPlanFile);
  
    try {
      const response = await fetch(`${SERVERSIDEURL}/MoDumbels/uploadPlans`, {
        method: 'POST',
        body: formData
      });
  
      if (!response.ok) {
        throw new Error('Upload failed');
      }
  
      const data = await response.json();
      setShowToastfiles(true);
    } catch (error) {
      console.error('Error uploading plans:', error);
    }
  };

   // Function to handle the deletion of a measurement
   const handleDeleteMeasurement = async (index) => {
    try {
      const response = await fetch(`${SERVERSIDEURL}/MoDumbels/deleteMeasurement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: customerId.id,
          index,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        setMeasurements(data.weeks);
        alert('Deleted successfully!');
      } else {
        console.error('Failed to delete measurement');
      }
    } catch (error) {
      console.error('Error deleting measurement:', error);
    }
  };

  // Function to handle image icon click
 const handleShowImages = (week) => {
    setSelectedWeekImages(week.images || []);
    setShowModal(true);
  };

  const handleDownload = (fileURL, customerName, docType) => {
    console.log('File URL:', fileURL);
    //print the customer name and docType
    console.log('Customer Name:', customerName);
    console.log('Document Type:', docType);
    if (!fileURL) {
      setShowToast(true);
      return;
    }
  
    // Sanitize the customer name (remove special chars if needed)
    const safeName = customerName.replace(/\s+/g, '_').replace(/[^\w\-]/g, '');
    const fileName = `${safeName}_${docType}_Plan.pdf`;
  
    const link = document.createElement('a');
    link.href = fileURL;
    link.setAttribute('download', fileName);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const metrics = [
 
    { key: 'updatedAt', name: 'נמדד בתאריך' },
    { key: 'leftLeg', name: 'רגל שמאל' },
    { key: 'rightLeg', name: 'רגל ימין' },
    { key: 'leftArm', name: 'יד שמאל' },
    { key: 'rightArm', name: 'יד ימין' },
    { key: 'shoulders', name: 'כתפיים' },
    { key: 'abdomen', name: 'בטן' },
    { key: 'chest', name: 'חזה' },
    { key: 'back', name: 'גב' },
    { key: 'weight', name: 'משקל' },
    { key: 'delete', name: 'מחיקה' },
    { key: 'images', name: 'תמונות' },
    
  ];
  return (
    <div className="container mt-4">
      <div className="row justify-content-between">
        {userlogindetails.role===8 && (
        <div className="text-md-right" style={{ color: 'var(--text-color)' }}>
          <h6 className=' text-end'>{customerId?.name}  <strong > :שם מתאמן  </strong> </h6>
          <h6 className=' text-end'>{customerId?.phoneNumber}  <strong >:מספר טלפון  </strong> </h6>
          <h6 className=' text-end'>{customerId?.email} <strong > :אימייל  </strong> </h6>
          <p className='text-end ' >
             <strong  className={statusClass}>{customerId?.membershipStatus}</strong><strong > : מצב</strong>
          </p>
        </div>)}
        <div className="col-md" >
          <h1 className='text-end'>מדידות</h1>
          {userlogindetails.role===2&&(

      <Button
      onClick={handleButton}
      >הוספת מדידה חדשה</Button>
      
      )} 
          <div style={{ overflowX: 'scroll' }}>
          <Table className="text-end " striped bordered hover>
      <thead>
        <tr>
          {measurements.slice().reverse().map((_, index) => (
            <th key={index}>{`שבוע ${measurements.length - index}`}</th>
          ))}
          <th>שבוע\מדד</th>
        </tr>
      </thead>
      <tbody>
        {metrics.map((metric, metricIndex) => (
          <tr key={metricIndex}>
            {measurements.slice().reverse().map((week, weekIndex) => (
              <td key={weekIndex}>
                {metric.key === 'delete' && (
                  <Button
                    variant="danger"
                    size='sm'
                    onClick={() => handleDeleteMeasurement(measurements.length - weekIndex - 1)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                )}
                {metric.key === 'images' && (
                  <Button
                    variant="info"
                    size='sm'
                    onClick={() => handleShowImages(week)}
                  >
                    <FontAwesomeIcon icon={faImage} />
                  </Button>
                )} 
                {metric.key !== 'delete' && metric.key !== 'images' && (
  metric.key === 'updatedAt'
    ? getFormattedDate(week[metric.key])
    : week[metric.key] || '-'
)}

              </td>
            ))}
            <td>{metric.name}</td>
          </tr>
        ))}
      </tbody>
    </Table>
 
    </div>
        </div>
      </div>
      
      {userlogindetails.role==8 &&(
       <div className="row  justify-content-end d-flex my-2" >
         {/* File upload and download section */}
         <div className="col-md-4" >
          <div className="card text-end mt-5"  style={{ color: 'var(--text-color)' }}>
            <div className="card-header">
              תכניות אימון ותזונה
            </div>
            <div className="card-body">
              <h5>הורד את תכניות האימון והאוכל:</h5>
              <Button
                className="btn btn-primary mb-2 mx-2"
                onClick={() => handleDownload(customerId?.trainingPlanURL,customerId.name, 'Training')}
                size='sm'
              >
                הורד תכנית אימון
              </Button>
              <Button
                className="btn btn-primary mb-2 mx-2"
                onClick={() => handleDownload(customerId?.foodPlanURL,customerId.name, 'Food')}
                size='sm'
              >
                הורד תכנית אוכל
              </Button>

              <ToastContainer position="top-end" className="p-3">
                <Toast
                  show={showToast}
                  onClose={() => setShowToast(false)}
                  bg="danger"
                  text="white"
                  delay={5000}
                  autohide>
                  <Toast.Body>אין קובץ להורדה!</Toast.Body>
                </Toast>
              </ToastContainer>

              <ToastContainer position="top-end" className="p-3">
                <Toast
                  show={ShowToastfiles}
                  onClose={() => setShowToastfiles(false)}
                  bg="success"
                  text="white"
                  delay={5000}
                  autohide>
                  <Toast.Body>קבצים נשמרו בהצלחה.</Toast.Body>
                </Toast>
              </ToastContainer>

              <h5>העלה תכניות חדשות:</h5>
              <Form.Group>
                <Form.Label>העלה תכנית אימון</Form.Label>
                <Form.Control
                  type="file"
                  name='trainingPlan'
                  onChange={handleFileUpload}
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>העלה תכנית אוכל</Form.Label>
                <Form.Control
                  type="file"
                  name='foodPlan'
                  onChange={handleFileUpload}
                />
              </Form.Group>
              <Button 
              className="btn btn-primary mb-2 my-2"
              onClick={handelsaveFiles}>
                Save new Files
                </Button>
            </div>
          </div>
        </div>
        <div className="col-md-3 ">

          
          <div className="card text-end  mt-5 my-3" style={{ color: 'var(--text-color)' }}>
            <div className="card-header">
              שינויי מדידות בשבועיים האחרונים
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush ">
                <li className="list-group-item">
                  <strong>גב:</strong>
                  <FontAwesomeIcon
                    icon={differences.back > 0 ? faLevelUpAlt : faLevelDownAlt}
                    className={differences.back > 0 ? 'text-success' : 'text-danger'}
                  />
                  {differences.back !== undefined ? `${differences.back > 0 ? '+' : ''}${differences.back}` : '-'}
                </li>
                <li className="list-group-item">
                  <strong>כתפיים:</strong>
                  <FontAwesomeIcon
                    icon={differences.shoulders > 0 ? faLevelUpAlt : faLevelDownAlt}
                    className={differences.shoulders > 0 ? 'text-success' : 'text-danger'}
                  />
                  {differences.shoulders !== undefined ? `${differences.shoulders > 0 ? '+' : ''}${differences.shoulders}` : '-'}
                </li>
                <li className="list-group-item">
                  <strong>חזה:</strong>
                  <FontAwesomeIcon
                    icon={differences.chest > 0 ? faLevelUpAlt : faLevelDownAlt}
                    className={differences.chest > 0 ? 'text-success' : 'text-danger'}
                  />
                  {differences.chest !== undefined ? `${differences.chest > 0 ? '+' : ''}${differences.chest}` : '-'}
                </li>
                <li className="list-group-item">
                  <strong>בטן:</strong>
                  <FontAwesomeIcon
                    icon={differences.abdomen > 0 ? faLevelUpAlt : faLevelDownAlt}
                    className={differences.abdomen > 0 ? 'text-success' : 'text-danger'}
                  />
                  {differences.abdomen !== undefined ? `${differences.abdomen > 0 ? '+' : ''}${differences.abdomen}` : '-'}
                </li>
                <li className="list-group-item">
                  <strong>משקל:</strong>
                  <FontAwesomeIcon
                    icon={differences.weight > 0 ? faLevelUpAlt : faLevelDownAlt}
                    className={differences.weight > 0 ? 'text-success' : 'text-danger'}
                  />
                  {differences.weight !== undefined ? `${differences.weight > 0 ? '+' : ''}${differences.weight}` : '-'}
                </li>
                <li className="list-group-item">
                  <strong>יד ימין:</strong>
                  <FontAwesomeIcon
                    icon={differences.rightArm > 0 ? faLevelUpAlt : faLevelDownAlt}
                    className={differences.rightArm > 0 ? 'text-success' : 'text-danger'}
                  />
                  {differences.rightArm !== undefined ? `${differences.rightArm > 0 ? '+' : ''}${differences.rightArm}` : '-'}
                </li>
                <li className="list-group-item">
                  <strong>יד שמאל:</strong>
                  <FontAwesomeIcon
                    icon={differences.leftArm > 0 ? faLevelUpAlt : faLevelDownAlt}
                    className={differences.leftArm > 0 ? 'text-success' : 'text-danger'}
                  />
                  {differences.leftArm !== undefined ? `${differences.leftArm > 0 ? '+' : ''}${differences.leftArm}` : '-'}
                </li>
                <li className="list-group-item">
                  <strong>רגל ימין:</strong>
                  <FontAwesomeIcon
                    icon={differences.rightLeg > 0 ? faLevelUpAlt : faLevelDownAlt}
                    className={differences.rightLeg > 0 ? 'text-success' : 'text-danger'}
                  />
                  {differences.rightLeg !== undefined ? `${differences.rightLeg > 0 ? '+' : ''}${differences.rightLeg}` : '-'}
                </li>
                <li className="list-group-item">
                  <strong>רגל שמאל:</strong>
                  <FontAwesomeIcon
                    icon={differences.leftLeg > 0 ? faLevelUpAlt : faLevelDownAlt}
                    className={differences.leftLeg > 0 ? 'text-success' : 'text-danger'}
                  />
                  {differences.leftLeg !== undefined ? `${differences.leftLeg > 0 ? '+' : ''}${differences.leftLeg}` : '-'}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      )}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>תמונות שבוע</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedWeekImages.length > 0 ? (
            selectedWeekImages.map((image, index) => (
              <img
                key={index}
                src={image}
                width={200}
                
                alt={`Week Image ${index + 1}`}
                className="img-fluid mb-2 "
              />
            ))
          ) : (
            <p>אין תמונות להצגה עבור שבוע זה.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            סגור
          </Button>
        </Modal.Footer>
      </Modal>
      <MeasurementsModal
  show={showMeasurementsModal}
  onHide={handleCloseMeasurementsModal}
  onChange={handleMeasurementsChange}
  onAdd={handleAddMeasurements}
  measurements={newMeasurements}
  hebrewLabels={hebrewLabels}
  onImageChange={handleImagesChange}
/>

    </div>
  );
};

export default SubscriberDetails;

