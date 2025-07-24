import { use } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [folders, setFolders] = useState([]);
    const [newFolderName, setNewFolderName] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;
    const accessToken = localStorage.getItem('access');

    useEffect(() => {
        const fetchFolders = async () => {
            try {
                const response = await fetch(`${API_URL}/api/folders/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
                const data = await response.json();
                if (response.ok) {
                    setFolders(data);
                } else {
                    setError(data.detail || "Failed to fetch folders.");
                }
            } catch (e) {
                setError("An error occurred while fetching folders.");
            }
        }
        fetchFolders();
    }, [API_URL, accessToken]);

    const handleCreateFolder = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch(`${API_URL}/api/folders/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify({ name: newFolderName }),
            })
            if (response.ok) {
                const newFolder = await response.json();
                setFolders((prev) => [...prev, newFolder]);
                setNewFolderName('');
            } else {
                const data = await response.json();
                setError(data.detail || "Failed to create folder.");
            }
        } catch (e) {
            setError("An error occurred while creating the folder.");
        }
    }

    const openFolder = (id) => {
        navigate(`/folders/${id}`);
    }

    return (
        <div>
            <h2>Your Folders</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleCreateFolder}>
                <input 
                    type="text" 
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="New folder name"
                />
                <button type="submit">Create Folder</button>
            </form>
            <ul>
                {folders.map((folder) => (
                    <li key={folder.id} onClick={() => openFolder(folder.id)}>
                        {folder.name}
                    </li>
                ))}
            </ul>
        </div>
    )
};

export default Dashboard;