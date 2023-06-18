import axios from 'axios';
import React, { useState, useEffect } from 'react';
import DataTable from './DataTable';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddProduct from './AddProduct';

const ShowProducts = () => {
  const [Products, setProducts] = useState([]);
  const [isAdd, setAddComponent] = useState(false);

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

  const addProduct = () => {
    setAddComponent(!isAdd)
  }
  const handleValueChange = (value) => {
    setAddComponent(value);
  };
  if(isAdd){
  return (
    <div>
       <AddProduct onValueChange={handleValueChange}/>
       <ToastContainer />
    </div>
  );
};
return (
  <div>
     <button onClick={addProduct}>Add new Product</button>
   
    <DataTable data={Products} />
    <ToastContainer />
  </div>
);
};

export default ShowProducts;
