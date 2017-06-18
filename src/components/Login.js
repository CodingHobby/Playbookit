import React, {Component} from 'react'
import {Redirect, Link} from 'react-router-dom'
import firebase from 'firebase'

import ErrorMessage from './Error'

export default class Login extends Component {
	constructor(props) {
		super(props)

		this.state = {
			errors: [],
			submitted: false,
			user: this.props.user
		}
	}

  render() {
    return (
			this.state.submitted
			? ( 
				<Redirect to="/"/> 
			)
			: (
				<div className="auth-page">
					<h1>Login</h1>
					{this.renderErrors()}
					<form className="form" id="login-form" onSubmit={this.login.bind(this)}>
						<div className="inputs">
							<input type="text" name="email" className="form-control" placeholder="Email" ref="email"/>
							<input type="password" name="password" className="form-control" placeholder="Password" ref="password"/>
							<input type="submit" value="Login" className="btn btn-blue"/>
						</div>
						{
							this.state.user === null
								? ""
								: (
									<div className="button-group login-buttons">
										<button onClick={this.logout.bind(this)} className="btn btn-red btn-logout">Logout</button>
										<Link to="/register"><button className="btn btn-green">Register</button></Link>
									</div>
								)
						}
					</form>
				</div>
			)
    )
  }

	login(e) {
		e.preventDefault()
		const email = this.refs.email.value,
			password = this.refs.password.value

		// After we log in we want to "redirect" to the homepage
		firebase.auth().signInWithEmailAndPassword(email, password)
			.then(user => this.setState({submitted: true}))
			.catch(e => this.setState({errors: [e.message]}))
	}

	logout(e) {
		e.preventDefault()
		firebase.auth()
			.signOut()
			.then(() => this.setState({user: null}))
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
