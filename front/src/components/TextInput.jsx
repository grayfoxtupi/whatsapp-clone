import { useState } from "react";
import useAuthStore from "../hooks/useAuthStore";
import useChatStore from "../hooks/useChatStore";
import { Send } from 'lucide-react';

function TextInput({ value, placeholder = "Digite algo...", type = "text" }) {
    const [input, setInput] = useState('')

    const sendMessage = useChatStore(store => store.sendMessage)

    const handleInputChange = (e) => {
        setInput(e.target.value)
    }

    const sendInputMessage = async () => {
        try{

            if(input)
                console.log("MMs: ", input)
                const response = await sendMessage({ text: input }) // ✅ Send as object
                console.log("LET me see: ", response)

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
        } finally {
            setInput('')
        }
    }

    return (
        <div className="flex flex-col justify-end items-start">
            <div className="flex flex-row">
                <input 
                    type={type} 
                    value={input} 
                    onChange={(e) => handleInputChange(e)}
                    placeholder={placeholder}
                    className="input"
                />
                <button onClick={() => {sendInputMessage()}}> <Send /> </button>
            </div>
        </div>
    );
}

export default TextInput