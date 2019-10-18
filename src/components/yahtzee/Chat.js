import React from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';

import './chat.css';

const Message = ({ message, playerName, mine }) => {
  return <div className="message-container">
    <div className={'message-inner' + (mine ? ' mine' : '')}>
      {mine || <div className="icon">{playerName[0]}</div>}
      <div className="message">
        {message}
      </div>
      {mine && <div className="icon">{playerName[0]}</div>}
    </div>
  </div>;
};

export default class Chat extends React.Component {
  state = { message: '' }

  componentDidMount() {
    this.ref = React.createRef();
  }

  componentDidUpdate() {
    this.ref.current.scrollTop = this.ref.current.scrollHeight;
  }

  handleChange = (e) => {
    this.setState({ message: e.target.value });
  }

  sendMessage = () => {
    if (this.state.message === '') {
      return;
    }
    this.props.wsClient.send(
      JSON.stringify({ type: 'postMessage', message: this.state.message })
    );
    this.setState({ message: '' });
  }

  onKeyUp = (e) => {
    if (e.keyCode === 13) {
      this.sendMessage();
    }
  }

  render() {
    return <>
      <div className="chat" ref={this.ref}>
        {this.props.chat.length === 0 && <div
          style={{ padding: 10 }} className="text-muted">
          Soyez le premier à envoyer un message.
        </div>}
        {this.props.chat.map((e, i) => {
          let myName = this.props.players.find(p => p.id === this.props.me).name;
          return <Message key={i} {...e} mine={myName === e.playerName} />;
        })}
      </div>
      <div className="chat-form">
        <InputGroup>
          <FormControl type="text" value={this.state.message}
            onChange={this.handleChange}
            onKeyUp={this.onKeyUp} />
          <InputGroup.Button>
            <Button onClick={this.sendMessage}>Envoyer</Button>
          </InputGroup.Button>
        </InputGroup>
      </div>
    </>;
  }
}
