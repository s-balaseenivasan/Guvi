import React from 'react'
import { useNotes } from '../context/NotesContext';
import Note from '../components/Note';

export default function ArchivePage() {
  const { View, sortedNotes } = useNotes();
  let filteredNotes = sortedNotes.filter(note => note.archived && !note.trashed);
  return (
    <>
      <div className={`${View === 'list' ?
        'flex flex-col' :
        'grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2'}`}>
        {filteredNotes.map((note, index) => (<Note key={note.id} Note={note} />))}
      </div>
    </>
  )
}
