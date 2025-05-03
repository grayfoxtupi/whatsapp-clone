import { useEffect } from 'react'
import ChatSidebar from '../components/ChatSidebar';
import Chat from '../components/Chat';
import useAuthStore from '../hooks/useAuthStore';

function HomePage() {
  const authUser = useAuthStore(store => store.authUser)

  useEffect(() => {
    if(!authUser)
      window.location.reload()
  }, [authUser])

  return (
    <div className='flex flex-row justify-center items-start h-full w-full bg-slate-950'>
      <div className="flex flex-row h-full w-300 bg-base-100">
        <ChatSidebar />
        <Chat />
      </div>
    </div>
  );
}

export default HomePage;
