import { Routes, Route, Link, useLocation } from "react-router-dom";
import NotesPage from "./pages/NotesPage";
import ArchivePage from "./pages/ArchivePage";
import TrashPage from "./pages/TrashPage";
import Search from "./components/Search";
import { MdViewList, MdArchive, MdDelete } from "react-icons/md";
import { MdGridView } from "react-icons/md";
import { useNotes } from "./context/NotesContext";
import AddNote from "./components/AddNote";
import { MdMenu } from "react-icons/md";
import { MdNotes } from "react-icons/md";
import { useState } from "react";

export default function App() {
  const { setView, openAddModal, setOpenAddModal } = useNotes();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  return (
    <div className="flex  flex-col min-h-screen">
      <div className="fixed top-0 left-0 w-full h-[50px] bg-gray-300 flex items-center px-4 ">
        <h1 className="flex gap-4 text-2xl font-bold ">
          <MdMenu size={30} />

          {isActive("/") && "Notes"}
          {isActive("/archive") && "Archive"}
          {isActive("/trash") && "Trash"}
        </h1>
      </div>
      <div className="flex flex-1 ">
        <div className="hidden fixed left-0 top-[50px] h-[calc(100vh-50px)]
  md:flex flex-col sm:w-[200px] bg-gray-500 p-4 gap-2 text-white ">

          <Link to="/" className={`flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-600 ${isActive("/") ? "bg-gray-700 font-bold" : ""
            }`} ><MdNotes size={25} /> Notes</Link>
          <Link to="/archive" className={`flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-600 ${isActive("/archive") ? "bg-gray-700 font-bold" : ""
            }`}><MdArchive size={25} /> Archive</Link>
          <Link to="/trash" className={`flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-600 ${isActive("/trash") ? "bg-gray-700 font-bold" : ""
            }`}><MdDelete size={25} /> Trash</Link>
        </div>

        <div className="flex-1 pt-[50px] ml-[200px]">
          <div className="flex justify-between bg-gray-100 py-3 px-3">
            <Search />
            <div className="flex gap-3">
              <button className="bg-gray-500 hover:bg-gray-200 hover:outline-2 hover:outline-current rounded-2xl px-2 py-1 ml-2" onClick={() => setOpenAddModal(true)}>Add Notes</button>
              {openAddModal && <AddNote />}
              <div className="flex gap-2 ">
                <button className="flex justify-center items-center" onClick={() => setView('list')}><MdViewList size={30} /> List</button>
                <button className="flex justify-center items-center" onClick={() => setView('grid')}><MdGridView size={30} /> Grid</button>
              </div>
            </div>
          </div>
          <div className="p-4">
            <Routes>
              <Route path="/" element={<NotesPage />} />
              <Route path="/archive" element={<ArchivePage />} />
              <Route path="/trash" element={<TrashPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}
