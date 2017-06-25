import React, {Component} from 'react'

import '../../assets/styles/Command.css'

// Visual rendering of a command in the Commander component
export default class Command extends Component {
	render() {
		return(
			<div className="command" onClick={this.props.onClick}>
				<h1>{this.props.command}</h1>
				<p>{this.props.description}</p>
				<p className="note">{this.props.shortcut}</p>
			</div>
		)
	}
}