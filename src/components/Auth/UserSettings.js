import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import firebase from 'firebase'

import '../../assets/styles/UserSettings.css'

export default class UserSettings extends Component {
	constructor(props) {
		super(props)
		this.state = {}
	}

	render() {
		return (
			this.state.submitted ? <Redirect to="/"/> :
			this.props.user ? (
				<div className="settings">
					<h1>User Settings</h1>
					<form className="settings-form" ref="form" onSubmit={this.updateAccount.bind(this)}>
						<table className="settings-table">
							<tbody>
								<tr>
									<td className="label">
										<label htmlFor="display-name">Username:</label>
									</td>
									<td>
										<input
											id="display-name"
											className="form-control"
											type="text"
											ref="displayName"
											placeholder="Username"
											defaultValue={this.props.user.displayName}
										/></td>
								</tr>

								<tr>
									<td className="label">
										<label htmlFor="email">Email:</label>
									</td>
									<td><input
										id="email"
										className="form-control"
										type="email"
										ref="email"
										placeholder="Email"
										defaultValue={this.props.user.email}
									/>
									</td>
								</tr>
							</tbody>
						</table>
						<div className="buttons">
							<input type="submit" className="btn btn-green btn-submit" />
							<button className="btn btn-red btn-submit" onClick={this.deleteAccount.bind(this)}>Delete Account</button>
						</div>
					</form>
				</div>
			) : (
				<p>Loading...</p>
			)
		)
	}

	updateAccount(e) {
		e.preventDefault()
		firebase.auth()
			.currentUser
			.updateProfile({
				displayName: this.refs.displayName.value,
				email: this.refs.email.value
			})
			.then(() => this.setState({submitted: true}))
	}

	deleteAccount(e) {
		e.preventDefault()
		firebase.auth()
			.currentUser
			.delete()
			.then(() => {
				this.setState({submitted: true})
			})
			.catch(err => alert(err.message))
	}
}