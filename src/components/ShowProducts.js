import axios from 'axios';
import React, { useState, useEffect } from 'react';
import DataTable from './DataTable';


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
      <h1>Product List</h1><button>Add new Product</button>
      <DataTable data={Products} />
    </div>
  );
};

export default ShowProducts;
