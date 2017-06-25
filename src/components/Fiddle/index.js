// TODO: remove duplicate code from Sandbox.js
import React, { Component } from 'react'
import firebase from 'firebase'
import '../../assets/styles/Editor.css'

import Commander from '../Commander/'
import {Redirect} from 'react-router-dom'
import Segment from './Segment'
import utils from './utils'
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
				// FIXME: we probably don't need to check if it's an empty array, since firebase would delete the node completely. Instead we want to set it to an array with only one element and prevent the last fiddle to be deleted
				if (snapshot) {
					let ks = Object.keys(snapshot)
					let segments = []
					ks.forEach(k => segments.push(snapshot[k]))
					this.setState({ segments })
				} else if(snapshot === []) {
					utils.addSegment()
				} else {
					this.setState({ wrongUrl: true })
				}
			})
		window.onbeforeunload = utils.saveSegments.bind(this)
		// We want to check whether we can edit the sandbox
		this.setState({ editable: this.props.match.params.user === firebase.auth().currentUser.uid })
	}

	componentWillUnmount() {
		utils.saveSegments.bind(this)()
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
						{utils.renderSegments.bind(this)(true)}
					</div>
					<Commander
						ref="commander"
						saveSegments={utils.saveSegments.bind(this)}
						addSegment={utils.addSegment.bind(this)}
						evalSegment={utils.evalSegment.bind(this)}
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
}
