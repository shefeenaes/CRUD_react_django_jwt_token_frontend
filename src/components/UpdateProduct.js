import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

class Update extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        onValueChange: '',
    };
    this.valueFromParent = props.valueFromParent;
    
    this.state = {
      name: '',
      description: '',
      price: '',
      stock: '',
      image: '',
    };
    this.changeHandler = this.changeHandler.bind(this);
    this.submitForm = this.submitForm.bind(this);
    
    this.props.onValueChange(true);
    console.log("constructor")
  }

  // Input Change Handler
  changeHandler(event) {
    const { name, value } = event.target;

    if (name === 'price' || name === 'stock') {
      // Allow only numbers in the "price" and "stock" inputs
      const regex = /^[0-9\b]+$/;
      if (value === '' || regex.test(value)) {
        this.setState({
          [name]: value
        });
      }
    } else {
      this.setState({
        [name]: value
      });
    }
  }

  // Submit Form
  submitForm() {
    const id = this.valueFromParent;
    const storedAccessToken = localStorage.getItem('accessToken');
    const accessToken = storedAccessToken;
    console.log('accessToken-->', accessToken);
    console.log('data-->', JSON.stringify(this.state));

    // Validation logic
    if (!this.state.name || !this.state.description || !this.state.price || !this.state.stock) {
      toast.error('Please fill out all the required fields!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
      return; // Stop form submission if validation fails
    }

    try {
      fetch(`http://127.0.0.1:8000/api/updateProduct/${id}/`, {
        method: 'PUT',
        body: JSON.stringify(this.state),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          'Authorization': `Bearer ${accessToken}`
        },
      })
        .then(response => response.json(), toast.success('Product updated successfully!', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        }))
        .then((data) => console.log(data));

    } catch (error) {
      console.error(error);
      toast.error('An unexpected error occurred', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    }
    
  }

  fetchData = async () => {
    const id = this.valueFromParent;

    const storedAccessToken = localStorage.getItem('accessToken');
    const accessToken = storedAccessToken;
    const config = {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    };
    try {
      const response = await axios.get(`http://localhost:8000/api/showProduct/${id}/`, config);
      const parsedData = response.data;
      console.log(parsedData);
      this.setState({
        name: parsedData.name,
        description: parsedData.description,
        stock: parsedData.stock,
        price: parsedData.price,
        childValue: true 
      });
      
    } catch (error) {
      console.error(error);
    }
    
  }

  componentDidMount() {
    this.fetchData();
    
  }

  render() {
    return (
      <table className="table table-bordered">
        <tbody>
          <tr>
            <th>Name</th>
            <td>
              <input
                value={this.state.name}
                name="name"
                onChange={this.changeHandler}
                type="text"
                className="form-control"
                required // Added "required" attribute
              />
            </td>
          </tr>
          <tr>
            <th>Description</th>
            <td>
              <input
                value={this.state.description}
                name="description"
                onChange={this.changeHandler}
                type="text"
                className="form-control"
                required // Added "required" attribute
              />
            </td>
          </tr>
          <tr>
            <th>Price</th>
            <td>
              <input
                value={this.state.price}
                name="price"
                onChange={this.changeHandler}
                type="text"
                className="form-control"
                pattern="[0-9]*" // Added "pattern" attribute to restrict input to numbers only
                required // Added "required" attribute
              />
            </td>
          </tr>
          <tr>
            <th>Stock</th>
            <td>
              <input
                value={this.state.stock}
                name="stock"
                onChange={this.changeHandler}
                type="text"
                className="form-control"
                pattern="[0-9]*" // Added "pattern" attribute to restrict input to numbers only
                required // Added "required" attribute
              />
            </td>
          </tr>
          <tr>
            <td colSpan="2">
              <input type="submit" onClick={this.submitForm} className="btn btn-dark" />
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

export default Update;
