/* eslint-disable react/prop-types */
import {useContext} from "react";
import React, { useEffect, useState, useRef } from 'react';
import { ThemeContext } from "../context/theme";
import styled from "styled-components"
import Logout from "./Logout";
import axios from "axios";
import ChatInput from "./ChatInput";
import { recieveMessageRoute, sendMessageRoute } from "../utils/APIRoutes";
import { v4 as uuidv4 } from "uuid";
const ChatContainer = ({ currentChat, currentUser, socket }) => {
  const currentTheme = useContext(ThemeContext)
  const [messags, setMessages] = useState([])
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();
  const handleSendMsg = async (msg) => {


    socket.current.emit("send-msg", {
      from: currentUser._id,
      to: currentChat._id,
      message: msg,
    });


    await axios.post(sendMessageRoute, {
      from: currentUser._id,
      to: currentChat._id,
      message: msg,
    });
    const msgs = [...messags];
    msgs.push({ fromSelf: true, me: currentUser._id, you: currentChat._id, message: msg });
    setMessages(msgs);
  }

  useEffect(() => {
    const messager = async () => {
      const response = await axios.post(recieveMessageRoute, {
        from: currentUser._id,
        to: currentChat._id
      })
      setMessages(response.data)
    };

    messager();
  }, [currentChat]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg, from, to) => {
        setArrivalMessage({ fromSelf: false, me: from, you: to, message: msg });
      });
    }
  }, []);


  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);


  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messags]);


  console.log("mmmm", messags)

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
              alt=""
            />
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
            {currentTheme.theme && currentTheme.from === currentChat._id ? (
              <div className='typing'>typing...</div>
            ) : (
              <div ></div>
            )}
          </div>
        </div>
        <Logout currentUser={currentUser} currentChat={currentChat} />
      </div>
      <div className="chat-messages">
        {messags.map((message) => {
          if ((message.me === currentUser._id && message.you === currentChat._id) || (message.you === currentUser._id && message.me === currentChat._id)) {
            return (
              <div ref={scrollRef} key={uuidv4()}>
                <div
                  className={`message ${message.fromSelf ? "sended" : "recieved"
                    }`}
                >
                  <div className="content ">
                    <p>{message.message}</p>
                  </div>
                </div>
              </div>
            );
          }
        })}
      </div>

      <ChatInput handleSendMsg={handleSendMsg} currentChat={currentChat} socket={socket} currentUser={currentUser} />

    </Container>
  );
};
const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    background-color:#010d01;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
        .typing {
          color:#4ee334;
          left: 90px;
          margin-top:3px;
          font-size: 20px; /* Set the font size */
  /* Set the font weight */
  /* Set the font style */
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #021a02;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color:#020621;
       
      }
    }
  }
`;

export default ChatContainer;
