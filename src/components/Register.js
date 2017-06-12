import React, {Component} from 'react'
import firebase from 'firebase'

import ErrorMessage from './Error'

export default class Register extends Component {
  // Initialize the component with no errors
  constructor(props) {
    super(props)
    this.state = {
      errors: []
    }
  }

  render() {
    return (
      <div className="auth-page">
        <h1>Register:</h1>
        {this.renderErrors()}
        <form className="form" onSubmit={this.register.bind(this)}>
          <div className="inputs">
            <input type="text" className="form-control" placeholder="Username" ref="username"/>
            <input type="text" className="form-control" placeholder="Email" ref="email"/>
            <input type="password" className="form-control" placeholder="Password" ref="password1"/>
            <input type="password" className="form-control" placeholder="Confirm Password" ref="password2"/>
            <input type="submit" className="btn btn-green" value="Register"/>
          </div>
        </form>
      </div>
    )
  }

  register(e) {
    e.preventDefault()
    // Make a copy of the errors array and push each new error to it
    let errors = []
      const username = this.refs.username.value,
        email = this.refs.email.value,
        password1 = this.refs.password1.value,
        password2 = this.refs.password2.value
      // Basic form validation
      if (username === "")
        errors.push("You must enter a username")
      if (email === "")
        errors.push("You must enter an email")
      if (password1 === "")
        errors.push("You must enter a password")
      if (password1 !== password2)
        errors.push("The passwords must equal each other")
        // If there are no errors create the account, otherwise render the errors
      if (!errors.length) {
        // Create an account and catch errors and push them to the state
				console.log("No errors")
        firebase.auth()
					.createUserWithEmailAndPassword(email, password1)
					.then((user) => {
						user.updateProfile({
							displayName: username
						})
						.then(() => this.props.history.push('/'))
					})
					.catch(error => {
						errors.push(error.message)
						this.setState({errors})
					})
      } else {
        // Reset the state
        this.setState({errors})
      }
    }

    renderErrors() {
      if (this.state.errors) {
        const errors = this.state.errors.map((error, i) => <ErrorMessage key={i} className="error">{error}</ErrorMessage>)
        return (
          <div className="errors">
            {errors}
          </div>
        )
      }
    }
  }
