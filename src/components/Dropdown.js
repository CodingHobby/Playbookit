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
					{this.renderItems()}
				</div>
			</div>
		)
	}

	renderItems() {
		return this.props.children.map((child, i) => (
			<div className="dropdown-link" onClick={this.toggleDropdown.bind(this)} key={i}>
				{child}
			</div>
		))
	}

	toggleDropdown() {
		this.setState({display: (this.state.display === "none" ? "block" : "none")})
	}
}