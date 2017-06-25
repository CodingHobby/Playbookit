import React, {Component} from 'react'

import '../../assets/styles/Segment.css'

export default class Segment extends Component {
	constructor(props) {
		super(props)
		this.state = {active: false}
	}
	componentDidMount() {
		this.refs.editor.innerText = this.props.children

		this.refs.editor.addEventListener('keydown', function (e) {
			if (e.code === "Tab") {
				e.preventDefault()
				// Since we can't get the exact cursor position quickly in a contentEditable element, we need to execute a command from the body, which is a lot quicker
				document.execCommand('insertHTML', false, '  ');
			}
		}, false)
	}

	render() {
		return(
			<div className={"segment " + (this.props.focused ? "focus" : '')} ref="el" onClick={this.props.onclick}>
				<div>
					<pre className="segmentEditor" onFocus={() => this.setState({active: true})} contentEditable={this.props.editable} ref="editor"></pre>
				</div>
				<div>
					<pre className="segmentEval" ref="eval">Eval</pre>
				</div>
			</div>
		)
	}
}