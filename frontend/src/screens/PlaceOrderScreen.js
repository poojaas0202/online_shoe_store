import Axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { Store } from '../Store';
import CheckoutSteps from '../components/CheckoutSteps';
import LoadingBox from '../components/LoadingBox';
import Delivery from "../asserts/2.png"
// Reducer to manage loading state
const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    case 'CREATE_FAIL':
      return { ...state, loading: false };
    default:
      return state;
  }
};

// Main component
export default function PlaceOrderScreen() {
  const navigate = useNavigate();

  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  // Calculate order totals
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
  cart.taxPrice = round2(0.12 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  // Handle placing an order
  const placeOrderHandler = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST' });

      const { data } = await Axios.post(
        'https://online-shoe-store-server.vercel.app/api/orders',
        {
          orderItems: cart.cartItems.map((item) => ({
            ...item,
            product: item._id,
          })),
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
          lensPackages: cart.lensPackages,
          prescriptionType: cart.prescriptionType,
          coatings: cart.coatings,
          lensType: cart.lensType,
          lensPackage: cart.lensPackage,
          lensPower: cart.lensPower,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      await Promise.all(
        cart.cartItems.map(async (item) => {
          await Axios.put(`https://online-shoe-store-server.vercel.app/api/products/${item._id}/reduceStock`, {}, {
            headers: {
              authorization: `Bearer ${userInfo.token}`,
            },
          });
        })
      );

      ctxDispatch({ type: 'CART_CLEAR' });
      dispatch({ type: 'CREATE_SUCCESS' });
      localStorage.removeItem('cartItems');
      navigate(`/order/${data.order._id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(err));
    }
  };


  // Redirect to the payment page if payment method is not selected
  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart, navigate]);

  return (
    <div>
      <Helmet>
        <title>Preview Order</title>
      </Helmet>



      <Row>
        <Col md={6}>
          {/* Left side - Image */}
          <img
            src={Delivery}
            alt="Product Image"
            className="img-fluid rounded "
          />
        </Col>
        <Col md={6}>
          <h3 className="my-3">Preview Order</h3>

          <Row>
            <Col md={12}>
              <Card>

                <Card.Body>



                  <Card.Title>Order Summary</Card.Title>
                  <ListGroup variant="flush">
                    {/* Items Price */}
                    <ListGroup.Item>
                      <Row>
                        <Col>Items</Col>
                        <Col>₹{cart.itemsPrice.toFixed(2)}</Col>
                      </Row>
                    </ListGroup.Item>

                    {/* Shipping Price */}
                    <ListGroup.Item>
                      <Row>
                        <Col>Shipping</Col>
                        <Col>₹{cart.shippingPrice.toFixed(2)}</Col>
                      </Row>
                    </ListGroup.Item>

                    {/* Tax Price */}
                    <ListGroup.Item>
                      <Row>
                        <Col>Tax</Col>
                        <Col>₹{cart.taxPrice.toFixed(2)}</Col>
                      </Row>
                    </ListGroup.Item>

                    {/* Order Total */}
                    <ListGroup.Item>
                      <Row>
                        <Col>
                          <strong> Order Total</strong>
                        </Col>
                        <Col>
                          <strong>₹{cart.totalPrice.toFixed(2)}</strong>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>

                      <Card.Title>Payment</Card.Title>
                      <Card.Text>
                        <strong>Method:</strong> {cart.paymentMethod}
                      </Card.Text>
                      <hr/>
                      <Card.Title>Shipping</Card.Title>
                      <Card.Text>
                        <strong>Name:</strong> {cart.shippingAddress.fullName} <br />
                        <strong>Address: </strong> {cart.shippingAddress.address},
                        {cart.shippingAddress.city}, {cart.shippingAddress.postalCode},
                        {cart.shippingAddress.country}
                      </Card.Text>
                    </ListGroup.Item>
                    {/* Place Order Button */}
                    <ListGroup.Item>
                      <div className="d-grid">
                        <Button
                          type="button"
                          onClick={placeOrderHandler}
                          disabled={cart.cartItems.length === 0}
                          style={{color: "#B9B4C7"}}
                        >
                          Place Order
                        </Button>
                      </div>
                      {loading && <LoadingBox />}
                    </ListGroup.Item>
                  </ListGroup>



                </Card.Body>
              </Card>
            </Col>
          </Row>


          {/* Right side - Details */}
          <div style={{ overflowY: 'auto' }}>
            {/* Shipping information */}
            {/* <Card className="mb-3">
              <Card.Body>
                <Card.Title>Shipping</Card.Title>
                <Card.Text>
                  <strong>Name:</strong> {cart.shippingAddress.fullName} <br />
                  <strong>Address: </strong> {cart.shippingAddress.address},
                  {cart.shippingAddress.city}, {cart.shippingAddress.postalCode},
                  {cart.shippingAddress.country}
                </Card.Text>
                <Link to="/shipping">Edit</Link>
              </Card.Body>
            </Card> */}

            {/* Payment method */}
            {/* <Card className="mb-3">
              <Card.Body>
                <Card.Title>Payment</Card.Title>
                <Card.Text>
                  <strong>Method:</strong> {cart.paymentMethod}
                </Card.Text>
                <Link to="/payment">Edit</Link>
              </Card.Body>
            </Card> */}

            {/* Ordered items */}
            {/* <Card className="mb-3">
              <Card.Body>
                <Card.Title>Items</Card.Title>
                <ListGroup variant="flush">
                  {cart.cartItems.map((item) => (
                    <ListGroup.Item key={item._id}>
                      <Row className="align-items-center">
                        <Col md={6}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="img-fluid rounded img-thumbnail"
                          />
                          <Link to={`/product/${item.slug}`}>{item.name}</Link>
                        </Col>
                        <Col md={3}>
                          <span>{item.quantity}</span>
                        </Col>
                        <Col md={3}>₹{item.price}</Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <Link to="/cart">Edit</Link>
              </Card.Body>
            </Card> */}


          </div>
        </Col>
      </Row>

      {/* Order Summary */}

    </div>
  );
}
