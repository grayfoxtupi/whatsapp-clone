import { useState, useEffect } from "react";
import { Users } from "lucide-react";
import useAuthStore from '../hooks/useAuthStore'
import useChatStore from "../hooks/useChatStore";
import Contact from "./Contact";

function ChatSidebar() {
  const user = useAuthStore(store => store.authUser);
  const onlineUsers = useAuthStore(store => store.onlineUsers);
  const getUsers = useChatStore(store => store.getUsers);
  const users = useChatStore(store => store.users);
  const message = useAuthStore(store => store.message)

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      await getUsers();
    };

    fetchUsers();
  }, []); // ✅ Ensures effect runs correctly

  return (
    <div className="flex flex-col justify-start items-start w-100 h-full">
      <div className="w-auto h-auto flex flex-col justify-start items-start">
        <div className="w-auto h-auto flex flex-row pl-4 text-lg">
          <Users className="size-6" />
          <p className="pl-2">{user?.fullname}</p> {/* ✅ Prevents crash if user is null */}
        </div>
        <div className="w-auto h-auto flex flex-row pl-4 text-xs items-center">
          <input
            type="checkbox"
            checked={showOnlineOnly}
            onChange={(e) => setShowOnlineOnly(e.target.checked)}
            className="checkbox checkbox-sm"
          />
          <span className="pl-2">Show online {onlineUsers?.length || 0}</span>
        </div>
      </div>
      <div className="flex flex-col w-full justify-start items-start overflow-y-auto">
        {users && users.length > 0 ? (
          users
            .map((u) => (
              <Contact key={u._id} id={u._id} profilepic={u.profilePic} fullname={u.fullname} />
            ))
        ) : (
          console.log("MACAAAAAAAAAAAAAAAAAACO") || null
        )}
      </div>
    </div>
  );
}

export default ChatSidebar;
