import { checkUser } from '@/lib/checkUser'
import React from 'react'

const Navbar = async () => {
    const user = await checkUser()

  return (
    <div>Navbar</div>
  )
}

export default Navbar