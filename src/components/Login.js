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
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

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
  const [grandparentValue, setGrandparentValue] = useState('');

  const handleValueChange = (value) => {
    setGrandparentValue(value);

    setShowAddProduct(grandparentValue);
    setCurrentUser(true);
    console.log('grandparentValue-->' + grandparentValue);
  };

  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');

    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
      checkCurrentUser(storedAccessToken, storedRefreshToken);
    }
  }, []);

  function checkCurrentUser(token, refresh) {
    client
      .get('/api/profile/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (res) {
        setCurrentUser(true);
      })
      .catch(function (error) {
        console.log('Error in catch of checkCurrentUser:', error);

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
            setCurrentUser(true);
            const { access } = res.data;
            setAccessToken(access);
            localStorage.setItem('accessToken', access);
          })
          .catch(function (err) {
            console.log('Error in catch of refresh token:', err);
          });

        setCurrentUser(false);
      });
  }

  function storeTokens(token, refresh) {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('refreshToken', refresh);
  }

  function submitLogin(e) {
    e.preventDefault();
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
  }

  function submitLogout(e) {
    e.preventDefault();
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
  }

  function goToHome(e) {
    e.preventDefault();
    setCurrentUser(true);
    setShowAddProduct(false);

    console.log('showAddProduct+goToHome-->', showAddProduct);
  }
  function loadAddProduct(e) {
    e.preventDefault();

    setCurrentUser(true);
    setShowAddProduct(true);

    console.log('showAddProduct+loadAddProduct-->', showAddProduct);
  }

  if (currentUser) {
    return (
      <div>
        <Navbar bg="dark" variant="dark">
          <Container>
            <Navbar.Brand>Product Admin App</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text>
                <form onSubmit={(e) => goToHome(e)}>
                  <Button type="submit" variant="light" className="navbar-button">Home</Button>
                </form>
              </Navbar.Text>
              <Navbar.Text>
                <form onSubmit={(e) => loadAddProduct(e)}>
                  <Button type="submit" variant="light" className="navbar-button">Add New Product</Button>
                </form>
              </Navbar.Text>
              <Navbar.Text>
                <form onSubmit={(e) => submitLogout(e)}>
                  <Button type="submit" variant="light" className="navbar-button">Log out</Button>
                </form>
              </Navbar.Text>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        {showAddProduct ? <AddProduct /> : <ShowProducts onValueChange={handleValueChange} />}
      </div>
    );
  }

  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>Product Admin App</Navbar.Brand>
          <Navbar.Toggle />
        </Container>
      </Navbar>

      <div className="center">
        <Form onSubmit={(e) => submitLogin(e)}>
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
