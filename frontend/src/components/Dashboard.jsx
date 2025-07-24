import { useEffect, useState } from 'react';

const Dashboard = () => {
    const [folders, setFolders] = useState([]);
    const [newFolderName, setNewFolderName] = useState('');
    const [error, setError] = useState('');

    const API_URL = import.meta.env.VITE_API_URL;
    const accessToken = localStorage.getItem('access');

    useEffect(() => {
        const fetchFolders = async () => {
            try {
                const response = await fetch(`${API_URL}/api/folders/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })
                const data = await response.json();
                if (response.ok) {
                    setFolders(data);
                }
                else {
                    setError(data.detail || "Failed to fetch folders.");
                }
            } catch (e) {
                setError('Failed to fetch folders.');
            }
        }        
        fetchFolders();
    }, [API_URL, accessToken]);

    const handleFolderChange = (e) => {
        setNewFolderName(e.target.value);
    }

    const handleCreateFolder = async (e) => {
        e.preventDefault();
        setError('');

        try {
            console.log(newFolderName);
            
            const response = await fetch(`${API_URL}/api/folders/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify({ name: newFolderName }),
            });

            if (response.ok) {
                const newFolder = await response.json();
                setFolders((prev) => [...prev, newFolder]);
                setNewFolderName('');
            } else {
                const data = await response.json();
                console.log("Create folder error response:", data);
                setError(JSON.stringify(data));  // show exact error
                // setError(data.name?.[0] || "Failed to create folder.");
            }
        } catch (e) {
            setError('Failed to create folder.');
        }
    }

    return (
        <div>
            <h2>Your folders</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <h3>New Folder</h3>
            <form onSubmit={handleCreateFolder}>
                <input
                    type="text"
                    value={newFolderName}
                    onChange={handleFolderChange}
                    required
                />
                <button type="submit">Create</button>
            </form>
            {folders.length === 0 ? (
                <p>No folders found.</p>
            ) : (
                <ul>
                    {folders.map(folder => (
                        <li key={folder.id}>
                            <h3>{folder.name}</h3>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default Dashboard;