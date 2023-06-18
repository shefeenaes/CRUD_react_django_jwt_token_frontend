import axios from 'axios';
import React, { useState, useEffect } from 'react';
import DataTable from './DataTable';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
/* test */

const ShowProducts = () => {
  const [Products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const storedAccessToken = localStorage.getItem('accessToken');
    const accessToken = storedAccessToken;

    const config = {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    };

    try {
      const response = await axios.get('http://localhost:8000/api/showAllProducts/', config);
      const parsedData = response.data;
      setProducts(parsedData);
      console.log(parsedData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);


 
return (
  <div>
  
   
    <DataTable data={Products} />
    <ToastContainer />
  </div>
);
};

export default ShowProducts;
