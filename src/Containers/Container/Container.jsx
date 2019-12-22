import React from 'react';
import './Container.css';

export default function Container(props) {
  const className = props.className;
  let classNames = 'container';
  if (className) classNames += ` ${className}`;

  return <div className={classNames}>{props.children}</div>;
}
