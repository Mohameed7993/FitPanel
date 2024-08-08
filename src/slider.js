import Slider from 'react-slick';
import { Card } from "react-bootstrap";


const ProductSlider = ({ products }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000
  };

  return (
    <Slider {...settings}>
      {products.map((product, index) => (
        <div key={index} style={{ textAlign: 'center' }}>
          {product.ProductImages && product.ProductImages.length > 0 && (
            <Card.Img
              src={product.ProductImages[0]} 
              alt={`Product Image ${index + 1}`}
              style={{ height: '250px',  }}
            />
          )}
          <div style={{ marginTop: '10px' }}>
            <h5>{product.ProductName}</h5>
            <p>Price: ₪{product.ProductCost}</p>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default ProductSlider;
