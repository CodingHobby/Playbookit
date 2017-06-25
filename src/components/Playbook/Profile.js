// TODO: get rid of duplication (abstract away stuff from Playbook.js, too)
import React, {Component} from 'react'
import {Redirect, Link} from 'react-router-dom'
import firebase from 'firebase'


import Thumbnail from './Thumbnail'
import '../../assets/styles/ThumbnailCollection.css'

export default class Profile extends Component {
	constructor(props) {
		super(props)
		this.state = {submitted: false, playbooks: undefined}
	}

	componentDidMount() {
		let ref = null;
		// Find the right path for firebase data
		if(this.props.match) {
			ref = `${this.props.match.params.user}/`
		} else {
			ref = `${this.props.owner.uid}/`
		}
		if(!this.props.owner) {
			firebase.database()
				.ref(`/users/${this.props.match.params.user}`)
				.once('value', snap => {
					// Grab user data from firebase
					const snapshot = snap.val()
					if(snapshot) {
						this.setState({ownerDisplayName: snapshot.displayName})
					} else {
						this.setState({ownerDisplayName: null})
					}
				})
		}
		firebase.database()
			.ref(ref)
			.on('value', (snap) => {
				// Grab profile data from firebase
				let playbooks = []
				const snapshot = snap.val()
				if(snapshot) {
					let ks = Object.keys(snapshot)
					ks.forEach(k => playbooks.push(snapshot[k]))
					this.setState({ playbooks })
				} else {
					this.setState({playbooks: null})
				}
			})
	}

	// Render playbooks based on the state
	renderPlaybooks(editable) {
		if(this.state.playbooks) {
			return this.state.playbooks.map((playbook, i) => (
				<div key={i} className="preview">
					<Link to={`/${playbook.owner}/${playbook.title}`}>
							<Thumbnail
								key={i}
								title={playbook.title}
								type="playbook"
							/>
					</Link>
					{
						editable ?
						(
							<button className="btn btn-red btn-delete" onClick={() => this.deletePlaybook(i)}>x</button>
						)
						: ""
					}
					</div>
			))
		}
	}

	deletePlaybook(i) {
		let playbook = this.state.playbooks[i]
		firebase.database().ref(`/${playbook.owner}/${playbook.title}`).set(null)
	}

	removePlaybook(e) {
		e.preventDefault()
		console.log(e.target)
	}

	renderRedirect() {
		return(
			<Redirect to={`/${this.props.owner.uid}/${this.state.title}`}/>
		)
	}

  addPlaybook(e) {
    e.preventDefault()
    const title = this.refs.title.value
		// Set the value of a new node in the firebase database
		// Possibly we'd want to change the owner property to the displayName of the current user, that way we'll be able to have both uid and displayName without having to go through a large amount of key-value pairs
		if(title !== "") {
			firebase.database()
				.ref(`/${this.props.owner.uid}/${title}`)
				.set({
					title,
					owner: this.props.owner.uid,
					ownerDisplayName: this.props.owner.displayName,
					fiddles: []
				})
			this.setState({ title, submitted: true })
		}
  }

	// Render page
	render() {
		// This seems like a crazy complicated bool checking nightmare, and it is, but all that it's doing is it's checking whether
		/*
		1. We've submitted the form. If we have then we want to redirect otherwise we don't
		2. We've loaded the data, and if we haven't we want to load an animation
		3. We can edit the profile
		*/
		return (
				this.state.submitted
				? <Redirect to={`/${this.props.owner.uid}/${this.state.title}`} />
				: (
						this.state.playbooks === null && !this.props.editable
							? <Redirect to="/404"/>
						:
						(
							<div className="thumbnails">
								<h1>{this.props.owner.displayName}</h1>
								{this.renderPlaybooks(true)}
								{
									this.props.editable
									? (
										<Thumbnail type="add playbook">
											<form onSubmit={this.addPlaybook.bind(this)}>
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
