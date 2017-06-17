import React, {Component} from 'react'
import {Link} from 'react-router-dom'

import Thumbnail from './Thumbnail'
import './styles/Profile.css'
import './styles/Dashboard.css'

// TODO: change className to PlaybookSPreview
export default class Profile extends Component {
	constructor(props) {
		super(props)
		this.state = {}
	}

	componentDidMount() {
		// TODO: add firebase.ref('/${user}').on('value') event listener to update this.state.playbooks
	}

  render() {
    return (
      this.props.editable ? this.renderEditable() : this.renderPreview()
    )
  }

  renderEditable() {
    return (
      <div className="playbooks">
				<h1>{this.props.owner.displayName}</h1>
        <Link to={`${this.props.owner.uid}/${this.props.title}`}>
          <Thumbnail title={"Title"} subtitle="subtitle" type="playbook" note={this.props.owner.displayName}/>
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
  }
}
