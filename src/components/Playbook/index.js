import React, {Component} from 'react'
import {Link, Redirect} from 'react-router-dom'

import Thumbnail from './Thumbnail'
import firebase from 'firebase'

export default class Playbook extends Component {
	constructor(props) {
		super(props)
		// Initialize the state
		this.state = {
			editable: this.props.match.params.user === firebase.auth().currentUser.uid,
			submitted: false,
			fiddles: []
		}
	}

	componentDidMount() {
		// We want to get the displayName of the user, not just his uid
		firebase.database()
			.ref(`/users/${this.props.match.params.user}`)
			.once('value', snap => {
				// Does the user uid exist?
				if(snap.val()) {
					this.setState({ ownerDisplayName: snap.val().displayName })
				} else {
					this.setState({ownerDisplayName: null})
				}
			})

		// Put an event listener on the change of the db data
		firebase.database()
			.ref(`/${this.props.match.params.user}/${this.props.match.params.playbook}/fiddles`)
			.on('value', (snap) => {
				const snapshot = snap.val()
				let fiddles = []
				if(snapshot) {
					// Loop over the db data's keys
					const ks = Object.keys(snapshot)
					ks.forEach(k => fiddles.push(snapshot[k]))
					this.setState({ fiddles })
				} else {
					// Null is needed to signal the fact that we should redirect to the 404 page
					this.setState({fiddles: null})
				}
			})
	}

	// Render the fiddle preview
	renderFiddles() {
		const fiddles = this.state.fiddles
		if(this.state.fiddles) {
			return fiddles.map((fiddle, i) => (
				<div className="preview" key={i}>
					<Link to={`/${fiddle.owner}/${fiddle.playbook}/${fiddle.title}`} key={i} replace>
						<Thumbnail title={fiddle.title} type="fiddle" />
					</Link>
					<button className="btn btn-red btn-delete" onClick={() => this.deleteFiddle(i)}>x</button>
				</div>
			))
		}
	}

	deleteFiddle(i) {
		let fiddle = this.state.fiddles[i]
		firebase.database().ref(`/${fiddle.owner}/${fiddle.playbook}/fiddles/${fiddle.title}`).set(null)
	}

	// Push data to the db
	addFiddle(e) {
		e.preventDefault()

		const title = this.refs.title.value

		// Grab a reference to the database path where we need to store the fiddle
		firebase.database()
			.ref(`/${this.props.match.params.user}/${this.props.match.params.playbook}/fiddles/${title}`)
			.set({
				title,
				owner: this.props.match.params.user,
				ownerDisplayName: this.state.ownerDisplayName,
				playbook: this.props.match.params.playbook,
				segments: ["2 + 2"]
			})
			.then(() => {
				// Update the state so that we can re-render
				this.setState({ title, submitted: true })
			})
	}

	// Render page based on the various conditions we need to decide what to render
	render() {
		return (
			this.state.submitted
				? <Redirect to={`/${this.props.match.params.user}/${this.props.match.params.playbook}/${this.state.title}`} />
				: (
						this.state.fiddles === null && this.state.ownerDisplayName === null && !this.state.editable
							? <Redirect to="/404"/> 
							: (
									<div className="thumbnails">
										<h1>{this.state.ownerDisplayName}: {this.props.match.params.playbook}</h1>
										{this.renderFiddles()}
										{
											this.state.editable
												? (
													<Thumbnail type="add fiddle">
														<form onSubmit={this.addFiddle.bind(this)}>
															<input type="text" className="form-control" ref="title" />
															<input type="submit" value="Add" className="btn btn-blue" />
														</form>
													</Thumbnail>
												)
												: ""
										}
								</div>
						)
					)
			)
	}
}