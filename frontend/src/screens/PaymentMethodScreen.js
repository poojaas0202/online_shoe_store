import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import CheckoutSteps from '../components/CheckoutSteps';
import PAyment_info_img from "../asserts/2.png"
import { Store } from '../Store';

export default function PaymentMethodScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;

  const [paymentMethodName, setPaymentMethod] = useState(
    paymentMethod || 'PayPal'
  );

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
    localStorage.setItem('paymentMethod', paymentMethodName);
    navigate('/placeorder');
  };

  return (
    <div>
      <Helmet>
        <title>Payment Method</title>
      </Helmet>

      <div className="container">
        
        <div className="row">
          {/* Left Side: Image */}
          <div className="col-md-6 mb-3">
            <Image
              src={PAyment_info_img}
              alt="Sample Image"
              fluid  // Ensure this prop is passed down to the underlying img element
            />
          </div>
          {/* Right Side: Payment Methods */}
          <div className="col-md-6">
            <Form onSubmit={submitHandler} >
            {/* <h3 className="my-3" style={{textAlign: "center"}}>Payment Method</h3>
              <div className="mb-3" style={{padding:"2%"}}>
                <Form.Check
                  type="radio"
                  id="PayPal"
                  label="PayPal"
                  value="PayPal"
                  checked={paymentMethodName === 'PayPal'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
              </div> */}
              <div className="mb-3" style={{padding:"2%"}}>
                <Form.Check
                  type="radio"
                  id="Razorpay"
                  label="Razorpay"
                  value="Razorpay"
                  checked={paymentMethodName === 'Razorpay'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
              </div>
              <div className="mb-3" style={{textAlign: "center"}}>
                <Button type="submit" style={{backgroundColor: "#B9B4C7"}}>Continue</Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
