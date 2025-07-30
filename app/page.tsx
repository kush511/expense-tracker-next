import Guest from '@/components/Guest';
import { currentUser } from '@clerk/nextjs/server'
import React from 'react'

const HomePage = async() => {
  const user = await currentUser();
if(!user){
  return <Guest/>
}

  return (
    <div>HomePage</div>
  )
}

export default HomePage