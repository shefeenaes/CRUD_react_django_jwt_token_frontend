import React from 'react';
class Update extends React.Component{
    constructor(){
        super();
        this.state={
            name:'',
            description:'',
            price:'',
            stock:'',
            image:''
        }
        this.changeHandler=this.changeHandler.bind(this);
        this.submitForm=this.submitForm.bind(this);
    }

    // Input Change Handler
    changeHandler(event){
        this.setState({
            [event.target.name]:event.target.value
        });
    }

    // Submit Form
    submitForm(){
        var id=this.props.match.params.id;
        fetch('http://127.0.0.1:8000/backend/product/'+id+'/',{
            method:'PUT',
            body:JSON.stringify(this.state),
            headers:{
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        .then(response=>response.json())
        .then((data)=>console.log(data));
    }

    fetchData(){
        var id=this.props.match.params.id;
        fetch('http://127.0.0.1:8000//backend/product/'+id)
        .then(response=>response.json())
        .then((data)=>{
            this.setState({
                full_name:data.full_name,
                email:data.email,
                contact:data.contact,
                address:data.address
            });
        });
    }

    componentDidMount(){
        this.fetchData();
    }

    render(){
        return (
            <table className="table table-bordered">
                <tbody>
                    <tr>
                        <th>Name</th>
                        <td>
                            <input value={this.state.name} name="name" onChange={this.changeHandler} type="text" className="form-control" />
                        </td>
                    </tr>
                    <tr>
                        <th>Description</th>
                        <td>
                            <input value={this.state.description} name="description" onChange={this.changeHandler} type="text" className="form-control" />
                        </td>
                    </tr>
                    <tr>
                        <th>Price</th>
                        <td>
                            <input value={this.state.price} name="price" onChange={this.changeHandler} type="text" className="form-control" />
                        </td>
                    </tr>
                    <tr>
                        <th>Stock</th>
                        <td>
                            <input value={this.state.stock} name="contact" onChange={this.changeHandler} type="text" className="form-control" />
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