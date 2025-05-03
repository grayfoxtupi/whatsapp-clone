import { useEffect } from "react";
import useAuthStore from "../hooks/useAuthStore";
import useChatStore from "../hooks/useChatStore";
import Message from "./Message";
import TextInput from "./TextInput"
import ChatMessage from "./ChatMessage";

function Chat() {
    const selectedUser = useChatStore(store => store.selectedUser);
    const getMessages = useChatStore(store => store.getMessages);
    const authUser = useAuthStore(store => store.authUser)
    const messages = useChatStore(store => store.messages)
    const message = useChatStore(store => store.message)

    const load = async () => {
        console.log("selected user ", selectedUser);
        await getMessages(selectedUser)
    }

    useEffect(() => {
        load()
    }, [selectedUser]); // Runs when selectedUser changes

    useEffect(() => {
        console.log("Messages: ", messages)
    }, [messages])

    useEffect(() => {
        console.log("check user: ", selectedUser)
    })

    return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-base-200">
        {selectedUser ? (
            <div className="flex flex-col h-full justify-between">
                {/* Messages Container */}
                <div className="flex flex-col flex-grow overflow-y-auto bg-base-300 min-h-0">
                    {messages ? (
                        Object.entries(messages)
                            .filter(([id, messages]) => id === selectedUser)
                            .map(([id, messages]) =>
                                messages.map((message) => (
                                    <Message 
                                        key={message._id} 
                                        userId={authUser?._id} 
                                        messageUserId={message.userId} 
                                        text={message.text} 
                                        timestamp={message.timestamp} 
                                    />
                                ))
                            )
                    ) : (
                        <div>Macaco preto {console.log(messages)}</div>
                    )}
                </div>

                {/* Input Field */}
                <div className="p-4 bg-white shadow-md">
                    <TextInput value={message}  placeholder="Digite algo..." type="text" />
                </div>
            </div>
        ) : (
            <ChatMessage
            title={"Download my app now !"}
            subtitle={"Download my app to make me happier. It's the best in the world !"}
          />
        )}
    </div>

    );
    }

export default Chat;
