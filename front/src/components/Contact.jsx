import React from 'react'
import useAuthStore from '../hooks/useAuthStore'
import useChatStore from '../hooks/useChatStore'

function Contact({ id, profilepic, fullname }) { // ✅ Correct destructuring
    const onlineUsers = useAuthStore(store => store.onlineUsers)
    const setSelectedUser = useChatStore(store => store.setSelectedUser)
    const selectedUser = useChatStore(store => store.selectedUser)

    return (
        <button 
            className="flex flex-row justify-start w-full  items-center p-2 rounded-lg transition-all duration-300 ease-in-out hover:bg-base-300 hover:bg-opacity-50"
            onClick={async () => {
                if(selectedUser?._id !== id || !selectedUser){
                await setSelectedUser(id)
                console.log(selectedUser)
                }
            }}
        >
            <img src={profilepic || "/avatar.png"} alt={fullname} className="w-10 h-10 rounded-full" />
            <div className="flex flex-col justify-center items-start ml-2">
                <p className="font-bold text-sm">{fullname}</p>
                {onlineUsers?.map(user => user._id).includes(id) ? <p>Online</p> : <p>Offline</p>}
            </div>
        </button>

    )
}

export default Contact
