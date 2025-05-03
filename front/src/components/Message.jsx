import { useEffect } from "react"

function Message({userId, messageUserId, text, timestamp}) {

    useEffect(() => {
        console.log("My message: ", text)
    }, [])
    
    return (
        <div className={`inline-flex flex-col ${userId === messageUserId ? 'items-start' : 'items-end'} max-w-fit p-2 rounded-lg ${userId === messageUserId ? 'bg-primary/20' : 'bg-primary/40'}`}>
            <p className="whitespace-pre-line break-words">{text}</p>
            <p className="text-xs text-gray-500 self-end">{new Date(timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}</p>
        </div>
    )

}

export default Message