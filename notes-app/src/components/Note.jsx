import React from 'react'
import { MdDeleteForever } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { MdPushPin } from "react-icons/md";
import { MdOutlinePushPin } from "react-icons/md";
import { MdArchive } from "react-icons/md";
import { MdOutlineArchive } from "react-icons/md";
import { useNotes } from '../context/NotesContext';
import { MdRestore } from "react-icons/md";
import EditNote from './EditNote';


export default function Note({ Note }) {
  const { openEditModal, toggleTrash, handleEditNote, togglePin, toggleArchive, handleRestore } = useNotes();
  return (
    <div className='flex flex-col justify-between bg-gray-200 rounded-2xl p-3 mb-3 min-w-[200px] shadow-xl '>
      <div>
        <div className='flex items-center justify-between'>
          <h1 className='font-semibold text-2xl'>{Note.title}</h1>
          <div className='flex items-center'>
            {!Note.trashed && (Note.archived ? (
              <MdArchive
                size={30}
                onClick={() => toggleArchive(Note.id)}
                className="cursor-pointer"
              />
            ) : (
              <MdOutlineArchive
                size={30}
                onClick={() => toggleArchive(Note.id)}
                className="cursor-pointer"
              />
            ))}

            {!Note.trashed && !Note.archived && (Note.pinned ? (
              <MdPushPin
                size={30}
                onClick={() => togglePin(Note.id)}
                className="cursor-pointer"
              />
            ) : (
              <MdOutlinePushPin
                size={30}
                onClick={() => togglePin(Note.id)}
                className="cursor-pointer"
              />
            ))}
          </div>

        </div>

        <p className='min-h-[50px] mt-2 text-wrap text-xl'>{Note.content}</p>
      </div>
      <div className='flex items-center justify-between '>
        <p className='font-semibold'>{Note.date}</p>
        <div className='flex gap-x-2 text-2xl '>
          {!Note.trashed && <MdEdit onClick={() => handleEditNote(Note)} />}
          {Note.trashed && <MdRestore onClick={() => handleRestore(Note)} />}
          {openEditModal && <EditNote Note={Note} />}
          <MdDeleteForever onClick={() => toggleTrash(Note)} />

        </div>
      </div>
    </div>
  )
}
