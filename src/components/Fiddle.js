import React, { Component } from 'react'
import Spinner from 'react-spinner'
import firebase from 'firebase'

import './styles/Editor.css'

export default class Fiddle extends Component {
	constructor(props) {
		super(props)
		this.state = {}
	}

	componentDidMount() {
		firebase.database()
			.ref(`${this.props.match.params.user}/${this.props.match.params.playbook}/fiddles/${this.props.match.params.fiddle}`)
			.on('value', snap => {
				const snapshot = snap.val()
				if (snapshot) {
					this.refs.editor.innerText = snapshot.content
					this.setState(snapshot)
					this.setState({ editable: this.props.match.params.user === snapshot.owner })
				}
			})

			// Handle tabbing
			this.refs.editor.addEventListener('keydown', function(e) {
				if(e.code === "Tab") {
					e.preventDefault()
					// Since we can't get the exact cursor position quickly in a contentEditable element, we need to execute a command from the body, which is a lot quicker
					document.execCommand('insertHTML', false, '  ');
				}
			}, false)
	}

	saveFiddle(e) {
		// Push the fiddle to the playbook's array
		e.preventDefault()
		firebase.database()
			.ref(`${this.props.match.params.user}/${this.props.match.params.playbook}/fiddles/${this.props.match.params.fiddle}/content`)
			.set(this.refs.editor.innerText)
	}

	render() {
		return (
			this.state !== {}
				? (
					<div className="fiddle">
						<div className="title">
							<h1>{this.state.ownerDisplayName}: {this.state.playbook}</h1>
							<h3>{this.state.title}</h3>
						</div>
						<pre className="editor" contentEditable={this.state.editable} ref="editor"></pre>
						{
							this.state.editable
								? <button className="btn btn-green btn-submit" onClick={this.saveFiddle.bind(this)}>Save</button>
								: ""
						}
					</div>
				)
				: (
					<Spinner/>
				)
		)
	}
}
