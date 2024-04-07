import React from 'react';
import { useContext } from 'react';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import MessageBox from '../components/MessageBox';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cart_img from "../asserts/4.jpg"
export default function CartScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`https://online-shoe-store-server.vercel.app/api/products/${item._id}`);
    const selectedSizeQuantity = data.stock[item.size] || 0;

    if (selectedSizeQuantity < quantity) {
      window.alert(`Sorry. Only ${selectedSizeQuantity} units available in the selected size.`);
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };

  const removeItemHandler = (item) => {
    ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };

  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping');
  };

  return (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      
      <Row>
        <Col md={12} lg={6}>
          <Image
            src={Cart_img}
            alt="Sample Image"
            fluid  // Ensure this prop is passed down to the underlying img element
          />
        </Col>


        <Col md={12} lg={6}>
        <h3 style={{textAlign: "center"}}>Basket</h3>
          {cartItems.length === 0 ? (
            <MessageBox>
              Cart is empty. <Link to="/">Go Shopping</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row className="align-items-center">
                    <Col xs={12} lg={6} className="text-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="img-fluid rounded img-thumbnail"
                      />
                    </Col>
                    <Col xs={12} lg={6}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <p style={{ margin: 0, marginRight: "5px", flexBasis: "30%" }}>Name:</p>
                          <Link to={`/product/${item.slug}`} style={{ flexBasis: "70%" }}>{item.name}</Link>
                        </div>
                        
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <p style={{ margin: 0, marginRight: "5px", flexBasis: "30%" }}>Size:</p>
                          <p style={{ color: '#777', margin: 0, flexBasis: "70%" }}>{item.size}</p>
                        </div>
                        <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
                          <p style={{ margin: 0, flexBasis: "30%" }}>Count:</p>
                          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                              <Button
                                onClick={() => updateCartHandler(item, item.quantity - 1)}
                                variant="light"
                                disabled={item.quantity === 1}
                              >
                                <i className="fas fa-minus-circle"></i>
                              </Button>
                              <span style={{ flexBasis: "30%", margin: "0 10px" }}>{item.quantity}</span>
                              <Button
                                variant="light"
                                onClick={() => updateCartHandler(item, item.quantity + 1)}
                                disabled={item.quantity === item.countInStock}
                              >
                                <i className="fas fa-plus-circle"></i>
                              </Button>
                            </div>


                          </div>

                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                          <span style={{ flexBasis: "40%", marginRight: "10px" }}>Price:</span>
                          <span style={{ flexBasis: "90%" }}>₹{item.price}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                          <span style={{ flexBasis: "40%", marginRight: "10px" }}>Color:</span>
                          <span style={{ flexBasis: "90%" }}>{item.color}</span>
                        </div>



                        <Button
                        onClick={() => removeItemHandler(item)}
                        variant="light"
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                      </div>
                     
                    </Col>



                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}

          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>
                    Total ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                    items) : ₹
                    {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      
                      onClick={checkoutHandler}
                      disabled={cartItems.length === 0}
                      style={{backgroundColor: "#B9B4C7"}}
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

      </Row>
    </div>
  );
}
