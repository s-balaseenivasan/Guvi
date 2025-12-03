import { createContext, useContext, useEffect, useState } from "react";
import { nanoid } from "nanoid";

const NotesContext = createContext();
export const useNotes = () => useContext(NotesContext);

export const NotesProvider = ({ children }) => {
    const [NoteTitle, setNoteTitle] = useState('');
    const [NoteContent, setNoteContent] = useState('');
    const [View, setView] = useState('list');
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);

    const [currentNoteId, setCurrentNoteId] = useState(null);
    const [SearchText, setSearchText] = useState('');

    const total = 200;


    const [Notes, setNotes] = useState(() => {
        return JSON.parse(localStorage.getItem("notes-app")) || [];
    });
    useEffect(() => {
        localStorage.setItem("notes-app", JSON.stringify(Notes));
    }, [Notes]);

    function createNote() {
        const date = new Date().toLocaleDateString();
        const NewNote = {
            id: nanoid(),
            title: NoteTitle,
            content: NoteContent,
            date: date,
            trashed: false,
            pinned: false,
            archived: false
        }
        return NewNote;

    }


    function handleTitle(e) {
        setNoteTitle(e.target.value);
    }
    function handleContent(e) {
        if (total - e.target.value.length >= 0) {
            setNoteContent(e.target.value);

        }
    }
    function handleSave() {
        if (currentNoteId) {
            setNotes(prevNotes =>
                prevNotes.map(n =>
                    n.id === currentNoteId ? { ...n, title: NoteTitle, content: NoteContent } : n
                )
            );
            setOpenEditModal(false);
            setCurrentNoteId(null);

        }
        else {
            const newNote = createNote();
            if (newNote.title !== "") {
                setNotes([...Notes, newNote]);
            }
            setOpenAddModal(false);

        }
        setNoteTitle("");
        setNoteContent("");
    }


    function handleEditNote(note) {
        setCurrentNoteId(note.id);
        setNoteTitle(note.title);
        setNoteContent(note.content);
        setOpenEditModal(true);
    }

    function togglePin(id) {
        setNotes(Notes.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));

    }
    function toggleArchive(id) {
        setNotes(Notes.map(n => n.id === id ? { ...n, archived: !n.archived } : n));

    }
    function toggleTrash(Note) {
        if (Note.trashed === true) {
            if (confirm("Are you sure to Delete Note")) {
                const newNotes = Notes.filter((note) => note.id !== Note.id);
                setNotes(newNotes);
            }
        }
        else {
            setNotes(Notes.map(n => n.id === Note.id ? { ...n, trashed: !n.trashed, archived: false } : n));
        }

    }
    function handleRestore(Note) {
        setNotes(Notes.map(n => n.id === Note.id ? { ...n, trashed: false, archived: false, pinned: false } : n));
    }

    const filteredNotes = Notes.filter((note) => note.title.toLowerCase().includes(SearchText));
    const sortedNotes = filteredNotes.sort((a, b) => b.pinned - a.pinned)

    return (
        <NotesContext.Provider value={{
            View, setView, openAddModal, setOpenAddModal, NoteTitle, NoteContent,
            handleTitle, handleSave, handleContent, openEditModal, setOpenEditModal,
            total, handleEditNote, setSearchText,sortedNotes, togglePin, toggleArchive, toggleTrash, handleRestore
        }}>
            {children}
        </NotesContext.Provider>
    );
};
