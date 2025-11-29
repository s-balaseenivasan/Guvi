import React from 'react'
import InputText from './InputText'




export default function Navbar({
  cb=()=>{},
  onSubmit=()=>{}
}) {
  return (
    <div className='flex items-center justify-center md:justify-between px-5 h-[50px] w-full bg-black text-white'>
        <h1 className='hidden md:block text-3xl text-center'>Movie Search App</h1>
        <InputText cb={cb} onSubmit={onSubmit}/>
       
    </div>
  )
}
