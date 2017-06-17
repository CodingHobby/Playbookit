import React, {Component} from 'react'
import firebase from 'firebase'
import {Redirect} from 'react-router-dom'

import ErrorMessage from './Error'

export default class Register extends Component {
  // Initialize the component with no errors
  constructor(props) {
    super(props)
    this.state = {
      errors: [],
			submitted: false
    }
  }

	// If we already have submitted the form then redirect to the home page, otherwise just render the form
  render() {
    return (
			this.state.submitted
				? this.renderRedirect()
				: this.renderForm()
    )
  }

  register(e) {
    e.preventDefault()
    // Create an empty errors array and push each error to it
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
					// Set the user's displayName
					.then((user) => {
						user.updateProfile({
							displayName: username
						})
						.then(() => {
							// We also want to keep a reference to a user's profile info (aka uid and username) since later we'll want to fetch a  user's displayName while knowing the user's uid
							firebase.database()
								.ref(`/users/${user.uid}`)
								.set({
									displayName: user.displayName,
									email: user.email
								})
								// Update the state so that we can redirect to the homepage
							this.setState({submitted: true})
						})
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

		// Separated function to render the form
		renderForm() {
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

		// Function to redirect to the homepage
		renderRedirect() {
			return (
				<Redirect to="/"/>
			)
		}
  }
