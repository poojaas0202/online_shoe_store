import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import Rating from './Rating';

const truncateDescription = (description, maxLength) => {
  if (description.length > maxLength) {
    return description.substring(0, maxLength) + '...';
  }
  return description;
};

const productCardStyle = {
  width: '14rem',
  margin: '1rem',
  backgroundColor: '#f8f9fa',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
};

const productContentStyle = {
  padding: '0.8rem',
};

const productTitleStyle = {
  color: '#343a40',
  textDecoration: 'none',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  marginBottom: '0.5rem',
};

const productLabelStyle = {
  fontSize: '0.9rem',
  marginBottom: '0.2rem',
  color: '#6c757d',
};

const productValueStyle = {
  fontSize: '0.9rem',
  marginBottom: '0.5rem',
  color: '#6c757d',
};

const productDescriptionStyle = {
  fontSize: '0.9rem',
  marginBottom: '0.5rem',
  color: '#6c757d',
};

const productPriceStyle = {
  fontSize: '1rem',
  fontWeight: 'bold',
};

function Product(props) {
  const { product } = props;

  return (
    <Card style={productCardStyle}>
      <Link to={`/product/${product.slug}`}>
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '8px 8px 0 0' }}>
          <img
            src={product.image}
            className="card-img-top"
            alt={product.name}
            style={{
              width: '100%', // Ensure the image takes 100% of the container width
              height: '150px', // Set the fixed height as per your requirement
              objectFit: 'cover', // Ensure the image covers the container while maintaining aspect ratio
            }}
          />
        </div>
      </Link>
      <Card.Body style={productContentStyle}>
        <Link to={`/product/${product.slug}`}>
          <Card.Title style={productTitleStyle}>{product.name}</Card.Title>
        </Link>
        <div>
          <span style={productValueStyle}>
            <Rating rating={product.rating} numReviews={product.numReviews} />
          </span>
        </div>
        <div>
          <span style={productLabelStyle}>Description:</span>
          <span style={productValueStyle}>
            {truncateDescription(product.description, 50)}
          </span>
        </div>
        <div>
          <span style={productLabelStyle}>Price:</span>
          <span style={productPriceStyle}>₹{product.price}</span>
        </div>
      </Card.Body>
    </Card>
  );
}

export default Product;
