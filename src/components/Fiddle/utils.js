import React from 'react'
import firebase from 'firebase'

import Segment from './Segment'

export default {
	saveSegments: function() {
		const newSegments = getNewSegments(this.state.segments.length, this.refs)
		firebase.database()
			.ref(this.state.ref)
			.set(newSegments)
		this.setState({ segments: newSegments })
	},
	addSegment: function() {
		firebase.database()
			.ref(this.state.ref)
			.push('2 + 2')
	},
	renderSegments: function(editable) {
		return this.state.segments.map((segment, i) => (
			<Segment
				ref={`segment${i}`}
				key={i}
				focused={this.state.focusIndex === i}
				editable={editable}
				onclick={() => this.setState({ focusIndex: i })}
			>
				{segment}
			</Segment>
		)
		)
	},
	evalSegment: function() {
		try {
			// eslint-disable-next-line
			const output = eval(this.refs[`segment${this.state.focusIndex}`].refs.editor.innerText)
			this.refs[`segment${this.state.focusIndex}`].refs.eval.innerText = output
		} catch (e) {
			console.error(e)
		}
	}
}

const getNewSegments = function(segmentsNo, refs) {
		// We want to push the content of each Segment editor to the "neweSegments" array
		let newSegments = []
		for (var i = 0; i < segmentsNo; i++) {
			newSegments.push(refs[`segment${i}`].refs.editor.innerText)
		}
		return newSegments
}