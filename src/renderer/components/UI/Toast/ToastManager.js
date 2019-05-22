import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components
import Toast from './Toast';

// CSS, Requires
import "./ToastManager.scss";

class ToastManager extends React.Component {
  static propTypes = {
    messages: PropTypes.array,

    onMessagesUpdate: PropTypes.func,
  };

  static defaultProps = {
    messages: [],
    onMessagesUpdate: () => {}
  };

  state = {
    messages: [],
    internalId: 0
  };

  componentDidMount() {
    this.createPortalMount();
  }

  componentDidUpdate(oldProps) {
    if (this.props.messages.length) {
      const messages = this.state.messages.slice();
      this.setState({
        messages: messages.concat(this.prepareMessages(this.props.messages))
      });

      this.props.onMessagesUpdate([]);
    }
  }

  prepareMessages(messages) {
    let internalId = this.state.internalId;

    const newMessages = messages.map(m => {
      if ('id' in m) {
        return m;
      }

      internalId++;

      return {
        ...m,
        id: internalId
      };
    });

    this.setState({
      internalId
    });

    return newMessages;
  }

  createPortalMount() {
    this.mount = document.querySelector(`.ui-toastmanager`);
    if (!this.mount) {
      const el = document.createElement('div');
      el.classList.add('ui-toastmanager');
      document.body.appendChild(el);

      this.mount = el;
    }
  }

  onFinished = (id) => {
    const messages = this.state.messages.slice();

    messages.splice(messages.findIndex(m => m.id === id), 1);

    this.setState({ messages });
  }

  renderToasts(messages) {
    if (!messages) {
      return null;
    }

    return messages.map(m => {
      return <Toast key={m.id} onFinished={this.onFinished} {...m}/>;
    });
  }

  render() {
    const { messages } = this.state;

    if (!this.mount) {
      return null;
    }

    return ReactDOM.createPortal(
      this.renderToasts(messages),
      this.mount
    );
  }
}

export default ToastManager;
