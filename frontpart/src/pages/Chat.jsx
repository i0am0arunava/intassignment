
import styled from "styled-components"
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { allUsersRoute,host } from "../utils/APIRoutes";
import axios from "axios";
import Contacts from "../components/Contact";
import Welcome from "../components/welcome";
import ChatContainer from "../components/ChatContainer";
import {io} from "socket.io-client"
export default function Chat() {

const socket=useRef()

console.log("ss",socket)


    const [contacts, setContacts] = useState([]);

    const [currentChat, setCurrentChat] = useState(undefined)
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("chat-app-user")));
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            if (!localStorage.getItem("chat-app-user")) {
                navigate("/login");
            }
            console.log("hellow2")
        };

        checkUser();
    }, []);

    useEffect(() => {
        if (currentUser) {
          socket.current = io(host);
          socket.current.emit("add-user", currentUser._id);
        }
      }, [currentUser]);



    useEffect(() => {
        const fetchData = async () => {
            const userData = await JSON.parse(localStorage.getItem("chat-app-user"));
            console.log("hellow2")
            setCurrentUser(userData);
        };

        fetchData();
    }, []);

    console.log(currentUser)


    // eslint-disable-next-line no-constant-condition
    useEffect(() => {
        const fetchconta = async () => {
            if (currentUser && currentUser.isAvatarImageSet) {
                console.log("Avatar image is set. Current user:", currentUser);


                const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
                setContacts(data.data)

            } else {
                console.log("Avatar image is not set. Navigating to /setAvatar.");
                navigate("/setAvatar");
            }

        };

        fetchconta();
    }, []);


    console.log(contacts)
    const handleChatChange = (chat) => {
        setCurrentChat(chat)
    }

    return (
        <Container>

            <div className="container"><Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange} />

             {currentChat === undefined ? (
                    <Welcome   currentUser={currentUser}/>
                ) : (
                    <ChatContainer currentChat={currentChat} 
                    currentUser={currentUser} socket={socket}
                    />
                )}
               

            </div>



        </Container>
    )
}


const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #383438;
  .container {
    height: 100vh;
    width: 100vw;
    background-image: url('https://w0.peakpx.com/wallpaper/901/891/HD-wallpaper-pattern-black-dark-grey-shape-thumbnail.jpg');
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;