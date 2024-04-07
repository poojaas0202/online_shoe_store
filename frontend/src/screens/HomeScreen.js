import { useEffect, useReducer } from "react";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Product from "../components/Product";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import SearchBox from "../components/SearchBox";
import Carousel from "react-bootstrap/Carousel"; // Added Carousel import
import "bootstrap/dist/css/bootstrap.min.css"; // Added Bootstrap CSS import
import car_1 from "../asserts/caar1.png";
import car_2 from "../asserts/caar2.png";
import car_3 from "../asserts/caar3.png";
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, products: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function HomeScreen() {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get("/api/products");
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Helmet>
        <title>MIAMI SHOE MART</title>
      </Helmet>
      <Carousel>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src={car_1} // Replace with your actual image property
        

          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={car_2} // Replace with your actual image property

          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={car_3} // Replace with your actual image property

          />
        </Carousel.Item>
      </Carousel>
      <div style={{
        paddingRight: "74px",
        paddingLeft: "70px",
        paddingTop: "70px",
        display: "flex",
        justifyContent: "space-between",
        width: "-webkit-fill-available",
        flexDirection: "row",
        alignItems: "center"
      }}>
        <h3>POPULAR ITEMS</h3>
        <SearchBox />

      </div>
      <div className="products">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            <Row style={{width: "-webkit-fill-available", paddingLeft: "50px"}}>
              {products.map((product) => (
                <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3" >
                  <Product product={product}></Product>
                </Col>
              ))}
            </Row>
          </>
        )}
      </div>
    </div>
  );
}

export default HomeScreen;
