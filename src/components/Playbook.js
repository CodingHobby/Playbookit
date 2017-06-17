import React, {Component} from 'react'
import {Link, Redirect} from 'react-router-dom'
import Spinner from 'react-spinner'

import Thumbnail from './Thumbnail'
import firebase from 'firebase'

export default class Playbook extends Component {
	constructor(props) {
		super(props)
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
			.once('value', snap => this.setState({ownerDisplayName: snap.val().displayName}))

		firebase.database()
			.ref(`/${this.props.match.params.user}/${this.props.match.params.playbook}/fiddles`)
			.on('value', (snap) => {
				const snapshot = snap.val()
				let fiddles = []
				if(snapshot) {
					const ks = Object.keys(snapshot)
					ks.forEach(k => fiddles.push(snapshot[k]))
				}
				this.setState({fiddles})
			})
	}

	render() {
		return (
			this.state.submitted
				? this.renderRedirect()
				: (
						this.state.ownerDisplayName
						? (
								this.state.editable
									? this.renderEditable()
									: this.renderPreview()
							)
						: this.renderLoading()
				)
		)
	}

	renderEditable() {
		return (
			<div className="thumbnails">
				<h1>{this.state.ownerDisplayName}: {this.props.match.params.playbook}</h1>
				{this.renderFiddles()}
				<Thumbnail type="add fiddle">
          <form onSubmit={this.addFiddle.bind(this)}>
            <input type="text" className="form-control" ref="title"/>
            <input type="submit" value="Add" className="btn btn-blue"/>
          </form>
        </Thumbnail>
			</div>
		)
	}

	renderPreview() {
		return (
			<div className="thumbnails">
				<h1>{this.state.ownerDisplayName}: {this.props.match.params.playbook}</h1>
				<Thumbnail type="fiddle" title={this.props.match.params.playbook}/>
			</div>
		)
	}

	addFiddle(e) {
		e.preventDefault()

		const title = this.refs.title.value

		firebase.database()
			.ref(`/${this.props.match.params.user}/${this.props.match.params.playbook}/fiddles/${title}`)
			.set({
				title,
				owner: this.props.match.params.user,
				ownerDisplayName: this.state.ownerDisplayName,
				playbook: this.props.match.params.playbook
			})
		this.setState({title, submitted: true})
	}

	renderRedirect() {
		return (
			<Redirect to={`${this.props.match.params.user}/${this.props.match.params.playbook}/${this.state.title}`}/>
		)
	}

	renderFiddles(displayAuth) {
		const fiddles = this.state.fiddles
		return fiddles.map((fiddle, i) => (
				<Link to={`${fiddle.owner}/${fiddle.title}`} key={i}>
					<Thumbnail title={fiddle.title} type="fiddle"/>
				</Link>
			))
	}

	renderLoading() {
		return(
			<Spinner/>
		)
	}
}
