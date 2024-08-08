import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Table, Button, Container, Modal, Form } from "react-bootstrap";

const GymsStudio = () => {
  const [gymStudios, setGymStudios] = useState([]);
  const [editModalShow, setEditModalShow] = useState(false);
  const [selectedGym, setSelectedGym] = useState(null);
  const [editedGymName, setEditedGymName] = useState("");
  const [editedGymLocation, setEditedGymLocation] = useState("");

  useEffect(() => {
    const fetchGymStudios = async () => {
      try {
        const db = getFirestore();
        const gymStudiosCollection = collection(db, "GymStudios");
        const snapshot = await getDocs(gymStudiosCollection);
        const gymStudiosData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setGymStudios(gymStudiosData);
      } catch (error) {
        console.error("Error fetching gym studios:", error);
      }
    };

    fetchGymStudios();
  }, []);

  const handleDeleteGym = async (id) => {
    try {
      const db = getFirestore();
      const gymDocRef = doc(db, "GymStudios", id);
      await deleteDoc(gymDocRef);
      setGymStudios((prevStudios) => prevStudios.filter((studio) => studio.id !== id));
      console.log("Gym deleted successfully!");
    } catch (error) {
      console.error("Error deleting gym:", error);
    }
  };

  const handleChangeStatus = async (id, newStatus) => {
    try {
      const db = getFirestore();
      const gymDocRef = doc(db, "GymStudios", id);
      await updateDoc(gymDocRef, {
        membershipStatus: newStatus
      });
      setGymStudios((prevStudios) =>
        prevStudios.map((studio) =>
          studio.id === id ? { ...studio, membershipStatus: newStatus } : studio
        )
      );
      console.log("Gym status updated successfully!");
    } catch (error) {
      console.error("Error updating gym status:", error);
    }
  };

  const handleEditGym = async () => {
    try {
      const db = getFirestore();
      const gymDocRef = doc(db, "GymStudios", selectedGym.id);
      await updateDoc(gymDocRef, {
        gymName: editedGymName,
        gymLocation: editedGymLocation
      });
      setGymStudios((prevStudios) =>
        prevStudios.map((studio) =>
          studio.id === selectedGym.id
            ? { ...studio, gymName: editedGymName, gymLocation: editedGymLocation }
            : studio
        )
      );
      setEditModalShow(false);
      console.log("Gym updated successfully!");
    } catch (error) {
      console.error("Error updating gym:", error);
    }
  };

  const handleEditModalShow = (gym) => {
    setSelectedGym(gym);
    setEditedGymName(gym.gymName);
    setEditedGymLocation(gym.gymLocation);
    setEditModalShow(true);
  };

  return (
    <Container className="mt-4">
      <h2  className="text-info">Gym Studios</h2>
      <Table striped bordered hover>
        <thead> 
          
          <tr>
            <th>#</th>
            <th>Gym Name</th>
            <th>Gym ID</th>
            <th>Gym Location</th>
            <th>Gym Members</th>
            <th>Membership Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {gymStudios.map((gym, index) => (
            <tr key={gym.id}>
              <td>{index + 1}</td>
              <td>{gym.gymName}</td>
              <td>{gym.IDstudio}</td>
              <td>{gym.gymLocation}</td>
              <td>{gym.gymMembers}</td>
              <td>{gym.membershipStatus}</td>
              <td>
                <Button variant="info" onClick={() => handleEditModalShow(gym)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDeleteGym(gym.id)} className="ms-2">
                  Delete
                </Button>
                <Button
                  variant={gym.membershipStatus === "activated" ? "warning" : "success"}
                  className="ms-2"
                  onClick={() =>
                    handleChangeStatus(
                      gym.id,
                      gym.membershipStatus === "activated" ? "suspend" : "activated"
                    )
                  }
                >
                  {gym.membershipStatus === "activated" ? "Suspend" : "Activate"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Edit Modal */}
      <Modal show={editModalShow} onHide={() => setEditModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Gym</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Gym Name</Form.Label>
              <Form.Control
                type="text"
                value={editedGymName}
                onChange={(e) => setEditedGymName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Gym Location</Form.Label>
              <Form.Control
                type="text"
                value={editedGymLocation}
                onChange={(e) => setEditedGymLocation(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditModalShow(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditGym}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default GymsStudio;
