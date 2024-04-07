import axios from 'axios';
import { useContext, useEffect, useReducer, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Rating from '../components/Rating';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import { Store } from '../Store';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { toast } from 'react-toastify';

const reducer = (state, action) => {
  switch (action.type) {
    case 'REFRESH_PRODUCT':
      return { ...state, product: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreateReview: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreateReview: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreateReview: false };
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function ProductScreen() {
  let reviewsRef = useRef();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;

  const [{ loading, error, product, loadingCreateReview }, dispatch] =
    useReducer(reducer, {
      product: [],
      loading: true,
      error: '',
    });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const [selectedSize, setSelectedSize] = useState('');
  const { cart, userInfo } = state;
  const addToCartHandler = async () => {
    if (!selectedSize || !selectedColor) {
      toast.error('Please select a size and Color' );
      return;
    }

    const selectedSizeQuantity = product.stock[selectedSize];

    if (selectedSizeQuantity <= 0) {
      toast.error('Selected size is out of stock');
      return;
    }

    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, size: selectedSize,color: selectedColor, quantity },
    });
    navigate('/cart');
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment || !rating) {
      toast.error('Please enter comment and rating');
      return;
    }
    try {
      const { data } = await axios.post(
        `/api/products/${product._id}/reviews`,
        { rating, comment, name: userInfo.name },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({
        type: 'CREATE_SUCCESS',
      });
      toast.success('Review submitted successfully');
      product.reviews.unshift(data.review);
      product.numReviews = data.numReviews;
      product.rating = data.rating;
      dispatch({ type: 'REFRESH_PRODUCT', payload: product });
      window.scrollTo({
        behavior: 'smooth',
        top: reviewsRef.current.offsetTop,
      });
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: 'CREATE_FAIL' });
    }
  };

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Card>
        <Row>
          <Col md={6} className="text-center">
            <img
              style={{ width: '100%', maxWidth: '600px', height: 'auto' }}
              src={selectedImage || product.image}
              alt={product.name}
            />
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row xs={1} md={2} className="g-2">
                  {[product.image, ...product.images].map((x) => (
                    <Col key={x}>
                      <Card>
                        <Button
                          className="thumbnail"
                          type="button"
                          variant="light"
                          onClick={() => setSelectedImage(x)}
                        >
                          <Card.Img
                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                            variant="top"
                            src={x}
                            alt="product"
                          />
                        </Button>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Col>

          <Col md={6}>
            <Card.Body>
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
              <h1>{product.name}</h1>
              <Rating rating={product.rating} numReviews={product.numReviews}></Rating>
              <ListGroup variant="flush">
                <ListGroup.Item>Price: ₹{product.price}</ListGroup.Item>
                <ListGroup.Item>Description: {product.description}</ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>₹{product.price}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>gender: {product.gender}</ListGroup.Item>
                <ListGroup.Item>
                  <Form.Label>Select Size:</Form.Label>
                  <div className="d-flex flex-wrap">
                    {Object.entries(product.stock)
                      .filter(([size, availability]) => typeof availability === 'number')
                      .map(([size, availability]) => (
                        <Button
                          key={size}
                          variant={selectedSize === size ? 'primary' : 'light'}
                          onClick={() => setSelectedSize(size)}
                          disabled={availability <= 0}
                          style={{ marginRight: '10px', marginBottom: '10px' }}
                        >
                          {size}
                        </Button>
                      ))}
                  </div>
                </ListGroup.Item>




               







                <ListGroup.Item>
                  <Form.Label>Select Color:</Form.Label>
                  <div className="d-flex flex-wrap">
                    {product.colors && product.colors.length > 0 ? (
                      <Form.Select
                        value={selectedColor}
                        onChange={(e) => setSelectedColor(e.target.value)}
                        aria-label="Select Color"
                      >
                        <option value="">Select...</option>
                        {product.colors.map((color) => (
                          <option key={color.name} value={color.name}>
                            {color.name}
                          </option>
                        ))}
                      </Form.Select>
                    ) : (
                      <MessageBox>No available colors</MessageBox>
                    )}
                  </div>
                </ListGroup.Item>






                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? (
                        <Badge bg="success">In Stock</Badge>
                      ) : (
                        <Badge bg="danger">Unavailable</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button onClick={addToCartHandler} style={{backgroundColor: "#B9B4C7"}}>
                        Add to Cart
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Col>
        </Row>
      </Card>

      <div className="my-3" style={{ maxWidth: '800px', margin: 'auto' }}>
        <h2 ref={reviewsRef} className="text-center mb-4">Customer Reviews</h2>
        <div className="mb-3" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          {product.reviews.length === 0 && (
            <MessageBox variant="info">There are no reviews yet.</MessageBox>
          )}
          <ListGroup variant="flush">
            {product.reviews.map((review) => (
              <ListGroup.Item key={review._id} className="border-bottom">
                <div className="mb-2">
                  <strong>{review.name}</strong>
                  <Rating rating={review.rating} caption=" "></Rating>
                </div>
                <p className="text-muted mb-1">{review.createdAt.substring(0, 10)}</p>
                <p className="mb-0">{review.comment}</p>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
        {!userInfo || (userInfo && !product.reviews.some((review) => review.name === userInfo.name)) && (
          <ListGroup variant="flush">
            <ListGroup.Item style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <h2 className="text-center mb-4">Write a Customer Review</h2>
              {userInfo ? (
                <Form onSubmit={submitHandler} style={{ width: '100%' }}>
                  <Form.Group controlId="rating" className="mb-3">
                    <Form.Label>Rating</Form.Label>
                    <FloatingLabel controlId="rating" label="Rating">
                      <Form.Select
                        aria-label="Select Rating"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                      >
                        <option value="0">Select...</option>
                        <option value="1">1 - Poor</option>
                        <option value="2">2 - Fair</option>
                        <option value="3">3 - Good</option>
                        <option value="4">4 - Very Good</option>
                        <option value="5">5 - Excellent</option>
                      </Form.Select>
                    </FloatingLabel>
                  </Form.Group>
                  <Form.Group controlId="comment" className="mb-3">
                    <Form.Label>Comment</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loadingCreateReview}
                    className="w-100"
                  >
                    {loadingCreateReview ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </Form>
              ) : (
                <MessageBox>
                  Please <Link to="/signin">Sign In</Link> to write a review
                </MessageBox>
              )}
            </ListGroup.Item>
          </ListGroup>
        )}
      </div>


    </div>
  );
}

export default ProductScreen;
