import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth';
import ChatRooms from './pages/ChatRooms';
import Chat from './pages/Chat';
import Landing from './pages/Landing';
import { AuthProvider } from './AuthContext';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/chat-rooms" element={<ChatRooms />}>
                        <Route path=":roomId" element={<ChatRooms />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
