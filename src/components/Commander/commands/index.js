export default {
	toggleCommander: {
		command: "Toggle Commander",
		shortcut: {
			ctrlKey: true,
			altKey: true,
			shiftKey: false,
			mainKeyCode: 80,
			mainKey: "P",
		},
		handler: function (e) {
			this.refs.root.classList.toggle('active')
			document.body.classList.toggle('inactive')
		}
	},
	save: {
		command: "Save",
		shortcut: {
			altKey: false,
			ctrlKey: true,
			shiftKey: true,
			mainKeyCode: 83,
			mainKey: "S"
		},
		description: "Save all the fiddles",
			handler: function() {
				this.props.saveSegments()
			}
	},
	addSegment: {
		command: "Add Segment",
		shortcut: {
			altKey: true,
			ctrlKey: true,
			shiftKey: false,
			mainKeyCode: 65,
			mainKey: "A"
		},
		description: "Add a segment",
		handler: function() {
			this.props.addSegment()
		}
	},
	evalSegment: {
		command: "Eval Segment",
		shortcut: {
			altKey: false,
			ctrlKey: true,
			shiftKey: false,
			mainKeyCode: 13,
			mainKey: "Enter"
		},
		description: "Evaluates the selected segment",
		handler: function() {
			this.props.evalSegment()
		}
	}
}
	