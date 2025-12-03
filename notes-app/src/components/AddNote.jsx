import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import { useNotes } from "../context/NotesContext";

export default function AddNote() {
    const { openAddModal, setOpenAddModal,handleSave,handleTitle,handleContent,NoteContent,total} = useNotes();
    
    return (
        <Modal show={openAddModal} onClose={() => setOpenAddModal(false)}>
            <ModalHeader>Note</ModalHeader>
            <ModalBody>
                <div className='flex justify-between items-center mb-3'>
                    <input type="text" placeholder='Enter the Title' className='border-0 p-2 w-full bg-gray-400' onChange={handleTitle} />
                </div>
                <textarea placeholder='Type to Add a note' rows={5} className='border-0 p-2 w-full bg-gray-400 resize-none' onChange={handleContent}></textarea>
                <div className='flex items-center justify-between'>
                    <p>{total - NoteContent.length} Remaining</p>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button onClick={handleSave}>Save</Button>
                <Button color="alternative" onClick={() => setOpenAddModal(false)}>
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>
    )
}
