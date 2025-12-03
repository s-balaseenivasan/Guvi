import React from 'react'
import { useNotes } from '../context/NotesContext';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";

export default function EditNote() {
const { openEditModal, setOpenEditModal,handleSave,handleTitle,handleContent,NoteContent,NoteTitle,total} = useNotes();
  return (
    <Modal show={openEditModal} onClose={() => setOpenEditModal(false)}>
            <ModalHeader>Note</ModalHeader>
            <ModalBody>
                <div className='flex justify-between items-center mb-3'>
                    <input type="text" placeholder='Enter the Title' className='border-0 p-2 w-full bg-gray-400' onChange={handleTitle} value={NoteTitle}/>
                </div>
                <textarea placeholder='Type to Add a note' rows={5} className='border-0 p-2 w-full bg-gray-400 resize-none' onChange={handleContent} value={NoteContent}></textarea>
                <div className='flex items-center justify-between'>
                    <p>{total - NoteContent.length} Remaining</p>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button onClick={handleSave}>Save</Button>
                <Button color="alternative" onClick={() => setOpenEditModal(false)}>
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>
  )
}
