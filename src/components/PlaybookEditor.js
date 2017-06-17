import React, {Component} from 'react'

import Thumbnail from './Thumbnail'

export default class PlaybookEditor extends Component {
	render() {
		return(
			<div>
				<h1>{this.props.match.params.playbook}</h1>
				<div className="playbooks">
					<Thumbnail type="fiddle" title={this.props.match.params.playbook}/>
				</div>
			</div>
		)
	}
}
