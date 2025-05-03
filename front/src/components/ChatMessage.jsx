import { MessageSquare } from 'lucide-react';

const ChatMessage = ({ title, subtitle }) => {
    return (
      <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
        <div className="max-w-md text-center">
          <div className='flex flex-row justify-center items-start w-full h-auto'>
            <MessageSquare size={60}/>
          </div>
          <div className='flex flex-col justify-start items-center w-full h-auto'>
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            <p className="text-base-content/60">{subtitle}</p>
          </div>
        </div>
      </div>
    );
  };
  
  export default ChatMessage;