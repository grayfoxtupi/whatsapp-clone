import { create } from 'zustand'
import { axiosInstance } from '../libs/axios'
import { io } from 'socket.io-client'
import useChatStore from './useChatStore'
import toast from 'react-hot-toast'

const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false, 
    isLoggingOut: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: null,
    socket: null,

    checkAuth: async () => {
        try {
            const response = await axiosInstance.get("/auth/check");
            set({ authUser: response.data });
        } catch (e) {
            let errorMessage = "Erro desconhecido";

            if (e.response) {
                errorMessage = `Erro ${e.response.status}: ${JSON.stringify(e.response.data)}`;
            } else if (e.request) {
                errorMessage = "Sem resposta do servidor.";
            } else {
                errorMessage = e.message;
            }

            //toast.error("errorMessage");
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signUp: async (data) => {
        set({ isSigningUp: true });

        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account created successfully!");
        } catch (e) {
            let errorMessage = "Erro desconhecido";

            if (e.response) {
                errorMessage = `Erro ${e.response.status}: ${JSON.stringify(e.response.data)}`;
            } else if (e.request) {
                errorMessage = "Sem resposta do servidor.";
            } else {
                errorMessage = e.message;
            }

            toast.error(errorMessage);
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
          const res = await axiosInstance.post("/auth/login", data);
          set({ authUser: res.data });
          toast.success("Logged in successfully");
        } catch (e) {
            let errorMessage = "Erro desconhecido";

            if (e.response) {
                errorMessage = `Erro ${e.response.status}: ${JSON.stringify(e.response.data)}`;
            } else if (e.request) {
                errorMessage = "Sem resposta do servidor.";
            } else {
                errorMessage = e.message;
            }

            toast.error(errorMessage);
        } finally {
          set({ isLoggingIn: false });
        }
      },

      logOut: async () => {
        try {
            await axiosInstance.post("/auth/logout")
            useChatStore.getState().setMessagesToNull()
            useChatStore.getState().setUsersToNull()
            useChatStore.getState().setSelectedUser(null)
            toast.success("User logged out successfully! ")
        } catch (e) {
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
            set({ authUser: null });
        }
    },
    

    updateProfile: async (data) => {
        set({isUpdatingProfile: true})
        try{
            const response = await axiosInstance.put("/auth/update-profile", data)
            console.log("AQUI", response)
            console.log("THERE", response.data)
            set((state) => ({ authUser: { ...state.authUser, ...updatedData } })) 
            toast.success(`Profile updated sucessfuly! ${response.data}`)
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

        }
    },

    connectSocket: async () => {
        const authUser = get().authUser
    
        if (!authUser || get().socket?.connected) return
    
        try {
            const socket = io(import.meta.env.VITE_BASE_URL, {
                query: {
                    userId: authUser.id
                }
            })
    
            socket.connect()
    
            set({ socket })
    
            socket.on('getAllUsers', (userIds) => {
                set({ onlineUsers: userIds })
            })
        } catch (error) {
            console.error("Error while connecting to socket:", error)
        }
    },
    

    disconnectSocket: async () => {
        if(get().socket?.connected){
            get().socket.disconnect()
            set({ socket: null })
        }
    }
}));

export default useAuthStore;
