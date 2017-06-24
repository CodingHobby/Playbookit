import React, {Component} from 'react'

import './assets/styles/Commander.css'

import Command from './Command'


export default class Commander extends Component {
	constructor(props) {
		super(props)
		this.state = {}
	}

	componentWillMount() {
		this.setState({commands: this.props.commands})
	}

	componentDidMount() {
		// Automatically add an event listener for every command in the "commands" array
		document.addEventListener('keydown', e => {
			this.state.commands.forEach(command => {
				// Does the key combination which was pressed match any event's?
				if(e.altKey === command.shortcut.altKey 
					&& e.ctrlKey === command.shortcut.ctrlKey 
					&& e.keyCode === command.shortcut.mainKeyCode) {
					command.handler.bind(this)()
				}
			})
		})
	}

	renderCommands() {
		let commands = this.state.commands
		// Loop over the commands and render a Command component with all the properties we need
		return commands.map((command, i) => (
				<Command
					key={i}
					ref={`command${i}`}
					command={command.command} 
					shortcut={this.getShortcutString(command.shortcut)} 
					description={command.description}
					onClick={command.handler.bind(this)}
				/>
		))
	}

	// Convert a "program-friendly" shortcut to a "human-friendly" string
	getShortcutString(obj) {
		let str = ""
		str += obj.ctrlKey ? "Ctrl+" : ""
		str += obj.altKey ? "Alt+" : ""
		str += obj.shiftKey ? "Shift+" : ""
		str += obj.mainKey

		return str
	}
	
	render() {
		return (
			<div className="commander" ref="root">
				<h1>Commander</h1>
				<div className="commands">
					{this.renderCommands()}
				</div>
			</div>
		)
	}

}