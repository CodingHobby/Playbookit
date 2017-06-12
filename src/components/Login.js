import React, {Component} from 'react'
import firebase from 'firebase'

import ErrorMessage from './Error'

export default class Login extends Component {
	constructor(props) {
		super(props)

		this.state = {
			errors: []
		}
	}

  render() {
    return (
      <div className="auth-page">
        <h1>Login</h1>
				{this.renderErrors()}
        <form className="form" id="login-form" onSubmit={this.login.bind(this)}>
          <div className="inputs">
            <input type="text" name="email" className="form-control" placeholder="Email" ref="email"/>
            <input type="password" name="password" className="form-control" placeholder="Password" ref="password"/>
            <input type="submit" value="Login" className="btn btn-blue"/>
          </div>
        </form>
      </div>
    )
  }

	login(e) {
		e.preventDefault()
		const email = this.refs.email.value,
			password = this.refs.password.value

		// After we log in we want to "redirect" to the homepage
		firebase.auth().signInWithEmailAndPassword(email, password)
			.then(() => this.props.history.push('/'))
			.catch(e => this.setState({errors: [e.message]}))
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
