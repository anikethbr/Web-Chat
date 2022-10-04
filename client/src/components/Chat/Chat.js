import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useSearchParams } from 'react-router-dom';

import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import TextContainer from "../TextContainer/TextContainer.js";

import './Chat.css';

const ENDPOINT = 'https://web-chat-application0.herokuapp.com/';

let socket;

const Chat = () => {
  let [name, setName] = useState('');
  let [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    name = searchParams.get("name");
    room = searchParams.get("room");

    socket = io(ENDPOINT, {
      cors: {
        origin: ENDPOINT,
        credentials: true
      }, transports: ['websocket']
    });

    setRoom(room);
    setName(name)

    socket.emit('join', { name, room }, (error) => {
      if (error) {
        alert(error);
      }
    });
  }, [ENDPOINT, searchParams]);

  useEffect(() => {
    socket.on('message', message => {
      setMessages(messages => [...messages, message]);
    });

    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  }

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
      <TextContainer users={users} />
    </div>
  );
}

export default Chat;