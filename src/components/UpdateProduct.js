import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Update = (props) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image: '',
  });

  const { valueFromParent } = props;

  const changeHandler = (event) => {
    const { name, value } = event.target;

    if (name === 'price' || name === 'stock') {
      // Allow only numbers in the "price" and "stock" inputs
      const regex = /^[0-9\b]+$/;
      if (value === '' || regex.test(value)) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const submitForm = () => {
    const id = valueFromParent;
    const storedAccessToken = localStorage.getItem('accessToken');
    const accessToken = storedAccessToken;

    // Validation logic
    if (!formData.name || !formData.description || !formData.price || !formData.stock) {
      toast.error('Please fill out all the required fields!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
      return; // Stop form submission if validation fails
    }

    try {
      axios
        .put(`http://127.0.0.1:8000/api/updateProduct/${id}/`, formData, {
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          toast.success('Product updated successfully!', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
          });
          console.log(response.data);
        });
    } catch (error) {
      console.error(error);
      toast.error('An unexpected error occurred', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const id = valueFromParent;
      const storedAccessToken = localStorage.getItem('accessToken');
      const accessToken = storedAccessToken;
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      try {
        const response = await axios.get(`http://localhost:8000/api/showProduct/${id}/`, config);
        const parsedData = response.data;
        console.log(parsedData);
        setFormData({
          name: parsedData.name,
          description: parsedData.description,
          stock: parsedData.stock,
          price: parsedData.price,
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [valueFromParent]);

  return (
    <table className="table table-bordered">
      <tbody>
        <tr>
          <th>Name</th>
          <td>
            <input
              value={formData.name}
              name="name"
              onChange={changeHandler}
              type="text"
              className="form-control"
              required
            />
          </td>
        </tr>
        <tr>
          <th>Description</th>
          <td>
            <input
              value={formData.description}
              name="description"
              onChange={changeHandler}
              type="text"
              className="form-control"
              required
            />
          </td>
        </tr>
        <tr>
          <th>Price</th>
          <td>
            <input
              value={formData.price}
              name="price"
              onChange={changeHandler}
              type="text"
              className="form-control"
              pattern="[0-9]*"
              required
            />
          </td>
        </tr>
        <tr>
          <th>Stock</th>
          <td>
            <input
              value={formData.stock}
              name="stock"
              onChange={changeHandler}
              type="text"
              className="form-control"
              pattern="[0-9]*"
              required
            />
          </td>
        </tr>
        <tr>
          <td colSpan="2">
            <input type="submit" onClick={submitForm} className="btn btn-dark" />
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default Update;
