import React, { useState, useEffect } from "react";
import { Table, Button, Alert, Modal, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getFirestore, collection, query, where, getDocs, deleteDoc, updateDoc ,doc} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const GymCustomers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { userlogindetails } = useAuth(); // Assuming you have user's details from AuthContext

    // State for modal
    const [showEditModal, setShowEditModal] = useState(false);
    const [editUserId, setEditUserId] = useState("");
    const [editFirstName, setEditFirstName] = useState("");
    const [editLastName, setEditLastName] = useState("");
    const [editEmailAddress, setEditEmailAddress] = useState("");
    const [editMembershipStatus, setEditMembershipStatus] = useState("");
console.log(userlogindetails.IDstudio)
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        setError("");
    
        try {
            const db = getFirestore();
            const usersRef = collection(db, "Users");
    
            // Check if userlogindetails exists and has IDstudio property
            if (userlogindetails && userlogindetails.IDstudio) {
                const q = query(usersRef, where("IDstudio", "==", userlogindetails.IDstudio));
                const querySnapshot = await getDocs(q);
    
                const userData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
    
                setUsers(userData);
            } else {
                setError("User details not found or IDstudio is undefined.");
            }
        } catch (error) {
            console.error("Error fetching users: ", error);
            setError("Failed to fetch users. Please try again later.");
        }
    
        setLoading(false);
    };
    

    const handleDelete = async (userId) => {
        const db = getFirestore();
        await deleteDoc(doc(db, 'Users', userId));
        setUsers(users.filter(user => user.id !== userId));
      };

    
    const handleSuspendToggle = async (userId, currentStatus) => {
        const newStatus = currentStatus === 'activated' ? 'suspended' : 'activated';
        try {
            const db = getFirestore();
          await updateDoc(doc(db, 'Users', userId), { membershipStatus: newStatus });
          setUsers(users.map(user => user.id === userId ? { ...user, membershipStatus: newStatus } : user));
        } catch (error) {
          console.error("Error toggling membership status:", error);
        }
      };

    const handleShowEditModal = (user) => {
        setEditUserId(user.UserId);
        setEditFirstName(user.FirstName);
        setEditLastName(user.LastName);
        setEditEmailAddress(user.EmailAddress);
        setEditMembershipStatus(user.membershipStatus);
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
    };

    const handleEditUser = async () => {
        try {
            const db = getFirestore();
            const userRef = doc(db, "Users", editUserId); // Corrected this line
            await updateDoc(userRef, {
                FirstName: editFirstName,
                LastName: editLastName,
                EmailAddress: editEmailAddress,
                membershipStatus: editMembershipStatus,
            });
            setShowEditModal(false); // Close the modal after editing
            fetchUsers(); // Refresh the user list
        } catch (error) {
            console.error("Error updating user: ", error);
            setError("Failed to update user. Please try again later.");
        }
    };
    

    return (
        <>
            <h2>Gym Customers</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.UserId}</td>
                            <td>{user.FirstName}</td>
                            <td>{user.LastName}</td>
                            <td>{user.EmailAddress}</td>
                            <td>{user.membershipStatus}</td>
                            <td>
                                <Button variant="primary" onClick={() => handleShowEditModal(user)}>
                                    Edit
                                </Button>{" "}
                                <Button variant="danger" onClick={() => handleDelete(user.UserId)} className="ms-2">Delete</Button>{" "}
                                <Button
                  variant={user.membershipStatus === 'activated' ? 'warning' : 'success'}
                  onClick={() => handleSuspendToggle(user.UserId, user.membershipStatus)}
                  className="ms-2"
                >
                  {user.membershipStatus === 'activated' ? 'Suspend' : 'Activate'}
                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {loading && <p>Loading...</p>}

            {/* Edit User Modal */}
            <Modal show={showEditModal} onHide={handleCloseEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="editFirstName">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={editFirstName}
                                onChange={(e) => setEditFirstName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="editLastName">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={editLastName}
                                onChange={(e) => setEditLastName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="editEmailAddress">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                value={editEmailAddress}
                                onChange={(e) => setEditEmailAddress(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="editMembershipStatus">
                            <Form.Label>Membership Status</Form.Label>
                            <Form.Control
                                as="select"
                                value={editMembershipStatus}
                                onChange={(e) => setEditMembershipStatus(e.target.value)}
                            >
                                <option value="activated">Activated</option>
                                <option value="suspended">Suspended</option>
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEditModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleEditUser}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default GymCustomers;
