import React from 'react'

export default function InputText(props) {
  return (
    <div className='flex justify-between items-center outline-white outline-1 bg-black w-[250px] rounded-2xl px-5 text-white '>
        <input type="text" className='outline-black outline-2' placeholder='Search Movie' onChange={(e)=>props.cb(e.target.value)}
        onKeyDown={props.onSubmit} />
        <img src="/search.svg" alt="" className='w-[30px]'  />

    </div>
  )
}
