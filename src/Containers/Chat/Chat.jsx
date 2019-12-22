import React, { useState, useEffect, useContext } from 'react';
import './Chat.css';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import Container from '../Container/Container';
import Header from '../../Components/Header/Header';
import MessageList from '../MessageList/MessageList';
import UsersList from '../MessageList/UsersList';
import MessageInput from '../../Components/MessageInput/MessageInput';

import { SocketContext } from '../../App';

const useStyles = makeStyles({
  root: {

  },
});

export default function Chat(props) {

  const classes = useStyles();
  const [expanded, setExpanded] = React.useState([]);

  const handleChange = (event, nodes) => {
    setExpanded(nodes);
  };


//  const { logout, user, userCount } = props;
const { logout, user, userCount} = props;
//const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
const [users, setUsersList] = useState();
  const socket = useContext(SocketContext);

  function addMessage(message) {

    setMessages(m => {
      if (m.length < 100) return [...m, message];
      console.log("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF__________________________", message);
      return [...m.slice(m.length - 99, m.length), message];
    });
  }

/*  function addOnlineUser(online) {

    setUsers(m => {
      if (m.length < 100) return [...m, online];

      return [...m.slice(m.length - 99, m.length), online];
    });
  }*/

  function handleSendMessage(text) {
    const newMessage = {
      text,
    };

    socket.emit('message', newMessage);

    newMessage.user = user;
    newMessage.userId = socket.id;
    newMessage.date = new Date();
    newMessage.id = messages[messages.length - 1].id + 1;
    addMessage(newMessage);
  }


/*  function handleOnline(onlines) {
    const newUser = {
      onlines,
    };

    socket.on('user:list', newUser);

    newUser.user = user;

    addOnlineUser(newUser);
  }*/

  useEffect(() => {
      socket.emit('user:list', setUsersList);
    if (!socket) return;
    socket.on('message', data => addMessage(data));
    socket.on('user:connect', data => setMessages(data));

    //   console.log("ADD USER___________________________", setUsersList)
    //socket.on('user:list', onUsers => addOnlineUser(onUsers) )
    return () => {
      socket.off('message');
      socket.off('user:connect');

    };
  }, [socket]);

  return (
    <>
      <Header logout={logout} userCount={userCount} />
      <TreeView
           className={classes.root}
           defaultCollapseIcon={<ExpandMoreIcon />}
           defaultExpandIcon={<ChevronRightIcon />}
           expanded={expanded}
           onNodeToggle={handleChange}
         >
      <TreeItem nodeId="1" label= "ОНЛАЙН">

      <Container>
      <div>ЮЗЕРЫ:
      <Container>
       {setUsersList}
         <UsersList messages={messages} />
      </Container>
      </div>
      </Container>
      </TreeItem>

  </TreeView>
      <Container className="chat-container">
        <MessageList messages={messages} />
        <MessageInput sendMessage={handleSendMessage} />
      </Container>
    </>
  );
}
