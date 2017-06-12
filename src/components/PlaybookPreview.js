import React, {Component} from 'react'
import {Link} from 'react-router-dom'

import Thumbnail from './Thumbnail'
import ProfilePreview from './styles/ProfilePreview.css'

// TODO: change className to PlaybookSPreview
export default class PlaybookPreview extends Component {
	render() {
		return(
				<div className="playbooks">
				<Link to={`${this.props.user}/${this.props.title}`}>
					<Thumbnail title={this.props.title} subtitle="subtitle" type="playbook" note={this.props.owner}/>
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

	addPlaybook(e) {
		e.preventDefault()
		// TODO: push data to firebase
		const title = this.refs.title.value
		console.log(title)
		this.refs.title.value = ""
	}
}
