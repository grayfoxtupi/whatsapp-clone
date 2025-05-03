import { create } from 'zustand'
import useAuthStore from './useAuthStore'
import { axiosInstance } from '../libs/axios'
import toast from 'react-hot-toast'

const useChatStore = create((set, get) => ({
    messages: null,
    users: null,
    message: null,
    selectedUser: null,
    isLoadingUsers: false,
    isLoadingMessages: false,

    getUsers: async () => {
        set({isLoadingUsers: true})
        try{
            const res = await axiosInstance.get("/message/getUsersForSideBar")
            set({users: res.data})
        }catch(e){
            let errorMessage = "Erro desconhecido";

            if (e.response) {
                errorMessage = `Erro ${e.response.status}: ${JSON.stringify(e.response.data)}`;
            } else if (e.request) {
                errorMessage = "Sem resposta do servidor.";
            } else {
                errorMessage = e.message;
            }

            toast.error(errorMessage);
        }finally{
            set({isLoadingUsers: false})
        }
    },

    getMessages: async (receiverId) => {
        set({isLoadingMessages: true})
        try{
            const res = await axiosInstance.get(`/message/${receiverId}`)
            set((state) => ({
                messages: {
                    ...state.messages,
                    [receiverId]: res.data.messages
                }
            }));
            console.log(get().messages)
        }catch(e){
            let errorMessage = "Erro desconhecido";

            if (e.response) {
                errorMessage = `Erro ${e.response.status}: ${JSON.stringify(e.response.data)}`;
            } else if (e.request) {
                errorMessage = "Sem resposta do servidor.";
            } else {
                errorMessage = e.message;
            }

            toast.error(e.message);
            console.log("NOOOOOOOOO")
        } finally {
            set({isLoadingMessages: false})
        }
    },

    sendMessage: async (message) => {
        const messages = get().messages
        const selectedUser = get().selectedUser

        console.log("user on store: ", selectedUser)
        console.log("MESSAGE1 :", message.text)

        try{
            const res = await axiosInstance.post("/message/send", {
                receiverId: selectedUser,
                text: message.text,
                image: message.image
            })
            
            set({
                messages: {
                    ...messages,
                    [selectedUser]: [
                        ...(messages[selectedUser] || []),
                        res.data
                    ]
                }
            });
            
        }catch(e){
            let errorMessage = "Erro desconhecido";

            if (e.response && e.response.data && e.response.data.message) {
                errorMessage = e.response.data.message;
            } else if (e.request) {
                errorMessage = "Sem resposta do servidor.";
            } else {
                errorMessage = e.message;
            }
        
            toast.error(errorMessage);
            console.error("Erro ao enviar mensagem:", errorMessage);
        }

    },

    subscribeToMessages: () => {
        const selectedUser = get().authUser

        if(!selectedUser)
            return 

        try{
        socket.on("newMessage", () => {
        if(selectedUser.id === newMessage.senderId)
            return

        set({messages: [...get().messages, newMessage]})
        })

        }catch(e){
            let errorMessage = "Erro desconhecido";

            if (e.response && e.response.data && e.response.data.message) {
                errorMessage = e.response.data.message;
            } else if (e.request) {
                errorMessage = "Sem resposta do servidor.";
            } else {
                errorMessage = e.message;
            }
        
            toast.error(errorMessage);
            console.error("Erro ao enviar mensagem:", errorMessage);
        }
        
    }, 

    unsubscribeToMessages: () => {
        const socket = useAuthStore(store => store.socket)
        socket.off("newMessage")
    },

    setSelectedUser: (id) => {
        set({selectedUser: id})
    },

    setMessagesToNull: () => {
        set({messages: null})
    },

    setUsersToNull: () => {
        set({users: null})
    },
}))

export default useChatStore