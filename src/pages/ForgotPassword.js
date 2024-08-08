import { useAuth } from "./context/AuthContext";
import React, {useRef, useState} from "react";
import { Form,Button,Card, Alert,Container  } from "react-bootstrap";
import { Link   } from "react-router-dom";
import gymImage from './image/Mo Dumbels.png';



export default function ForgotPassword(){

    const emailRef=useRef()
    const { resetPassword } =useAuth()
    const [error,setError]=useState('')
    const [message,setMessage]=useState('')
    const [loading,setLoading]=useState(false)

async function handleSubmit(e){
    e.preventDefault()

   
    try {
        setError("")
        setLoading(true)
        console.log(emailRef.current.value)
        await resetPassword(emailRef.current.value)
        setMessage('Check your inbox for further instructions')
    }catch (error) {
        setError('Failed to reset password!')
          }
      
    setLoading(false);
}


return(
<>
<Container className="row my-5 justify-content-between  ">
    <div className="col mx-5 ">
<img src={gymImage} alt="Gym"/>
    </div>
<Card className="h-50 w-50 col  border-0" style={{ backgroundColor: 'transparent' }}  >
    <Card.Body>
        <h2 className="text-center mb-4">Password Rest </h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {message && <Alert variant="success">{message}</Alert>}
        <Form onSubmit={handleSubmit} className="text-black">
            <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" ref={emailRef} required/>
            </Form.Group>
            <div className="text-center">
                 <Button disabled={loading} className=" btn-center w-10 my-2  text-black" type="submit">
                Reset Password 
            </Button>
            </div>
            <div className="text-center">
                    <Button disabled={loading} className=" btn-center w-10 my-2  text-black" type="submit">
                Sign Up
            </Button>
            </div>
           
        </Form>
        
    </Card.Body>
</Card>
           
            </Container>


</>
)


}