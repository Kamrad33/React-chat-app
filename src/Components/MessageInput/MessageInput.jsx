import React, { useState } from 'react';
import './MessageInput.css';

import Arrow from '../../arrow.svg';
import ReactSVG from 'react-svg';

export default function MessageInput(props) {
  const { sendMessage } = props;
  const [text, setText] = useState('');

  function handleSubmin(e) {
    e.preventDefault();

    const newText = text.trim();

    if (newText === '') return;

    sendMessage(newText);
    setText('');
  }

  return (
    <form onSubmit={handleSubmin} className="message-input__form">
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        className="input-text"
        placeholder="Написать сообщение"
        maxLength="500"
        autoFocus
      />
      <button className="message-send">
        <ReactSVG src={Arrow} svgClassName="message-send__icon"/>
      </button>
    </form>
  );
}
