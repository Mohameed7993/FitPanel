// import { useAuth } from "./context/AuthContext";
// import React, {useRef, useState} from "react";
// import { Form,Button,Card, Alert,Container  } from "react-bootstrap";
// import { Link   } from "react-router-dom";
// import gymImage from './image/fitpanel1.png';



// export default function ForgotPassword(){

//     const emailRef=useRef()
//     const { resetPassword } =useAuth()
//     const [error,setError]=useState('')
//     const [message,setMessage]=useState('')
//     const [loading,setLoading]=useState(false)

// async function handleSubmit(e){
//     e.preventDefault()
//     try {
//         setError("")
//         setLoading(true)
//         console.log(emailRef.current.value)
//         await resetPassword(emailRef.current.value)
//         setMessage('Check your inbox for further instructions')
//     }catch (error) {
//         setError('Failed to reset password!')
//           }
      
//     setLoading(false);
// }


// return(
// <>
// <Container className="row my-5 justify-content-between  ">
//     <div className="col mx-5 ">
// <img className="w-100" src={gymImage} alt="Gym"/>
//     </div>
// <Card className="h-50 w-50 col  border-0" style={{ backgroundColor: 'transparent' }}  >
//     <Card.Body>
//         <h2 className="text-center mb-4">Password Rest </h2>
//         {error && <Alert variant="danger">{error}</Alert>}
//         {message && <Alert variant="success">{message}</Alert>}
//         <Form onSubmit={handleSubmit} className="text-black">
//             <Form.Group id="email">
//                 <Form.Label>Email</Form.Label>
//                 <Form.Control type="email" ref={emailRef} required/>
//             </Form.Group>
//             <div className="text-center">
//                  <Button disabled={loading} className=" btn-center w-10 my-2  " style={{background: 'var(--text-color)' }} type="submit">
//                 Reset Password 
//             </Button>
//             </div>
//             <div className="text-center">
               
                    
//                  <Link to="/" className="btn text-white  my-2"  style={{background: 'var(--text-color)' }}>
//                 Go Home
//                 </Link>
            
//             </div>
           
//         </Form>
        
//     </Card.Body>
// </Card>
           
//             </Container>


// </>
// )
// }


import { useAuth } from "./context/AuthContext";
import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import gymImage from './image/fitpanel1.png';

export default function ForgotPassword() {
  const emailRef = useRef();
  const { resetPassword } = useAuth();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setMessage('');
      setLoading(true);
      await resetPassword(emailRef.current.value);
      setMessage('Check your inbox for further instructions');
    } catch (error) {
      setError('Failed to reset password!');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container className="py-5">
      <Row className="align-items-center justify-content-center">
        {/* Image on larger screens */}
        <Col lg={6} className="d-none d-lg-block">
          <img src={gymImage} alt="Gym" className="img-fluid rounded" />
        </Col>

        {/* Form Card */}
        <Col xs={12} md={10} lg={6}>
          <Card className="shadow border-0" style={{ backgroundColor: 'var(--secondary-color)' }}>
            <Card.Body>
              <h2 className="text-center mb-4" style={{ color: 'var(--text-color)' }}>שחזור סיסמה</h2>

              {error && <Alert variant="danger">{error}</Alert>}
              {message && <Alert variant="success">{message}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label style={{ color: 'var(--text-color)' }}>אימייל</Form.Label>
                  <Form.Control type="email" ref={emailRef} required placeholder="הזן כתובת מייל" />
                </Form.Group>

                <div className="text-center">
                  <Button disabled={loading} type="submit" className="w-100 mb-2" style={{ backgroundColor: 'var(--text-color)' }}>
                    שלח קישור לאיפוס סיסמה
                  </Button>
                  <Link to="/" className="btn btn-outline-light w-100" style={{ backgroundColor: 'var(--text-color)' }}>
                    חזרה לדף הבית
                  </Link>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
