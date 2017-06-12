import React, {Component} from 'react'

import './styles/Thumbs.css'

export default class Thumbnail extends Component {
	componentDidMount() {
		console.log(this.props.title, this.props.subtitle, this.props.note)
	}
	render() {
		return (
			<div className={`thumbnail ${this.props.type}`}>
				{this.props.title != "" ? <h3>{this.props.title}</h3> : ""}
				{this.props.children}
				{this.props.subtitle ? <p>{this.props.subtitle}</p> : ""}
				{this.props.note ? <p className="note">{this.props.note}</p> : ""}
			</div>
		)
	}
}
