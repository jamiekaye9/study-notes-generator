import { Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import FolderPage from './components/FolderPage';
import NoteEditor from './components/NoteEditor';

const App = () => {
  return (
    <div>
      <h1>Study Notes Generator</h1>
      
      <nav>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/dashboard">Dashboard</Link>
      </nav>

      <Routes>
        <Route path="/" eletement={<div>Homepage</div>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/folders/:id" element={<FolderPage />} />
        <Route path="/note/:id" element={<NoteEditor />} />
      </Routes>
    </div>
  )
}

export default App;
