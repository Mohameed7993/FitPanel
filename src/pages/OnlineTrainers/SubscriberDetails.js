import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLevelUpAlt,faTrash, faImage,faLevelDownAlt } from '@fortawesome/free-solid-svg-icons'; // Import the icons
import { Toast, ToastContainer, Button, Form ,Modal, Table,Pagination } from 'react-bootstrap';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore ,updateDoc,setDoc,doc,getDoc, Timestamp} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { PDFDocument, rgb } from 'pdf-lib';
import logo from '../image/newlogo.png';
import MeasurementsModal from '../MeasurementsModal';



const SubscriberDetails = ({ customerId }) => {
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
          const customerDocRef = doc(db, 'customers', customerId.id);
          const docSnapshot = await getDoc(customerDocRef);
  
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            setMeasurements(data.weeks || []);
          } else {
            console.log('No such document!');
          }
        }
      } catch (error) {
        console.error('Error fetching measurements:', error);
      }
    };
  
    fetchMeasurements();
  }, [customerId?.id, db]);
  
  const getFormattedDate = (timestamp) => {
    if (!timestamp || isNaN(timestamp)) {
      return "Invalid Date";
    }

    const date = new Date(timestamp.toDate());
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const storage = getStorage(); // Initialize the storage instance
 


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
  
    const customerRef = doc(db, 'customers', userlogindetails.id);
    try {
      const customerDoc = await getDoc(customerRef);
      if (customerDoc.exists()) {
        const customerData = customerDoc.data();
        const imageUrls = await Promise.all(newImages.map(async (imageFile) => {
          const storageRef = ref(storage, `customers/${userlogindetails.id}/images/${imageFile.name}`);
          await uploadBytes(storageRef, imageFile);
          return getDownloadURL(storageRef);
        }));
  
        const updatedWeek = { ...newMeasurements, images: imageUrls };
        const updatedWeeks = customerData.weeks ? [...customerData.weeks, updatedWeek] : [updatedWeek];
  
        await updateDoc(customerRef, { weeks: updatedWeeks });
        setMeasurements(updatedWeeks); // Update local state to reflect changes
  
        setShowMeasurementsModal(false);
      }
    } catch (error) {
      console.error('Error adding measurements:', error);
      // Optionally, show an error toast here
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

  // Function to handle file upload
  const handleFileUpload =  (e) => {
    const {name,files}=e.target;
    const file = e.target.files[0];
    if (!file) return;
    name==='trainingPlan'? setTrainingPlanFile(files[0]): setFoodPlanFile(files[0]);
  };

  const modifyPdf = async (file) => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        try {
          const pdfDoc = await PDFDocument.load(reader.result);
          const pages = pdfDoc.getPages();
          const footerText = 'All rights reserved for © Mo-Dumbels 2024';
          const userNameText = `${userlogindetails.FirstName} ${userlogindetails.LastName}`;
          const uploadDate = getFormattedDate(Timestamp.now());

          // Load the icon image from URL
          const iconBytes = await fetch(logo).then(res => res.arrayBuffer());
          const iconImage = await pdfDoc.embedPng(iconBytes);

          pages.forEach(page => {
            const { width, height } = page.getSize();

            // Add icon
            page.drawImage(iconImage, {
              x: 30,
              y: height - 150,
              width: 120,
              height: 120,
            });

            // Add upload date
            page.drawText(uploadDate, {
              x: width - 150,
              y: height - 90,
              size: 12,
              color: rgb(0, 0, 0),
            });


            // Add user name at the bottom left
            page.drawText(userNameText, {
              x: 50,
              y: 50,
              size: 12,
              color: rgb(0, 0, 0),
            });

            // Add footer text
            page.drawText(footerText, {
              x: 50,
              y: 30,
              size: 12,
              color: rgb(0, 0, 0),
            });
          });

          const modifiedPdfBytes = await pdfDoc.save();
          resolve(new Blob([modifiedPdfBytes], { type: 'application/pdf' }));
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const handelsaveFiles = async (e) => {
    e.preventDefault();

    let trainingPlanURL = '';
    let foodPlanURL = '';

    if (trainingPlanFile) {
      try {
        const modifiedTrainingPlanBlob = await modifyPdf(trainingPlanFile);
        const trainingPlanRef = ref(storage, `TrainingPlans/${customerId.id}`);
        await uploadBytes(trainingPlanRef, modifiedTrainingPlanBlob);
        trainingPlanURL = await getDownloadURL(trainingPlanRef);
      } catch (error) {
        console.error('Error modifying and uploading training plan file:', error);
      }
    }

    if (foodPlanFile) {
      try {
        const modifiedFoodPlanBlob = await modifyPdf(foodPlanFile);
        const foodPlanRef = ref(storage, `FoodPlans/${customerId.id}`);
        await uploadBytes(foodPlanRef, modifiedFoodPlanBlob);
        foodPlanURL = await getDownloadURL(foodPlanRef);
      } catch (error) {
        console.error('Error modifying and uploading food plan file:', error);
      }
    }

    try {
      await setDoc(doc(db, 'customers', customerId.id), {
        ...customerId,
        trainingPlanURL,
        foodPlanURL,
      });
      setShowToastfiles(true);
    } catch (error) {
      console.error('Error updating Firestore:', error);
    }
  };

   // Function to handle the deletion of a measurement
   const handleDeleteMeasurement = async (index) => {
    const updatedMeasurements = measurements.filter((_, i) => i !== index);

    try {
      await updateDoc(doc(db, 'customers', customerId.id), {
        weeks: updatedMeasurements,
      });

      // Update local state to refresh the table
      setMeasurements(updatedMeasurements);
      alert("Deleted successfully!");
    } catch (error) {
      console.error("Error deleting measurement: ", error);
    }
  };

  // Function to handle image icon click
 const handleShowImages = (week) => {
    setSelectedWeekImages(week.images || []);
    setShowModal(true);
  };

  // Function to download file
  const handleDownload = (fileURL) => {
    if (!fileURL) {
      setShowToast(true);
      return;
    }

    const link = document.createElement('a');
    link.href = fileURL;
    link.download = fileURL.split('/').pop();
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
                week[metric.key] || '-'
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
                onClick={() => handleDownload(customerId?.trainingPlanURL)}
                size='sm'
              >
                הורד תכנית אימון
              </Button>
              <Button
                className="btn btn-primary mb-2 mx-2"
                onClick={() => handleDownload(customerId?.foodPlanURL)}
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

