import React, {Component} from 'react'

import Commander from '../Commander/'
import commands from '../Commander/commands/'
import Segment from './Segment'
import firebase from 'firebase'
import utils from './utils'
import '../../assets/styles/Sandbox.css'

const commandArray = Object.keys(commands).map(k => commands[k])


export default class Sandbox extends Component {
	constructor(props) {
		super(props)
		this.state = {
			segments: [], 
			focusIndex: 0,
			ref: `/users/${this.props.match.params.user}/sandbox/segments`
		}
	}

	componentDidMount() {
		firebase.database()
			// We can't put the reference in the UID/sandbox path, since they could just make a "sandbox" playbook, and then we'd have some strange conflicts
			.ref(this.state.ref)
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
					utils.addSegment()
				}
			})
		window.onbeforeunload = utils.saveSegments.bind(this)
		// We want to check whether we can edit the sandbox
		this.setState({ editable: this.props.match.params.user === firebase.auth().currentUser.uid})
	}

	// When we change page we want to save all our segments
	componentWillUnmount() {
		utils.saveSegments.bind(this)()
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
	
	// Render the sandbox
	render() {
		return (
			<div className="sandbox">
				<h1>Sandbox</h1>
				<div className="thumbnails" ref="root">
					{utils.renderSegments.bind(this)(this.state.editable)}
				</div>
				<Commander
					commands = {commandArray}
					ref="commander" 
					saveSegments={utils.saveSegments.bind(this)}
					addSegment={utils.addSegment.bind(this)}
					evalSegment={utils.evalSegment.bind(this)}
				/>
				<button 
					className="static-button btn btn-blue" 
					onClick={commands.toggleCommander.handler.bind(this.refs.commander)}
				>
					CMD
				</button>
			</div>
		)
	}
}