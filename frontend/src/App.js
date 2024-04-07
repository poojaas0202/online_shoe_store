import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { Store } from './Store';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SignupScreen from './screens/SignupScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';

import { getError } from './utils';
import axios from 'axios';
import SearchScreen from './screens/SearchScreen';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardScreen from './screens/DashboardScreen';
import AdminRoute from './components/AdminRoute';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';

import ForgetPasswordScreen from './screens/ForgetPasswordScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import logo from "./asserts/logo.png"
function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {  cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  };
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1000);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);
  return (
    <BrowserRouter>
      <div >
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <Navbar expand="lg"  className="text-center" style={{ height: "70px" , backgroundColor: "#352F44"}} variant="dark">
            {!isMobile ?
              <LinkContainer to="/" style={{ position: "absolute", left: "100px", }}>
                <img
                  src={logo}
                  width="250"
                  height="100"
                  className="d-inline-block align-top"
                  alt="React Bootstrap logo"
                  style={{color: "#fff"}}

                />
              </LinkContainer> :
              <Container fluid className="d-flex justify-content-center">
                <LinkContainer to="/">
                  <img
                    src={logo}
                    width="250"
                    height="100"
                    className="d-inline-block align-top"
                    alt="React Bootstrap logo"

                  />
                </LinkContainer>
                <Navbar.Toggle aria-controls="basic-navbar-nav" style={{
                  position: isMobile ? 'relative' : 'absolute',
                  right: isMobile ? '0' : '50px',
                }} />
              </Container>
            }




            <Navbar.Collapse id="basic-navbar-nav" style={{
              position: isMobile ? 'relative' : 'absolute',
              right: isMobile ? '0' : '100px',
            }}>
              <Nav variant="underline">

                
                {userInfo ? (
                  <NavDropdown title={userInfo.name} id="basic-nav-dropdown" style={{ fontSize: "15px", color: "#ffff", fontWeight: "bold" }}>
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>User Profile</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/orderhistory">
                      <NavDropdown.Item>Order History</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider />
                    <Link
                      className="dropdown-item"
                      to="#signout"
                      onClick={signoutHandler}

                    >
                      SIGN OUT
                    </Link>
                  </NavDropdown>
                ) : (
                  <>
                  <Link className="nav-link" to="/signin" style={{ fontSize: "15px", color: "#ffff", fontWeight: "bold" }}>
                    SIGN IN
                  </Link>
                  <Link className="nav-link" to="/signup" style={{ fontSize: "15px", color: "#ffff", fontWeight: "bold" }}>
                    REGISTER
                  </Link>
                  </>
                  
                )
                
                
                }
                
                {userInfo && userInfo.isAdmin && (
                  <NavDropdown title="ADMIN" id="admin-nav-dropdown" style={{ fontSize: "15px", color: "#ffff", fontWeight: "bold" }}>
                    <LinkContainer to="/admin/dashboard">
                      <NavDropdown.Item>Dashboard</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/products">
                      <NavDropdown.Item>Products</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/orders">
                      <NavDropdown.Item>Orders</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/users">
                      <NavDropdown.Item>Users</NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>
                )}
                <Link to="/cart" className="nav-link" style={{ fontSize: "15px", color: "#ffff", fontWeight: "bold" }}>
                  CART
                  {cart.cartItems.length > 0 && (
                    <Badge pill bg="danger">
                      {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </Badge>
                  )}
                </Link>
                {/* <Link to="/cart" className="nav-link" style={{ fontSize: "15px", color: "#ffff", fontWeight: "bold" }}>
                  CONTACT US
                  
                </Link> */}
              </Nav>
            </Navbar.Collapse>

          </Navbar>

        </header>
        <div
          className={
            sidebarIsOpen
              ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
              : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
          }
        >
          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item>
              <strong>Categories</strong>
            </Nav.Item>
            {categories.map((category) => (
              <Nav.Item key={category}>
                <LinkContainer
                  to={{ pathname: '/search', search: `category=${category}` }}
                  onClick={() => setSidebarIsOpen(false)}
                >
                  <Nav.Link>{category}</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Nav>
        </div>
        <main>
          <div className="" style={{maxWidth: "-webkit-fill-available"}}>
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route
                path="/forget-password"
                element={<ForgetPasswordScreen />}
              />
              <Route
                path="/reset-password/:token"
                element={<ResetPasswordScreen />}
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileScreen />
                  </ProtectedRoute>
                }
              />
              
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoute>
                    <OrderScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/orderhistory"
                element={
                  <ProtectedRoute>
                    <OrderHistoryScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/shipping"
                element={<ShippingAddressScreen />}
              ></Route>
              <Route path="/payment" element={<PaymentMethodScreen />}></Route>
              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <DashboardScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <OrderListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <UserListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <ProductListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/product/:id"
                element={
                  <AdminRoute>
                    <ProductEditScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/user/:id"
                element={
                  <AdminRoute>
                    <UserEditScreen />
                  </AdminRoute>
                }
              ></Route>

              <Route path="/" element={<HomeScreen />} />
            </Routes>
          </div>
        </main>
        <footer style={{ backgroundColor: '#f8f9fa', padding: '20px', marginTop: '20px' }}>
          <div style={{ textAlign: 'center', color: '#343a40' }}>
            <p>&copy; 2024 Miami Shoe Mart. All rights reserved.</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
              <li style={{ display: 'inline', margin: '0 10px' }}>
                <a href="/privacy-policy" style={{ color: '#343a40', textDecoration: 'none' }}>
                  Privacy Policy
                </a>
              </li>
              <li style={{ display: 'inline', margin: '0 10px' }}>
                <a href="/terms-of-service" style={{ color: '#343a40', textDecoration: 'none' }}>
                  Terms of Service
                </a>
              </li>
              <li style={{ display: 'inline', margin: '0 10px' }}>
                <a href="/contact-us" style={{ color: '#343a40', textDecoration: 'none' }}>
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <a
              href="https://twitter.com/miamishoemart"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#343a40', margin: '0 10px' }}
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="https://www.facebook.com/miamishoemart"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#343a40', margin: '0 10px' }}
            >
              <i className="fab fa-facebook"></i>
            </a>
            <a
              href="https://www.instagram.com/miamishoemart"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#343a40', margin: '0 10px' }}
            >
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </footer>

      </div>
    </BrowserRouter >
  );
}

export default App;
