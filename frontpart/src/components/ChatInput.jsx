/* eslint-disable react/prop-types */
import  { useEffect, useState,useContext } from 'react';
import styled from "styled-components";
import Picker from "emoji-picker-react";
import { IoMdSend } from "react-icons/io";
import { ThemeContext } from "../context/theme";
import { BsEmojiSmileFill } from "react-icons/bs";

const ChatInput = ({handleSendMsg,currentChat,socket,currentUser}) => {

  const currentTheme = useContext(ThemeContext)
  console.log("usecon",currentTheme)
    const [msg, setMsg] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [type, settype] = useState(false);
    const handleEmojiPickerhideShow = () => {
      setShowEmojiPicker(!showEmojiPicker);
    };
  
    const handleEmojiClick = (event) => {
     
      let message = msg;
      message += event.emoji;
      setMsg(message);
    };
  
   
const setMsgg=(event)=>{
  console.log("event",event)
  setMsg(event.target.value)
}







  const sendChat = (event) => {
   
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };
  const handleKeyDown = () => {
   
     
      socket.current.emit("typingModeOn", {
        head: "typing",
        to: currentChat._id,
        from:currentUser._id
      });
    
  };

  const handleKeyUp = () => {
   
    setTimeout(() => {
      socket.current.emit("typingModeOff", {
        head: "notyping",
        to: currentChat._id
      });
    }, 800); 
      
   
  };
  useEffect(() => {
    if (socket.current) {
      socket.current.on("typingrecieve", (msg,from,to) => {
        currentTheme.setTheme({theme:true,from:from,to:to})
      });
    }
  }, []);
  useEffect(() => {
    if (socket.current) {
      socket.current.on("typingrecieveoff", (msg) => {
        currentTheme.setTheme(false)
      });
    }
  }, []);

  return (
    <Container>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
          {showEmojiPicker && <Picker className="emoji-picker" onEmojiClick={handleEmojiClick} />}
        </div>
      </div>
      <form className='input-container' onSubmit={(event) => sendChat(event)}>
       <input type="text" placeholder="type our message"
       
       onChange={(e) => setMsgg(e)}
       onKeyDown={handleKeyDown}
       onKeyUp={handleKeyUp}
       value={msg}
       
       />
       <button type="submit">
            <IoMdSend />
          </button>
      </form>
      
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 5% 95%;
  background-color: #080420;
  padding: 0 2rem;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0 1rem;
    gap: 1rem;
  }
  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;
    .emoji {
      position: relative;
      svg {
        font-size: 1.5rem;
        color: #ffff00c8;
        cursor: pointer;
      }
      .emoji-picker-react {
        position: absolute;
        top: -350px;
        background-color: #080420;
        box-shadow: 0 5px 10px #9a86f3;
        border-color: #9a86f3;
        .emoji-scroll-wrapper::-webkit-scrollbar {
          background-color: #080420;
          width: 5px;
          &-thumb {
            background-color: #9a86f3;
          }
        }
        .emoji-categories {
          button {
            filter: contrast(0);
          }
        }
        .emoji-search {
          background-color: transparent;
          border-color: #9a86f3;
        }
        .emoji-group:before {
          background-color: #080420;
        }
      }
    }
  }
  .input-container {
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: #ffffff34;
    input {
      width: 90%;
      height: 60%;
      background-color: transparent;
      color: white;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;

      &::selection {
        background-color: #9a86f3;
      }
      &:focus {
        outline: none;
      }
    }
    button {
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #9a86f3;
      border: none;
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.3rem 1rem;
        svg {
          font-size: 1rem;
        }
      }
      svg {
        font-size: 2rem;
        color: white;
      }
    }
  }
  .emoji-picker {
    position: absolute;
    bottom: 50px;
    background-color: #080420;
    box-shadow: 0 5px 10px #9a86f3;
    border-color: #9a86f3;
  }
 .t-1 {
    position: fixed;
    top: 0;
    width: 100%;
    text-align: center;
    background-color: #080420;
    color: white;
    padding: 10px;
    z-index: 999;
  }
`;

export default ChatInput;
