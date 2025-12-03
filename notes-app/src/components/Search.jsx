import React from 'react'
import { MdSearch } from "react-icons/md";
import { useNotes } from '../context/NotesContext';

export default function Search() {
  const {setSearchText}=useNotes();
  return (
    <div className='flex justify-center items-center bg-white text-black rounded-2xl px-2'>
        <MdSearch className='text-3xl'/>
        <input type="text"  placeholder='Search...' className='px-2 border-0 focus:outline-0' onChange={(event)=>{setSearchText(event.target.value)}}/>

    </div>
  )
}
