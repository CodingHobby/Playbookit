import React, {Component} from 'react'

import PlaybookPreview from './PlaybookPreview'

import './styles/Dashboard.css'

export default class Profile extends Component {
  render() {
    return (
      <div className="dashboard">
        <h1>{this.props.owner.displayName || this.props.owner.email}</h1>
        {this.props.editable
          ? this.renderEditable()
          : this.renderNonEditable()}
      </div>
    )
  }

  renderNonEditable() {
    return (
      <h1>Non editable</h1>
    )
  }

  renderEditable() {
    return (<PlaybookPreview owner={this.props.owner.displayName} title="Title" editable/>)
  }
}
