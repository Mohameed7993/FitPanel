import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, getDocs, doc, updateDoc, deleteDoc ,where} from 'firebase/firestore';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { Table, Button, Container, Modal, Form } from 'react-bootstrap';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [gyms, setGyms] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    FirstName: '',
    LastName: '',
    EmailAddres: '',
    membershipStatus: '',
    role: '',
    IDstudio: '' // Added IdStudio to formData state
  });
  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'Users');
      const querySnapshot = await getDocs(query(usersCollection, where('role', '>=', 9)));
      const userData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userData);
    };
  
    fetchUsers();
  }, [db]);
  

  useEffect(() => {
    const fetchGyms = async () => {
      const gymStudiosCollection = collection(db, 'GymStudios');
      const gymStudiosSnapshot = await getDocs(gymStudiosCollection);
      const gymData = gymStudiosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGyms(gymData);
    };

    fetchGyms();
  }, [db]);

  const handleEdit = (user) => {
    setEditingUser(user.id);
    setFormData({
      FirstName: user.FirstName || '',
      LastName: user.LastName || '',
      EmailAddres: user.EmailAddres || '',
      membershipStatus: user.membershipStatus || '',
      role: user.role || '',
      IDstudio: user.IDstudio || '' // Set IdStudio in formData when editing
    });
  };

  const handleDelete = async (userId) => {
    await deleteDoc(doc(db, 'Users', userId));
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const validatedData = {};

    // Validate each field and add to validatedData if not undefined
    Object.keys(formData).forEach(key => {
      if (formData[key] !== undefined) {
        validatedData[key] = formData[key];
      }
    });

    try {
      await updateDoc(doc(db, 'Users', editingUser), validatedData);
      setUsers(users.map(user => user.id === editingUser ? { id: editingUser, ...validatedData } : user));
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const handleResetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Password reset email sent');
    } catch (error) {
      console.error('Error sending password reset email', error);
      alert('Error sending password reset email');
    }
  };

  const handleSuspendToggle = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'activated' ? 'suspended' : 'activated';
    try {
      await updateDoc(doc(db, 'Users', userId), { membershipStatus: newStatus });
      setUsers(users.map(user => user.id === userId ? { ...user, membershipStatus: newStatus } : user));
    } catch (error) {
      console.error("Error toggling membership status:", error);
    }
  };

  const getGymNameById = (IDstudio) => {
    console.log(IDstudio)
    const gym = gyms.find(gym => gym.IDstudio === IDstudio);
    return gym ? gym.gymName : 'Master';
  };

  return (
    <Container className="mt-4">
      <h2  className="text-info">Gym Managers & Online Trainers:</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email Address</th>
            <th>Membership Status</th>
            <th>Role</th>
            <th>Gym Studio</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.FirstName}</td>
              <td>{user.LastName}</td>
              <td>{user.EmailAddres}</td>
              <td>{user.membershipStatus}</td>
              <td>{user.role === 1 ? 'Customer' : (user.role === 9 ? 'Manager' : 'Master')}</td>
              <td>{getGymNameById(user.IDstudio)}</td>
              <td>
                <Button variant="info disable" onClick={() => handleEdit(user)}>Edit</Button>
                <Button variant="danger" onClick={() => handleDelete(user.UserId)} className="ms-2">Delete</Button>
                <Button
                  variant={user.membershipStatus === 'activated' ? 'warning' : 'success'}
                  onClick={() => handleSuspendToggle(user.id, user.membershipStatus)}
                  className="ms-2"
                >
                  {user.membershipStatus === 'activated' ? 'Suspend' : 'Activate'}
                </Button>
                <Button variant="primary" onClick={() => handleResetPassword(user.EmailAddres)} className="ms-2">Reset Password</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {editingUser && (
        <Modal show={true} onHide={() => setEditingUser(null)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleUpdate}>
              <Form.Group className="mb-3">
                <Form.Label>First Name:</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.FirstName}
                  onChange={(e) => setFormData({ ...formData, FirstName: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Last Name:</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.LastName}
                  onChange={(e) => setFormData({ ...formData, LastName: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email Address:</Form.Label>
                <Form.Control
                  type="email"
                  value={formData.EmailAddres}
                  onChange={(e) => setFormData({ ...formData, EmailAddres: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Membership Status:</Form.Label>
                <Form.Control
                  as="select"
                  value={formData.membershipStatus}
                  onChange={(e) => setFormData({ ...formData, membershipStatus: e.target.value })}
                >
                  <option value="">Select Status</option>
                  <option value="activated">Activated</option>
                  <option value="suspended">Suspended</option>
                </Form.Control>
              </Form.Group>
              <Button variant="primary" type="submit">
                Update
              </Button>
              <Button variant="secondary" onClick={() => setEditingUser(null)} className="ms-2">
                Cancel
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </Container>
  );
};

export default UserManagement;
