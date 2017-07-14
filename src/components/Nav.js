import React, {Component} from 'react'
import {NavLink} from 'react-router-dom'
import '../assets/styles/Nav.css'
import Dropdown from './Dropdown'

export default class Nav extends Component {
	render() {
		return(
			<div className="navbar">
				<nav>
					<ul>
					{/* TODO: Substitute dropdown icon with user profile picture */}
					<li>
						<Dropdown>
							<NavLink to="/login" activeClassName="active">Login</NavLink>
							<NavLink to="/register" activeClassName="active">Register</NavLink>
						</Dropdown>
					</li>
					<li>
						<NavLink to="/" exact activeClassName="active">Home</NavLink>
					</li>
					<li>
						<NavLink to="/user/profile/settings" activeClassName="active">Settings</NavLink>
					</li>
					</ul>
				</nav>
			</div>
		)
	}
}
