import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const NoteEditor = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [summary, setSummary] = useState('');
  const [summarizing, setSummarizing] = useState(false);
  const [summaryError, setSummaryError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL;
  const accessToken = localStorage.getItem('access');

  // Fetch note on load
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await fetch(`${API_URL}/api/notes/${id}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setNote(data);
        } else {
          setError(data.detail || 'Failed to load note.');
        }
      } catch (e) {
        setError('Something went wrong loading the note.');
      }
    };

    fetchNote();
  }, [API_URL, id, accessToken]);

  // Update local note state
  const handleChange = (e) => {
    setNote((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Save changes
  const handleSave = async () => {
    setSaving(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/notes/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(note),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.detail || 'Failed to save note.');
      }
    } catch (e) {
      setError('An error occurred saving the note.');
    }

    setSaving(false);
  };

  if (!note) return <p>Loading note...</p>;

  const handleFileUpload = async (file) => {
  setError('');

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_URL}/api/upload/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (response.ok) {
      setNote((prev) => ({
        ...prev,
        content: prev.content + '\n\n' + data.text,
      }));
    } else {
      setError(data.error || "Upload failed.");
    }
  } catch (err) {
    setError("Something went wrong uploading the file.");
  }
};

const handleSummarize = async () => {
  if (!note.content) return;
  setSummarizing(true);
  setSummary('');
  setSummaryError('');

  try {
    const response = await fetch(`${API_URL}/api/summarize/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ text: note.content }),
    });

    const data = await response.json();
    if (response.ok) {
      setSummary(data.summary);
    } else {
      setSummaryError(data.error || 'Summarization failed.');
    }
  } catch (err) {
    setSummaryError('Something went wrong.');
  } finally {
    setSummarizing(false);
  }
};

  return (
    <div>
      <h2>Edit Note</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type='button' onClick={handleSummarize}>Summarize with AI</button>

      <input
        type="text"
        name="title"
        value={note.title}
        onChange={handleChange}
        placeholder="Note Title"
        style={{ width: '100%', fontSize: '1.2rem' }}
      />
      <br />
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => handleFileUpload(e.target.files[0])}
      />
      <br />
      <textarea
        name="content"
        value={note.content}
        onChange={handleChange}
        placeholder="Write your note here..."
        rows="20"
        style={{ width: '100%', marginTop: '10px' }}
      />
      <br />
      <button onClick={handleSave} disabled={saving}>
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
};

export default NoteEditor;