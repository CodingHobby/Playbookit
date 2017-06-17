import React, {Component} from 'react'

import './styles/Thumbs.css'

export default class Thumbnail extends Component {
	render() {
		// We want to check what props are passed in order to render the thumbnail properly
		return (
			<div className={`thumbnail ${this.props.type}`}>
				{this.props.title !== "" ? <h3>{this.props.title}</h3> : ""}
				{this.props.children}
				{this.props.subtitle ? <p>{this.props.subtitle}</p> : ""}
				{this.props.note ? <p className="note">{this.props.note}</p> : ""}
			</div>
		)
	}
}
