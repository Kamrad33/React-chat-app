import React, { useRef, useEffect, useState } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import './MessageList.css';

import ReactSVG from 'react-svg';
import Arrow from '../../arrow.svg';
import Message from '../../Components/Message/Message';
const Msg = React.memo(Message);

export default function MessageList(props) {
  const messages = props.messages;
  const isFirstRender = usePrevious(messages, []).length < 1;
  const list = useRef(null);
  const [showBtn, setShowBtn] = useState(false);

  useEffect(() => {
    const el = getLastInList();

    if (!el) return;

    const top = el.getBoundingClientRect().top;
    const scrollHeight = list.current.clientHeight;
    const offset = top - scrollHeight;

    if (offset < 250 || isFirstRender) {
      el.scrollIntoView();
    }
  }, [messages]);

  function getLastInList() {
    return list.current.querySelector('.message-list__content>:last-child');
  }

  function handleScroll(e) {
    const list = e.target;
    const el = getLastInList();

    if (!el) return;

    const top = el.getBoundingClientRect().top;
    const scrollHeight = list.clientHeight;
    const offset = top - scrollHeight;

    if (offset > 250 && !showBtn) {
      setShowBtn(true);
    } else if (offset <= 250 && showBtn) {
      setShowBtn(false);
    }
  }

  return (
    <div className="message-list" ref={list} onScroll={handleScroll}>
      <TransitionGroup className="message-list__content">
        {messages.map(el => (
          <CSSTransition
            classNames={isFirstRender ? '' : 'appear'}
            timeout={{ enter: 300, exit: 0 }}
            key={el.id}>
            <Msg {...el} />
          </CSSTransition>
        ))}
      </TransitionGroup>
      {showBtn ? (
        <button
          className="to-bottom"
          onClick={() =>
            getLastInList().scrollIntoView({ behavior: 'smooth' })
          }>
          <ReactSVG src={Arrow} svgClassName="to-bottom__arrow" />
        </button>
      ) : null}
    </div>
  );
}

function usePrevious(value, defaultVal = null) {
  const ref = useRef(defaultVal);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
