import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../AuthContext';
import styled from 'styled-components';

const Container = styled.div`
    width: 100%;
    height: 100vh;
    padding: 20px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;
`;

const Header = styled.h2`
    text-align: center;
    color: #fff;
    margin-bottom: 20px;
    font-size: 2rem;
    font-family: 'Georgia', serif;
    letter-spacing: -1px;
    font-weight: 800;
`;

const MessageList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    margin: 10px 0;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
    border: 1px solid rgba(255, 255, 255, 0.1);

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

const MessageBubble = styled.div`
    max-width: 70%;
    padding: 15px 20px;
    border-radius: 20px;
    position: relative;
    word-wrap: break-word;
    align-self: ${props => props.isOwn ? 'flex-end' : 'flex-start'};
    background-color: ${props => props.isOwn ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.1)'};
    color: ${props => props.isOwn ? '#004d40' : '#fff'};
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: flex-start;
    gap: 12px;
    
    &:before {
        content: '';
        position: absolute;
        bottom: 0;
        ${props => props.isOwn ? 'right: -8px' : 'left: -8px'};
        width: 20px;
        height: 20px;
        background-color: inherit;
        clip-path: ${props => props.isOwn ? 'polygon(0 0, 0% 100%, 100% 100%)' : 'polygon(100% 0, 100% 100%, 0 100%)'};
    }
`;

const UserAvatar = styled.div`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: ${props => props.color};
    flex-shrink: 0;
    order: ${props => props.isOwn ? 1 : 0};
`;

const MessageContent = styled.div`
    flex: 1;
`;

const getRandomColor = () => {
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1',
        '#96CEB4', '#FFEEAD', '#D4A5A5',
        '#9B59B6', '#3498DB', '#E74C3C'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};

const Chat = ({ roomId }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [userColors] = useState(new Map());

    const getUserColor = (userId) => {
        if (!userColors.has(userId)) {
            userColors.set(userId, getRandomColor());
        }
        return userColors.get(userId);
    };

    const getAvatarColor = (senderId, isTherapist) => {
        if (isTherapist || (senderId === user?.id && user?.user_metadata?.role === 'therapist')) {
            return '#FFD700';
        }
        return getUserColor(senderId);
    };

    useEffect(() => {
        const fetchMessages = async () => {
            let { data } = await supabase.from('messages').select('*').eq('room_id', roomId);
            if (data) setMessages(data);
        };

        // Initial fetch
        fetchMessages();

        // Set up polling interval
        const pollingInterval = setInterval(fetchMessages, 500);

        // Set up real-time subscription as backup
        const subscription = supabase.channel('realtime messages').on(
            'postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' },
            (payload) => setMessages((prev) => [...prev, payload.new])
        ).subscribe();

        // Cleanup function
        return () => {
            clearInterval(pollingInterval);
            supabase.removeChannel(subscription);
        };
    }, [roomId]);

    const sendMessage = async () => {
        await supabase.from('messages').insert({
            sender_id: user.id,
            room_id: roomId,
            message
        });
        setMessage('');
    };

    return (
        <Container>
            <Header>Chat Room</Header>
            <MessageList>
                {messages.map((msg) => (
                    <MessageBubble key={msg.id} isOwn={msg.sender_id === user.id}>
                        <UserAvatar 
                            isOwn={msg.sender_id === user.id}
                            color={getAvatarColor(msg.sender_id, msg.sender_role === 'therapist')}
                        />
                        <MessageContent>{msg.message}</MessageContent>
                    </MessageBubble>
                ))}
            </MessageList>
            <InputContainer>
                <Input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    onKeyPress={(e) => e.key === 'Enter' && message.trim() && sendMessage()}
                />
                <SendButton onClick={sendMessage} disabled={!message.trim()}>
                    Send
                </SendButton>
            </InputContainer>
        </Container>
    );
};

const InputContainer = styled.div`
    display: flex;
    gap: 15px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    margin-top: auto;
`;

const Input = styled.input`
    flex: 1;
    padding: 15px 20px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 25px;
    font-size: 16px;
    outline: none;
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    transition: all 0.3s ease;

    &::placeholder {
        color: rgba(255, 255, 255, 0.6);
    }

    &:focus {
        border-color: rgba(255, 255, 255, 0.5);
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
        transform: translateY(-1px);
    }
`;

const SendButton = styled.button`
    padding: 15px 30px;
    background: rgba(255, 255, 255, 0.9);
    color: #004d40;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;

    &:hover {
        background: #fff;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(255, 255, 255, 0.3);
    }

    &:active {
        transform: translateY(0);
    }

    &:disabled {
        background: rgba(255, 255, 255, 0.3);
        cursor: not-allowed;
        transform: none;
    }
`;

export default Chat;
