import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { MessageSquare } from 'lucide-react';
import Chat from '../pages/Chat';

const float = keyframes`
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
`;

const FloatingEmoji = styled.span`
    position: absolute;
    font-size: 4rem;
    user-select: none;
    animation: ${float} ${props => props.duration || '3'}s ease-in-out infinite;
    animation-delay: ${props => props.delay || '0'}s;
    opacity: 0.7;
    filter: blur(0.5px);
    z-index: 1;
    left: ${props => props.left};
    top: ${props => props.top};
`;

const Container = styled.div`
    min-height: 100vh;
    width: 100%;
    background: linear-gradient(135deg, #004d40 0%, #00695c 100%);
    color: #fff;
    position: relative;
    overflow: hidden;
    display: flex;
`;

const SidebarWrapper = styled.div`
    width: 350px;
    height: 100vh;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-right: 1px solid rgba(255, 255, 255, 0.2);
    display: flex;
    flex-direction: column;
`;

const Title = styled.h2`
    text-align: center;
    color: #fff;
    font-size: 2.5rem;
    margin-bottom: 2rem;
    position: relative;
    z-index: 2;
    font-family: 'Georgia', serif;
    letter-spacing: -1px;
    font-weight: 800;
`;

const Input = styled.input`
    width: 100%;
    padding: 14px;
    margin: 10px 0;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    font-size: 16px;
    backdrop-filter: blur(5px);
    transition: all 0.3s ease;

    &:focus {
        outline: none;
        border-color: rgba(255, 255, 255, 0.5);
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
    }

    &::placeholder {
        color: rgba(255, 255, 255, 0.6);
    }
`;

const Button = styled.button`
    width: 100%;
    padding: 16px;
    margin: 15px 0;
    border: none;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.9);
    color: #004d40;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    z-index: 2;

    &:hover {
        transform: translateY(-2px);
        background: #fff;
        box-shadow: 0 5px 15px rgba(255, 255, 255, 0.3);
    }

    &:active {
        transform: translateY(0);
    }
`;

const RoomList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    flex: 1;
    overflow-y: auto;

    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.1);
    }

    &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.3);
        border-radius: 3px;
    }
`;

const RoomItem = styled.li`
    padding: 15px 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    gap: 12px;
    background: ${props => props.active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};

    &:hover {
        background: rgba(255, 255, 255, 0.15);
    }
`;

const MainContent = styled.div`
    flex: 1;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.05);
`;

const EmptyState = styled.div`
    text-align: center;
    color: rgba(255, 255, 255, 0.7);

    svg {
        width: 64px;
        height: 64px;
        margin-bottom: 16px;
        opacity: 0.7;
    }

    p {
        font-size: 18px;
    }
`;

const ChatRooms = () => {
    const { user } = useAuth();
    const { roomId } = useParams();
    const [rooms, setRooms] = useState([]);
    const [roomName, setRoomName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchRooms();

        const subscription = supabase
            .channel('chat_rooms')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_rooms' }, (payload) => {
                setRooms((prevRooms) => [...prevRooms, payload.new]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    const fetchRooms = async () => {
        let { data, error } = await supabase.from('chat_rooms').select('*');
        if (error) {
            console.error('Error fetching chat rooms:', error);
        } else {
            setRooms(data);
        }
    };

    const createRoom = async () => {
        if (user?.user_metadata.role !== 'therapist') {
            alert('Only therapists can create rooms');
            return;
        }
        const { data, error } = await supabase.from('chat_rooms').insert([{ name: roomName, created_by: user.id }]).select();

        if (error) {
            alert('Error creating chat room: ' + error.message);
        } else {
            setRoomName('');
            setRooms([...rooms, data[0]]);
        }
    };

    return (
        <Container>
            <SidebarWrapper>
                <Title>Chat Rooms</Title>
                {user && user.user_metadata && user.user_metadata.role === 'therapist' && (
                    <>
                        <Input 
                            type="text" 
                            placeholder="✨ Enter a new room name..." 
                            value={roomName} 
                            onChange={(e) => setRoomName(e.target.value)}
                            style={{ width: '80%', margin: '10px auto' }}
                        />
                        <Button 
                            onClick={createRoom}
                            style={{ width: '80%', margin: '15px auto' }}
                            disabled={!roomName.trim()}
                        >
                            Create Room ✨
                        </Button>
                    </>
                )}
                <RoomList>
                    {rooms.map((room) => (
                        <RoomItem 
                            key={room.id} 
                            onClick={() => navigate(`/chat-rooms/${room.id}`)}
                            active={room.id === roomId}
                        >
                            <MessageSquare size={24} />
                            {room.name}
                        </RoomItem>
                    ))}
                </RoomList>
            </SidebarWrapper>
            <MainContent>
                {roomId ? (
                    <Chat roomId={roomId} />
                ) : (
                    <EmptyState>
                        <MessageSquare />
                        <p>Select a chat room to start messaging</p>
                    </EmptyState>
                )}
            </MainContent>
        </Container>
    );
};

export default ChatRooms;
