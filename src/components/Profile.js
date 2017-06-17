import React, {Component} from 'react'
import {Link, Redirect} from 'react-router-dom'
import firebase from 'firebase'
import Spinner from 'react-spinner'


import Thumbnail from './Thumbnail'
import './styles/Profile.css'
import './styles/Dashboard.css'

export default class Profile extends Component {
	constructor(props) {
		super(props)
		this.state = {submitted: false, playbooks: undefined}
	}

	componentDidMount() {
		// TODO: check if this expression is still valid if we are not looking at an editable playbook
		let ref = null;
		if(this.props.match) {
			ref = `${this.props.match.params.user}/`
		} else {
			ref = `${firebase.auth().currentUser.uid}`
		}
		firebase.database()
			.ref(ref)
			.on('value', (snap) => {
				let playbooks = []
				const snapshot = snap.val()
				if(snapshot) {
					let ks = Object.keys(snapshot)
					ks.forEach(k => playbooks.push(snapshot[k]))
				}
				this.setState({playbooks})
			})
	}

  render() {
		// This seems like a crazy complicated bool checking nightmare, and it is, but all that it's doing is it's checking whether
		/*
			1. We've submitted the form. If we have then we want to redirect otherwise we don't
			2. We've loaded the data, and if we haven't we want to load an animation
			3. We can edit the profile
		*/
    return (
      !this.state.submitted
				? (this.state.playbooks !== undefined
					? (this.props.editable
						? this.renderEditable()
						: this.renderPreview())
					: this.renderLoading())
				: this.renderRedirect()
    )
  }

  renderEditable() {
    return (
      <div className="playbooks">
				<h1>{this.props.owner.displayName}</h1>
				{/* TODO: here we actually want to loop over the state.playbooks stuff */}
        {this.renderPlaybooks()}
        <Thumbnail title="" subtitle="" type="add playbook" note="">
          <form onSubmit={this.addPlaybook.bind(this)}>
            <input type="text" className="form-control" ref="title"/>
            <input type="submit" value="Add" className="btn btn-blue"/>
          </form>
        </Thumbnail>
      </div>
    )
  }

	renderLoading() {
		return(
			<Spinner/>
		)
	}

  renderPreview() {
    return (
      <div className="playbooks">
				<h1>{this.props.owner.displayName}</h1>
        {this.renderPlaybooks()}
      </div>
    )
  }

  addPlaybook(e) {
    e.preventDefault()
    // TODO: push data to firebase
    const title = this.refs.title.value
		// Set the value of a new node in the firebase database
		// Possibly we'd want to change the owner property to the displayName of the current user, that way we'll be able to have both uid and displayName without having to go through a large amount of key-value pairs
		firebase.database()
			.ref(`/${this.props.owner.uid}/${title}`)
			.set({
				title,
				owner: this.props.owner.uid,
				fiddles: []
			})
		this.setState({title, submitted: true})
  }

	renderRedirect() {
		return(
			<Redirect to={`${this.props.owner.uid}/${this.state.title}`}/>
		)
	}

	renderPlaybooks() {
		const playbooks = this.state.playbooks
		return playbooks.map((playbook, i) => (
			<Link to={`${playbook.owner}/${playbook.title}`} key={i}>
				<Thumbnail title={playbook.title} type="playbook"/>
			</Link>
		))
	}
}
