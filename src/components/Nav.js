import React, {Component} from 'react'
import {NavLink} from 'react-router-dom'
import './styles/Nav.css'

export default class Nav extends Component {
	render() {
		return(
			<div className="navbar">
				<nav>
					<ul>
					{/* TODO: add dropdown for user-related links */}
					<li>
						<NavLink to="/" exact activeClassName="active">Home</NavLink>
					</li>
						<li>
							<NavLink to="/login" activeClassName="active">Login</NavLink>
						</li>
						<li>
							<NavLink to="/register" activeClassName="active">Register</NavLink>
						</li>
					</ul>
				</nav>
			</div>
		)
	}
}
