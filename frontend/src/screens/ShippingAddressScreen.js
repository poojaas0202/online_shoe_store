import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import CheckoutSteps from '../components/CheckoutSteps';
import Delivery from "../asserts/delivery.jpg"
export default function ShippingAddressScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    fullBox,
    userInfo,
    cart: { shippingAddress },
  } = state;

  const [fullName, setFullName] = useState(shippingAddress.fullName || '');
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin?redirect=/shipping');
    }
  }, [userInfo, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: {
        fullName,
        address,
        city,
        postalCode,
        country,
        location: shippingAddress.location,
      },
    });
    localStorage.setItem(
      'shippingAddress',
      JSON.stringify({
        fullName,
        address,
        city,
        postalCode,
        country,
        location: shippingAddress.location,
      })
    );
    navigate('/payment');
  };

  useEffect(() => {
    ctxDispatch({ type: 'SET_FULLBOX_OFF' });
  }, [ctxDispatch, fullBox]);

  return (
    <div>
      <Helmet>
        <title>Address</title>
      </Helmet>

      <div className="container">
        
        <div className="row" style={{alignItems: "center"}}>
          {/* Left Side: Image */}
          <div className="col-md-6 mb-3">
            {/* Replace 'image-source.jpg' with the actual source of your image */}
            <img
              src={Delivery}
              alt="Shipping Address"
              className="img-fluid"
            />
          </div>

          {/* Right Side: Form Content */}
          <div className="col-md-6">
            <Form onSubmit={submitHandler}>
            <h3 className="my-3" style={{textAlign: "center"}}>Delivery Address</h3>
              <Form.Group className="mb-3" controlId="fullName">
                <Form.Label>Full Name</Form.Label>
                <Form.Control value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </Form.Group>
              <Form.Group className="mb-3" controlId="address">
                <Form.Label>Address</Form.Label>
                <Form.Control value={address} onChange={(e) => setAddress(e.target.value)} required />
              </Form.Group>
              <Form.Group className="mb-3" controlId="city">
                <Form.Label>City</Form.Label>
                <Form.Control value={city} onChange={(e) => setCity(e.target.value)} required />
              </Form.Group>
              <Form.Group className="mb-3" controlId="postalCode">
                <Form.Label>Postal Code</Form.Label>
                <Form.Control value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
              </Form.Group>
              <Form.Group className="mb-3" controlId="country">
                <Form.Label>Country</Form.Label>
                <Form.Control value={country} onChange={(e) => setCountry(e.target.value)} required />
              </Form.Group>

              {/* <div className="mb-3">
                <Button
                  id="chooseOnMap"
                  type="button"
                  variant="light"
                  onClick={() => navigate('/map')}
                >
                  Choose Location On Map
                </Button>
                {shippingAddress.location && shippingAddress.location.lat ? (
                  <div>
                    LAT: {shippingAddress.location.lat} LNG:{shippingAddress.location.lng}
                  </div>
                ) : (
                  <div>No location</div>
                )}
              </div> */}

              <div className="mb-3" style={{textAlign: "center"}}>
                <Button variant="primary" type="submit" style={{backgroundColor: "#B9B4C7"}}>
                  Continue
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
