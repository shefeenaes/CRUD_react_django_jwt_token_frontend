import React from 'react';


import { toast } from 'react-toastify';
class Add extends React.Component{
    constructor(){
        super();
        
        this.state = {
            name: '',
            description: '',
            price: '',
            stock: '',
            errors: {
              name: '',
              description: '',
              price: '',
              stock: ''
            }
          };
          
        this.changeHandler=this.changeHandler.bind(this);
        this.submitForm=this.submitForm.bind(this);
    }
    validateForm() {
        const { name, description, price, stock } = this.state;
        let errors = {};
      
        // Validate name
        if (!name.trim()) {
          errors.name = 'Name is required';
        }
      
        // Validate description
        if (!description.trim()) {
          errors.description = 'Description is required';
        }
      
        // Validate price
        if (!price.trim()) {
          errors.price = 'Price is required';
        } else if (isNaN(Number(price))) {
          errors.price = 'Price must be a number';
        }
      
        // Validate stock
        if (!stock.trim()) {
          errors.stock = 'Stock is required';
        } else if (isNaN(Number(stock))) {
          errors.stock = 'Stock must be a number';
        }
      
        this.setState({ errors });
      
        // Return true if there are no errors
        return Object.keys(errors).length === 0;
      }
      

    // Input Change Handler
    changeHandler(event) {
        const { name, value } = event.target;
        this.setState({
          [name]: value,
          errors: { ...this.state.errors, [name]: '' }
        });
      }
      

    // Submit Form
    submitForm(e) {
        e.preventDefault();
      
        if (!this.validateForm()) {
          // Form validation failed
          return;
        }
      
        // Form validation successful, continue with form submission
        const storedAccessToken = localStorage.getItem('accessToken');
        const accessToken = storedAccessToken;
        console.log('accessToken-->', accessToken);
        console.log('data-->', JSON.stringify(this.state));
        try {
          fetch('http://127.0.0.1:8000/api/addProduct/', {
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
              Authorization: `Bearer ${accessToken}`
            }
          })
            .then(response => response.json(), toast.success('Product added successfully!', {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 3000
            }))
            .then(data => console.log(data));
      
          this.setState({
            name: '',
            description: '',
            price: '',
            stock: ''
          });
        } catch (error) {
          console.error(error);
          toast.error('An unexpected error occurred!', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000
          });
        }
      }
      
      render() {
        const { errors } = this.state;
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
                  />
                  {errors.name && <div className="error-message">{errors.name}</div>}
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
                  />
                  {errors.description && <div className="error-message">{errors.description}</div>}
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
                  />
                  {errors.price && <div className="error-message">{errors.price}</div>}
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
                  />
                  {errors.stock && <div className="error-message">{errors.stock}</div>}
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

export default Add;