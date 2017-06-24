import React, {Component} from 'react'

import Commander from './Commander'
import commands from './Commands'
import Segment from './Segment'
import firebase from 'firebase'

import './assets/styles/Sandbox.css'

export default class Sandbox extends Component {
	constructor(props) {
		super(props)
		this.state = {segments: [], focusIndex: 0}
	}

	componentDidMount() {
		firebase.database()
			// We can't put the reference in the UID/sandbox path, since they could just make a "sandbox" playbook, and then we'd have some strange conflicts
			.ref(`/users/${this.props.match.params.user}/sandbox/segments`)
			.on('value', snap => {
				const segments = snap.val()
				if(segments) {
					// Push the retrieved data from the Firebase database to an array
					let newState = []
					let ks = Object.keys(segments)
					ks.forEach(k => newState.push(segments[k]))
					// Set the state to the firebase data
					this.setState({segments: newState})
				} else {
					// If we don't have any segments we just want to make a new one with some placeholder text
					firebase.database()
						.ref(`/users/${this.props.match.params.user}/sandbox/segments`)
						.push('"Hello, world"')
				}
			})
		window.onbeforeunload = this.saveSegments
		// We want to check whether we can edit the sandbox
		this.setState({ editable: this.props.match.params.user === firebase.auth().currentUser.uid})
	}

	// When we change page we want to save all our segments
	componentWillUnmount() {
		this.saveSegments()
	}

	// When we update the state we want to focus the element the new state points to
	componentDidUpdate() {
		// Grab a reference to the active segment
		let activeSegment = this.refs[`segment${this.state.focusIndex}`]
		// Focus the editor for the active segment
		if(activeSegment) {
			activeSegment.refs.editor.focus()
		}
	}

	// We can't manually add event listeners on update, since that would basically add more and more and crash everything
	changeFocus(i) {
		this.setState({ focusIndex: i })
	}

	saveSegments() {
		// We want to push the content of each Segment editor to the "neweSegments" array
		let newSegments = []
		for(var i = 0; i < this.state.segments.length; i++) {
			newSegments.push(this.refs[`segment${i}`].refs.editor.innerText)
		}
		// And then set firebase's data to that
		firebase.database()
			.ref(`/users/${this.props.match.params.user}/sandbox/segments`)
			.set(newSegments)
		this.setState({segments: newSegments})
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

	addSegment() {
		// Add a segment with placeholder code
		// TODO: instead of just pushing stuff with random keys, for constistence we should pull down the array and re-push it with the new element, so that we have an array-like structure
		firebase.database()
			.ref(`/users/${this.props.match.params.user}/sandbox/segments`)
			.push('"Hello, world"')
	}

	// Evaluate the currently focused segment
	evalSegment() {
		// We need to try and catch since there could be errors in the code which would crash the app
		try {
			const output = eval(this.refs[`segment${this.state.focusIndex}`].refs.editor.innerText)
			this.refs[`segment${this.state.focusIndex}`].refs.eval.innerText = output
			this.saveSegments()
		} catch(e) {
			console.error(e)
		}
	}

	// Render the sandbox
	render() {
		return (
			<div className="sandbox">
				<h1>Sandbox</h1>
				<div className="thumbnails" ref="root">
					{this.renderSegments(this.state.editable)}
				</div>
				<Commander
					commands = {commands}
					ref="commander" 
					saveSegments={this.saveSegments.bind(this)}
					addSegment={this.addSegment.bind(this)}
					evalSegment={this.evalSegment.bind(this)}
				/>
				<button className="static-button btn btn-blue" onClick={commands[0].handler.bind(this.refs.commander)}>CMD</button>
			</div>
		)
	}
}