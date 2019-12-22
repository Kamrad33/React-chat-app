import React, { useContext } from 'react';
import './Message.css';

import { SocketContext } from '../../App';

const colors = [
  '#EF5350',
  '#AB47BC',
  '#9CCC65',
  '#66BB6A',
  '#E91E63',
  '#FF5722',
  '#3F51B5',
  '#03A9F4',
];

function getRandomColor(str) {
  let sum = 0;
  const PRIME = 31;

  for (let char of str) {
    sum = (sum * PRIME + char.charCodeAt(0)) % colors.length;
  }
  return colors[sum];
}

export default function Message(props) {
  const { user, text, userId, type } = props;
  const date = props.date ? new Date(props.date) : new Date();

  const socket = useContext(SocketContext);

  const color = getRandomColor(userId);

  const style = {
    color,
    backgroundColor: type === 'info' ? 'transparent' : color,
  };

  if (type === 'info') {
    return (
      <div className="notify" style={style}>
        {text}
      </div>
    );
  }

  const isOwner = socket.id === userId;
  style.alignSelf = isOwner ? 'flex-end' : 'flex-start';

  return (
    <div className="message" style={style}>
      <div className="message__info">
        <span className="message__userinfo">{user}</span>
        <span>{date.toLocaleTimeString()}</span>
      </div>
      <div className="message__text">{text}</div>
    </div>
  );
}
