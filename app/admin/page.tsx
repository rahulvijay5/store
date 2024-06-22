import AdminDashboard from '@/components/AdminDashboard'
import { allowedMails } from '@/lib/constants'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React from 'react'

const page = async () => {
  const user = await currentUser()
  const cmail = user?.emailAddresses[0].emailAddress

  if(cmail && allowedMails.includes(cmail)){
    return (
      <div className='mt-4'>
          <AdminDashboard/> 
      </div>
    )
  }else{
    console.log("Hello")
    redirect("/")
  }
}

export default page