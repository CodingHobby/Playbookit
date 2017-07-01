import React, { Component } from 'react'
import FontAwesome from 'react-fontawesome'
import '../assets/styles/Dropdown.css'

export default class Dropdown extends Component {
	constructor(props) {
		super(props)
		this.state = {display: "none"}
	}

	render() {
		return (
			<div className="dropdown">
				<div id="dropdown-icon" onClick={this.toggleDropdown.bind(this)}>
					<FontAwesome name="bars" />
				</div>
				<div ref="toggle" className="toggle" style={{textAlign: "left", display: this.state.display}}>
					{this.props.children}
				</div>
			</div>
		)
	}

	// renderItems() {
	// 	let sample = [
	// 		(<p key="0">Hello, world</p>),
	// 		(<p key="1">Stuff</p>)
	// 	]
	// 	console.log(this.props)
	// 	return this.props.children.map((child, i) => < key={i}/>)
	// }

	toggleDropdown() {
		this.setState({display: (this.state.display === "none" ? "block" : "none")})
	}
}