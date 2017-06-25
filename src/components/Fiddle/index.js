// TODO: remove duplicate code from Sandbox.js
import React, { Component } from 'react'
import firebase from 'firebase'
import '../../assets/styles/Editor.css'

import Commander from '../Commander/'
import {Redirect} from 'react-router-dom'
import Segment from './Segment'

import commands from '../Commander/commands/'
const commandArray = Object.keys(commands).map(k => commands[k])

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
						commands={commandArray}
					/>
					<button className="static-button btn btn-blue" onClick={commands.toggleCommander.handler.bind(this.refs.commander)}>CMD</button>
				</div>
			)
			: (
				<Redirect to="/404"/>
			)
		)
	}

	evalSegment() {
		try {
			// eslint-disable-next-line
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
}
