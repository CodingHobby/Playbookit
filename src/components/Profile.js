import React, {Component} from 'react'
import {Link, Redirect} from 'react-router-dom'
import firebase from 'firebase'


import Thumbnail from './Thumbnail'
import './styles/Profile.css'
import './styles/Dashboard.css'

// TODO: change className to PlaybookSPreview
export default class Profile extends Component {
	constructor(props) {
		super(props)
		this.state = {submitted: false}
	}

	componentDidMount() {
		// TODO: add firebase.ref('/${user}').on('value') event listener to update this.state.playbooks
	}

  render() {
    return (
      !this.state.submitted
				? (this.props.editable ? this.renderEditable() : this.renderPreview())
				: this.renderRedirect()
    )
  }

  renderEditable() {
    return (
      <div className="playbooks">
				<h1>{this.props.owner.displayName}</h1>
				{/* TODO: here we actually want to loop over the state.playbooks stuff */}
        <Link to={`${this.props.owner.uid}/Title`}>
          <Thumbnail title={"Title"} subtitle="subtitle" type="playbook"/>
        </Link>
        <Thumbnail title="" subtitle="" type="add playbook" note="">
          <form onSubmit={this.addPlaybook.bind(this)}>
            <input type="text" className="form-control" ref="title"/>
            <input type="submit" value="Add" className="btn btn-blue"/>
          </form>
        </Thumbnail>
      </div>
    )
  }

  renderPreview() {
    return (
      <div className="playbooks">
				<h1>{this.props.owner.displayName}</h1>
        <Link to={`${this.props.user}/${this.props.title}`}>
          <Thumbnail title={this.props.title} subtitle="subtitle" type="playbook" note={this.props.owner}/>
        </Link>
      </div>
    )
  }

  addPlaybook(e) {
    e.preventDefault()
    // TODO: push data to firebase
    const title = this.refs.title.value
    console.log(title)
    this.refs.title.value = ""
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
}
