import { useState, useEffect } from 'react'
import useAuthStore from '../hooks/useAuthStore'
import { Camera, Mail, User } from "lucide-react";

function ProfilePage() {
  const authUser = useAuthStore((store) => (store.authUser))
  const checkAuth = useAuthStore((state) => (state.checkAuth))
  const isUpdatingProfile = useAuthStore((store) => (store.isUpdatingProfile))
  const updateProfile = useAuthStore((store) => (store.updateProfile))
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if(!file) return

    const reader = new FileReader()

    reader.readAsDataURL(file)

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    }
  } 

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    
    <div className='grid lg:col-1 w-full h-screen justify-center'>
      <div className='flex flex-col w-140 h-auto justify-center items-center'>
        <div className='flex flex-col justify-center items-center w-auto h-auto font-sans pt-16'>
            <p className='text-3xl font-bold pt-1'>Profile</p>
            <p className='text-xs pt-1'>Your profile name</p>
            <div className='relative w-auto h-auto pt-2'>
            <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
            <label
              htmlFor="avatar-upload"
              className={`
                absolute bottom-0 left-0 
                w-8 h-8  /* Define um tamanho fixo */
                bg-base-content hover:scale-105
                p-1 rounded-full cursor-pointer 
                transition-all duration-200 flex items-center justify-center
              `}
            >
              <Camera className="w-5 h-5 text-base-200" />
              <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
            </label>

            </div>

            <p className='text-xs pt-1'>Click the camera icon to update the photo</p>
        </div>
        <div className='flex flex-col justify-start'>
          <div className='flex flex-col justify-center pt-7 text-xs'>
            <div>
              <div className='flex flex-row items-center gap-1'>
                  <User className="w-4 h-4"/><p>Full Name</p>
              </div>
              <input type="text" placeholder={authUser.fullname} className="input w-90 " disabled />
            </div>

            <div>
              <div className='flex flex-row items-center gap-1'>
                  <User className="w-4 h-4"/><p>Email</p>
              </div>
              <input type="text" placeholder={authUser.email} className="input w-90" disabled />
            </div>

          </div>
          <div className='flex flex-col pt-7'>
                <div className='flex flex-row gap-4 text-2 font-bold'> 
                  <p>Account Information</p> 
                </div>
                <div className='flex flex-row justify-between text-xs border-b-1 border-b-gray-800'>
                  <p>Member Since</p> 
                  <p>{new Date(authUser.createdAt).toLocaleDateString("pt-BR")}</p>
                </div>
                <div className='flex flex-row justify-between text-xs pt-2'>
                  <p>Account status</p>
                  <p>{authUser ? <p> Active </p> : <p> Inactive</p>}</p>
                </div>
                
                
          </div>
          </div>
      </div>
    </div>
    
  )
}

export default ProfilePage