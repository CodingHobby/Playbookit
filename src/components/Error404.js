import React, {Component} from 'react'

import './styles/Error404.css'
import err404 from './404err.gif'

export default class Error404 extends Component {
	render() {
		return(
			<div className="err404">
				<h1>Oops!</h1>
				<h1>Looks like we can't find the page you're looking for!</h1>
				<h3>Our tech guys are working on it</h3>
				<img src={err404} alt=""/>
			</div>
		)
	}
}