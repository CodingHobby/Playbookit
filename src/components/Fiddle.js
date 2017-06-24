// TODO: remove duplicate code from Sandbox.js
import React, { Component } from 'react'
import firebase from 'firebase'
import './assets/styles/Editor.css'

import Commander from './Commander'
import {Redirect} from 'react-router-dom'
import Segment from './Segment'

import commands from './Commands'

export default class Fiddle extends Component {
	constructor(props) {
		super(props)
		this.state = {
			focusIndex: 0, 
			segments: [], 
			ref: `${this.props.match.params.user}/${this.props.match.params.playbook}/fiddles/${this.props.match.params.fiddle}/segments`
 		}
	}

	componentDidMount() {
		firebase.database()
			.ref(this.state.ref)
			.on('value', snap => {
				const snapshot = snap.val()
				// TODO: we probably don't need to check if it's an empty array, since firebase would delete the node completely. Instead we want to set it to an array with only one element and prevent the last fiddle to be deleted
				if (snapshot) {
					let ks = Object.keys(snapshot)
					let segments = []
					ks.forEach(k => segments.push(snapshot[k]))
					this.setState({ segments })
				} else if(snapshot === []) {
					firebase.database()
						.ref(this.state.ref)
						.push("2 + 2")
				} else {
					this.setState({ wrongUrl: true })
				}
			})
		window.onbeforeunload = this.saveSegments
		// We want to check whether we can edit the sandbox
		this.setState({ editable: this.props.match.params.user === firebase.auth().currentUser.uid })
	}

	componentWillUnmount() {
		this.saveSegments()
	}

	componentDidUpdate() {
		// Grab a reference to the active segment
		let activeSegment = this.refs[`segment${this.state.focusIndex}`]
		// Focus the editor for the active segment
		if (activeSegment) {
			activeSegment.refs.editor.focus()
		}
	}

	render() {
		return (
			!this.state.wrongUrl ?
			(
				<div className="fiddle">
					<div className="thumbnails" ref="root">
						{this.renderSegments(true)}
					</div>
					<Commander
						ref="commander"
						saveSegments={this.saveSegments.bind(this)}
						addSegment={this.addSegment.bind(this)}
						evalSegment={this.evalSegment.bind(this)}
						commands={commands}
					/>
					<button className="static-button btn btn-blue" onClick={commands[0].handler.bind(this.refs.commander)}>CMD</button>
				</div>
			)
			: (
				<Redirect to="/404"/>
			)
		)
	}

	evalSegment() {
		try {
			const output = eval(this.refs[`segment${this.state.focusIndex}`].refs.editor.innerText)
			this.refs[`segment${this.state.focusIndex}`].refs.eval.innerText = output
			this.saveSegments()
		} catch (e) {
			console.error(e)
		}
	}

	saveSegments() {
		// We want to push the content of each Segment editor to the "neweSegments" array
		let newSegments = []
		for (var i = 0; i < this.state.segments.length; i++) {
			newSegments.push(this.refs[`segment${i}`].refs.editor.innerText)
		}
		// And then set firebase's data to that
		firebase.database()
			.ref(this.state.ref)
			.set(newSegments)
		this.setState({ segments: newSegments })
	}

	addSegment() {
		firebase.database()
			.ref(`/${this.props.match.params.user}/${this.props.match.params.playbook}/fiddles/${this.props.match.params.fiddle}/segments`)
			.push('2 + 2')
	}

	renderSegments(editable) {
		return this.state.segments.map((segment, i) => (
			<Segment
				ref={`segment${i}`}
				key={i}
				focused={this.state.focusIndex === i}
				editable={editable}
				onclick={() => this.changeFocus(i)}
			>
				{segment}
			</Segment>
		)
		)
	}

	changeFocus(i) {
		this.setState({ focusIndex: i })
	}

	// componentDidMount() {
	// 	// Start getting the content of the data
	// 	firebase.database()
	// 		.ref(`${this.props.match.params.user}/${this.props.match.params.playbook}/fiddles/${this.props.match.params.fiddle}`)
	// 		.on('value', snap => {
	// 			const snapshot = snap.val()
	// 			// If we have some data from the db then we want to set the state to it, otherwise just redirect, since it means that the user/playbook/fiddle do not exist
	// 			if (snapshot) {
	// 				// Change the text to the retrieved data
	// 				this.refs.editor.innerText = snapshot.content
	// 				// Set the state and make the conetnt editable based on what is in the database
	// 				this.setState(snapshot)
	// 				this.setState({ editable: this.props.match.params.user === snapshot.owner })
	// 			} else {
	// 				this.setState({wrongUrl: true})
	// 			}
	// 		})

	// 		// Handle tabbing
	// 		this.refs.editor.addEventListener('keydown', function(e) {
	// 			if(e.code === "Tab") {
	// 				e.preventDefault()
	// 				// Since we can't get the exact cursor position quickly in a contentEditable element, we need to execute a command from the body, which is a lot quicker
	// 				document.execCommand('insertHTML', false, '  ');
	// 			}
	// 		}, false)
	// }

	// saveFiddle(e) {
	// 	// Push the fiddle to the playbook's array
	// 	e.preventDefault()
	// 	// Replace value for the text content in the database
	// 	firebase.database()
	// 		.ref(`${this.props.match.params.user}/${this.props.match.params.playbook}/fiddles/${this.props.match.params.fiddle}/content`)
	// 		.set(this.refs.editor.innerText)
	// }

	// render() {
	// 	return (
	// 		// Is the URL right?
	// 		this.state.wrongUrl !== true
	// 		? (
	// 			// Could we retrieve data in time?
	// 			this.state !== {}
	// 				? (
	// 					<div className="fiddle">
	// 						<div className="title">
	// 							<h1>{this.state.ownerDisplayName}: {this.state.playbook}</h1>
	// 							<h3>{this.state.title}</h3>
	// 						</div>
	// 						<pre className="editor" contentEditable={this.state.editable} ref="editor"></pre>
	// 						{
	// 							this.state.editable
	// 								? <button className="btn btn-green btn-submit" onClick={this.saveFiddle.bind(this)}>Save</button>
	// 								: ""
	// 						}
	// 					</div>
	// 				)
	// 				: (
	// 					<Spinner/>
	// 				)
	// 	)
	// 	: (
	// 		<Redirect to="/404"/>
	// 	)
	// 	)
	// }
}
