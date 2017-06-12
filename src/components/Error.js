import React, {Component} from 'react'

export default class ErrorMessage extends Component {
  render() {
    return (
      <div className="error" onClick={e => this.deleteError(e.target)}>
        {this.props.children}
      </div>
    )
  }

  deleteError(el) {
    el.classList.add("deleted")
    setTimeout(() => {
      if (el)
        el.remove()
    }, 301)
  }
}
