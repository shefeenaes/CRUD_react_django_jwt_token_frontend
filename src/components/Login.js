import './Login.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ShowProducts from './ShowProducts';
import AddProduct from './AddProduct';
import 'react-toastify/dist/ReactToastify.css';

// Set default axios configuration for CSRF protection and cross-site credentials
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

// Create an axios instance with base URL
const client = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

function Login() {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [currentUser, setCurrentUser] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [user, setUser] = useState('');
  const [reloadProduct, setReloadProduct] = useState(false);

  function reloadHandler() {
    setShowAddProduct(false);
    setReloadProduct(!reloadProduct);
  }

  function reloadHandlerShow() {
    console.log(' in reloadHandlerShow');
    setReloadProduct(!reloadProduct);
  }

  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');

    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
      checkCurrentUser(storedAccessToken, storedRefreshToken);
    }

    const tokenRefreshTimer = setInterval(() => {
      if (storedAccessToken) {
        refreshAccessToken(storedAccessToken, storedRefreshToken);
      }
    }, 2 * 60 * 1000); // Refresh token every 2 minutes

    return () => {
      clearInterval(tokenRefreshTimer); // Clear the timer when component unmounts
    };
  }, []);

  useEffect(() => {
    console.log(' in useEffect');
  }, [reloadProduct]);

  // Function to check if the user is logged in
  function checkCurrentUser(token, refresh) {
    try {
      client
        .get('/api/profile/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(function (res) {
          setUser(res.data.user.username);
          setCurrentUser(true);
        })
        .catch(function (error) {
          console.log('Error in catch of checkCurrentUser:', error);
          setCurrentUser(false);
        });
    } catch (error) {
      console.error('Error in checkCurrentUser:', error);
      setCurrentUser(false);
    }
  }

  // Function to store access and refresh tokens in local storage
  function storeTokens(token, refresh) {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('refreshToken', refresh);
  }

  // Function to refresh the access token
  function refreshAccessToken(token, refresh) {
    try {
      client
        .post(
          '/api/token/refresh/',
          {
            refresh: refresh,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(function (res) {
          const { access } = res.data;
          setAccessToken(access);
          localStorage.setItem('accessToken', access);
        })
        .catch(function (err) {
          console.log('Error in refresh token:', err);
        });
    } catch (error) {
      console.error('Error in refreshAccessToken:', error);
    }
  }

  // Function to handle login form submission
  function submitLogin(e) {
    e.preventDefault();
    try {
      client
        .post('/api/token/', {
          username: username,
          password: password,
        })
        .then(function (res) {
          const { access, refresh } = res.data;
          setRefreshToken(refresh);
          setAccessToken(access);
          storeTokens(access, refresh);
          setCurrentUser(true);
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (error) {
      console.error('Error in submitLogin:', error);
    }
  }

  // Function to handle logout
  function submitLogout(e) {
    e.preventDefault();
    try {
      client
        .post(
          '/api/logout/',
          null,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then(function (res) {
          setCurrentUser(false);
          setAccessToken('');
          localStorage.removeItem('accessToken');
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (error) {
      console.error('Error in submitLogout:', error);
    }
  }

  // Function to go back to home view
  function goToHome(e) {
    setCurrentUser(true);
    setShowAddProduct(false);
  }

  // Function to load add product view
  function loadAddProduct(e) {
    e.preventDefault();

    setCurrentUser(true);
    setShowAddProduct(true);
  }

  // Render component based on user authentication status
  if (currentUser) {
    return (
      <div>
        <Navbar bg="dark" variant="dark">
          <Container>
            <Navbar.Brand>Product Admin App</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text>{user}</Navbar.Text>
              <Navbar.Text>
                <form onSubmit={(e) => goToHome(e)}>
                  <Button type="submit" variant="light" className="navbar-button">
                    Home
                  </Button>
                </form>
              </Navbar.Text>
              <Navbar.Text>
                <form onSubmit={(e) => loadAddProduct(e)}>
                  <Button type="submit" variant="light" className="navbar-button">
                    Add New Product
                  </Button>
                </form>
              </Navbar.Text>
              <Navbar.Text>
                <form onSubmit={(e) => submitLogout(e)}>
                  <Button type="submit" variant="light" className="navbar-button">
                    Log out
                  </Button>
                </form>
              </Navbar.Text>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        {showAddProduct ? <AddProduct reloadHandler={reloadHandler} /> : <ShowProducts reloadHandlerShow={reloadHandlerShow} />}
      </div>
    );
  }

  // Render login form if user is not authenticated
  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>Product Admin App</Navbar.Brand>
          <Navbar.Toggle />
        </Container>
      </Navbar>

      <div className="center">
        <Form onSubmit={(e) => submitLogin(e)} className="login-form">
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>User Name</Form.Label>
            <Form.Control type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <Form.Text className="text-muted"></Form.Text>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default Login;
