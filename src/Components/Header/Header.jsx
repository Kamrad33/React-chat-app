import React from 'react';
import './Header.css';

import Container from '../../Containers/Container/Container';


export default function Header(props) {

  return (
    <div className="header">
      <Container className="header-container">
        <div className="header-group">
          <div>Чат</div>

          <div className="header-info" >Онлайн: {props.userCount || 1}</div>
        </div>
        <div className="header-group">
          <button className="header-btn" onClick={props.logout}>
            Выйти
          </button>
        </div>
      </Container>
    </div>
  );
}
