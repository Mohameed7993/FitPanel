import React, { useState, useEffect } from "react";
import { getFirestore, collection, query, where, getDocs, setDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Modal, Button, Row, Col, Form, Toast, Pagination } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext'; // Adjust the path as needed
import 'bootstrap/dist/css/bootstrap.min.css';
import LoadingModal from '../LoadingModal'; // Adjust the path as necessary

const Shop = () => {
  const { userlogindetails } = useAuth(); // Get userlogindetails from context
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImagesModal, setShowImagesModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    ProductName: '',
    ProductCost: '',
    ProductDetails: '',
    ProductImages: [],
  });
  const [selectedProductImages, setSelectedProductImages] = useState([]);
  const [editProduct, setEditProduct] = useState({
    id: '',
    ProductName: '',
    ProductCost: ''
  });
  const [searchQuery, setSearchQuery] = useState(''); // Search state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page state

  const db = getFirestore();
  const storage = getStorage();

  useEffect(() => {
    const fetchProducts = async () => {
      if (!userlogindetails) return;

      const productsCollection = collection(db, 'products');
      const productsQuery = query(productsCollection, where('TrainerID', '==', userlogindetails.UserId));
      const productSnapshot = await getDocs(productsQuery);
      const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productList);
      setFilteredProducts(productList); // Initialize filteredProducts
    };

    fetchProducts();
  }, [db, userlogindetails]);

  useEffect(() => {
    // Filter products based on search query
    const results = products.filter(product =>
      product.ProductName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(results);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchQuery, products]);

  const handleAddProduct = async () => {
    setShowAddModal(false);
    setShowLoadingModal(true); // Show loading modal
    const productID = Math.floor(100 + Math.random() * 900); // Generate a random 3-digit number
    const productRef = doc(collection(db, 'products'), productID.toString());

    try {
      const productData = {
        ...newProduct,
        ProductID: productID,
        TrainerID: userlogindetails.UserId,
      };

      const productImagesUrls = await Promise.all(
        newProduct.ProductImages.map(async (file) => {
          const storageRef = ref(storage, `products/${productID}/${file.name}`);
          await uploadBytes(storageRef, file);
          return await getDownloadURL(storageRef);
        })
      );

      productData.ProductImages = productImagesUrls;

      await setDoc(productRef, productData);
      setProducts([...products, { id: productID.toString(), ...productData }]);
      
      setShowToast(true);
    } catch (error) {
      console.error('Error adding product:', error);
    }
    setShowLoadingModal(false); // Hide loading modal
  };

  const handleEditProduct = async () => {
    setShowEditModal(false);
    setShowLoadingModal(true); // Show loading modal
    const productRef = doc(db, 'products', editProduct.id);

    try {
      await updateDoc(productRef, {
        ProductName: editProduct.ProductName,
        ProductCost: editProduct.ProductCost
      });

      setProducts(products.map(product => 
        product.id === editProduct.id ? { ...product, ...editProduct } : product
      ));
      setFilteredProducts(filteredProducts.map(product => 
        product.id === editProduct.id ? { ...product, ...editProduct } : product
      ));

      setShowToast(true);
    } catch (error) {
      console.error('Error editing product:', error);
    }
    setShowLoadingModal(false); // Hide loading modal
  };

  const handleDeleteProduct = async (productId) => {
    setShowLoadingModal(true); // Show loading modal
    try {
      await deleteDoc(doc(db, 'products', productId));
      setProducts(products.filter(product => product.id !== productId));
      setFilteredProducts(filteredProducts.filter(product => product.id !== productId));
      setShowToast(true);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
    setShowLoadingModal(false); // Hide loading modal
  };

  const handleOpenAddModal = () => {
    setNewProduct({
      ProductName: '',
      ProductCost: '',
      ProductDetails: '',
      ProductImages: [],
    });
    setShowAddModal(true);
  };

  const handleOpenEditModal = (product) => {
    setEditProduct({
      id: product.id,
      ProductName: product.ProductName,
      ProductCost: product.ProductCost
    });
    setShowEditModal(true);
  };

  const handleOpenImagesModal = (images) => {
    setSelectedProductImages(images);
    setShowImagesModal(true);
  };

  const handleCloseAddModal = () => setShowAddModal(false);
  const handleCloseEditModal = () => setShowEditModal(false);
  const handleCloseImagesModal = () => setShowImagesModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditProduct({ ...editProduct, [name]: value });
  };

  const handleImagesChange = (e) => {
    setNewProduct({ ...newProduct, ProductImages: Array.from(e.target.files) });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update search query
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * rowsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - rowsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);

  return (
    <div className="container mt-4">
      <div className="mb-4">
        <Button variant="primary" onClick={handleOpenAddModal}>הוספת מוצר חדש</Button>
      </div>
      <h2 className="text-end text-info">חנות חלבונים ותוספי תזונה</h2>

      <Row className="justify-content-end mb-3">
        <Col md={4}>
          <h5 className="text-end">:חיפוש לפי שם מוצר</h5>
          <Form.Control
            className="text-end"
            placeholder="חפש לפי שם מוצר"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </Col>
      </Row>

      <div style={{ maxHeight: '400px', overflowY: 'scroll' }}>
        <table className="table table-striped mt-4 text-end">
          <thead>
            <tr>
              <th>פעולות נוספות</th>
              <th>על המוצר</th>
              <th>מחיר</th>
              <th>שם מוצר</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map(product => (
              <tr key={product.id}>
                <td>
                  <Button className="mx-1 sm" variant="warning" onClick={() => handleOpenEditModal(product)}>עריכה</Button>
                  <Button className="mx-1 sm" variant="danger" onClick={() => handleDeleteProduct(product.id)}>מחיקה</Button>
                  <Button className="mx-1 sm" variant="info" onClick={() => handleOpenImagesModal(product.ProductImages)}>תמונות מוצר</Button>
                </td>
                <td>{product.ProductDetails}</td>
                <td>{product.ProductCost}</td>
                <td>{product.ProductName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination className="justify-content-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      {/* Add Product Modal */}
      <Modal show={showAddModal} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>הוספת מוצר חדש</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formProductName">
              <Form.Label>שם מוצר *</Form.Label>
              <Form.Control
                type="text"
                placeholder="הכנס שם מוצר"
                name="ProductName"
                value={newProduct.ProductName}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formProductCost">
              <Form.Label>מחיר *</Form.Label>
              <Form.Control
                type="number"
                placeholder="הכנס מחיר מוצר"
                name="ProductCost"
                value={newProduct.ProductCost}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formProductDetails">
              <Form.Label>פרטי מוצר *</Form.Label>
              <Form.Control
                type="text"
                placeholder="הכנס פרטי מוצר"
                name="ProductDetails"
                value={newProduct.ProductDetails}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formProductImages">
              <Form.Label>תמונות מוצר *</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={handleImagesChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddModal}>סגור</Button>
          <Button variant="primary" onClick={handleAddProduct}>הוסף מוצר</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Product Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>עריכת מוצר</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formEditProductName">
              <Form.Label>שם מוצר *</Form.Label>
              <Form.Control
                type="text"
                name="ProductName"
                value={editProduct.ProductName}
                onChange={handleEditInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formEditProductCost">
              <Form.Label>מחיר *</Form.Label>
              <Form.Control
                type="number"
                name="ProductCost"
                value={editProduct.ProductCost}
                onChange={handleEditInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>סגור</Button>
          <Button variant="primary" onClick={handleEditProduct}>שמור שינויים</Button>
        </Modal.Footer>
      </Modal>

      {/* Images Modal */}
      <Modal show={showImagesModal} onHide={handleCloseImagesModal}>
        <Modal.Header closeButton>
          <Modal.Title>תמונות מוצר</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProductImages.map((url, index) => (
            <img key={index} src={url} alt={`Product ${index}`} className="img-fluid mb-2" />
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseImagesModal}>סגור</Button>
        </Modal.Footer>
      </Modal>

      {/* Toast for showing success message */}
      <Toast show={showToast} onClose={() => setShowToast(false)} className="position-fixed bottom-0 end-0 m-3">
        <Toast.Body>הפעולה בוצעה בהצלחה!</Toast.Body>
      </Toast>

      {/* Loading Modal */}
      <LoadingModal show={showLoadingModal} />
    </div>
  );
};

export default Shop;
