import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const FolderPage = () => {
  const { id: folderId } = useParams();
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [folderName, setFolderName] = useState('');
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL;
  const accessToken = localStorage.getItem('access');

  // Fetch folder notes
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch(`${API_URL}/api/folders/${folderId}/notes/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setNotes(data);
        } else {
          setError(data.detail || 'Failed to fetch notes.');
        }
      } catch (e) {
        setError('An error occurred while fetching notes.');
      }
    };

    const fetchFolder = async () => {
      try {
        const response = await fetch(`${API_URL}/api/folders/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();
        const folder = data.find((f) => f.id === parseInt(folderId));
        if (folder) setFolderName(folder.name);
      } catch (e) {
        console.error('Failed to fetch folder name');
      }
    };

    fetchNotes();
    fetchFolder();
  }, [API_URL, folderId, accessToken]);

  const handleNoteChange = (e) => {
    setNewNote((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/notes/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title: newNote.title,
          folder: folderId,
        }),
      });

      if (response.ok) {
        const created = await response.json();
        setNotes((prev) => [...prev, created]);
        setNewNote({ title: '', content: '' });
      } else {
        const data = await response.json();
        setError(data.title?.[0] || 'Failed to create note.');
      }
    } catch (e) {
      setError('An error occurred while creating the note.');
    }
  };

  const openNote = (noteId) => {
    navigate(`/note/${noteId}`);
  };

  return (
    <div>
      <h2>Folder: {folderName}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleCreateNote}>
        <input
          type="text"
          name="title"
          placeholder="Note title"
          value={newNote.title}
          onChange={handleNoteChange}
          required
        />
        <br />
        <button type="submit">Create Note</button>
      </form>

      <h3>Notes</h3>
      <ul>
        {notes.map((note) => (
          <li
            key={note.id}
            onClick={() => openNote(note.id)}
            style={{ cursor: 'pointer', color: 'blue', marginTop: '10px' }}
          >
            {note.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FolderPage;