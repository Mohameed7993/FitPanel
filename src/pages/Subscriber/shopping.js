import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { Card, Container, Row, Col, Form } from "react-bootstrap";

const Shopping = () => {
  const { userlogindetails } = useAuth();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const db = getFirestore();

  useEffect(() => {
    const fetchProducts = async () => {
      if (userlogindetails.trainerID) {
        const q = query(collection(db, 'products'), where('TrainerID', '==', userlogindetails.trainerID));
        const querySnapshot = await getDocs(q);
        const productsList = querySnapshot.docs.map(doc => doc.data());
        setProducts(productsList);
      }
    };
    fetchProducts();
  }, [db, userlogindetails]);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const filteredProducts = products
    .filter(product =>
      product.ProductName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const priceA = parseFloat(a.ProductCost.replace(/[^\d.-]/g, ''));
      const priceB = parseFloat(b.ProductCost.replace(/[^\d.-]/g, ''));
      if (sortOption === "expensive") {
        return priceB - priceA;
      } else if (sortOption === "cheap") {
        return priceA - priceB;
      } else {
        return 0;
      }
    });

  return (
    <Container>
      <Row className="mb-3">
        <Col md={4}>
          <h5 className="text-end">מיון לפי</h5>
          <Form.Control
            as="select"
            value={sortOption}
            onChange={handleSortChange}
          >
            <option value="default">Sort by</option>
            <option value="expensive">היקר ביותר</option>
            <option value="cheap">הזול ביותר</option>
          </Form.Control>
        </Col>
      </Row>
      <Row className="justify-content-end mb-3">
        <Col md={4}>
          <h5 className="text-end">מצא את החלבון שלך</h5>
          <Form.Control
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </Col>
      </Row>
      <Row>
        {filteredProducts.map((product, index) => (
          <Col xs={12} sm={6} md={3} lg={3} key={index} className="mb-4">
            <Card
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: '3px solid #ddd',
                borderRadius: '0.375rem',
                overflow: 'hidden',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)' // Black shadow
              }}
            >
              <Card.Img
                variant="top"
                src={product.ProductImages ? product.ProductImages[0] : ''}
                style={{
                  height: '200px', // Adjust as needed
                  width: '100%',
                  background:'white'
                }}
              />
              <Card.Body style={{ flexGrow: 1 }}>
                <Card.Title>{product.ProductName}</Card.Title>
                <Card.Text>Price: ₪{product.ProductCost}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Shopping;
