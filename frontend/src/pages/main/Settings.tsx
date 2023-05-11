import React, { useEffect, useState } from 'react'
import Navbar from '../../components/design/Navbar'
import Setting2FA from '../../components/settings/Setting2FA'
import SettingProfile from '../../components/settings/SettingProfile'
import { tokenForm } from '../../interfaceUtils'
import { getSessionsToken } from '../../sessionsUtils'
import Loading from '../../components/utils/Loading'
import { useNavigate } from 'react-router-dom'

type Props = {
  token: string;
}

const Settings = ({token}: Props) => {

  if (!token)
    return <Loading />
  else
  {
    return (
      <div className='app bg-gradient-to-tl from-violet-900 via-black to-black w-full'>
      <div className="bg-black flex justify-center items-center px-6 sm:px-16 border-b-2 border-violet-900">
        <div className="xl:max-w-[1280px] w-full">
          <Navbar />
        </div>
      </div>

      <div className="flex justify-evenly">
        <div className='bg-violet-900 w-[1000px] rounded-lg m-5'>
          <div className='text-center text-white text-3xl p-3 m-2'>
            <h2>User Settings</h2>
          </div>
          <hr className='w-auto h-1 mx-5 my-2 border-0 rounded dark:bg-gray-900'/>
          <div className='bg-violet-700 rounded-lg m-5'>
            <div className='grid grid-cols-2 items-center p-5'>
              <div className='text-center mx-auto'>
                <SettingProfile item={{ accessToken: token }}/>
              </div>
              <div className='text-center mx-auto'>
                <Setting2FA item={{ accessToken: token }} />
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
    )
  }
}

export default Settings