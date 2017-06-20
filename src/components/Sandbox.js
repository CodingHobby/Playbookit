import React, {Component} from 'react'

import Segment from './Segment'
import firebase from 'firebase'

import './styles/Sandbox.css'

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
						.push("Hello, world")
				}
			})
		// We want to check whether we can edit the sandbox
		this.setState({ editable: this.props.match.params.user === firebase.auth().currentUser.uid})
	}

	componentWillUnmount() {
		// TODO: save segments in firebase
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


	renderSegments(editable) {
		return this.state.segments.map((segment, i) => <Segment ref={`segment${i}`} key={i} focused={this.state.focusIndex === i} editable={editable} onclick={(() => this.changeFocus(i))}>{segment}</Segment>)
	}

	addSegment() {
		// Add a segment with placeholder code
		firebase.database()
			.ref(`/users/${this.props.match.params.user}/sandbox/segments`)
			.push("Hello, world")
	}

	// Render the sandbox
	render() {
		return (
			<div className="sandbox">
				<h1>Sandbox</h1>
				<div className="thumbnails">
					{this.renderSegments(this.state.editable)}
				</div>

				<button className="static-button btn btn-blue">CMD</button>
			</div>
		)
	}
}