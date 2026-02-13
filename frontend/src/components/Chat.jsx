import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import axios from 'axios';
import { Send, Hash, ChevronLeft, User as UserIcon, Shield, Radio } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const Chat = ({ user, activeRoom: propActiveRoom, onLeaveRoom }) => {
    const { roomId: paramRoomId } = useParams();
    const navigate = useNavigate();
    const activeRoom = propActiveRoom || paramRoomId;

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isConnected, setIsConnected] = useState(false);

    const stompClientRef = useRef(null);
    const subscriptionRef = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (!activeRoom) return;
        const socket = new SockJS('http://localhost:8080/ws');
        const client = Stomp.over(socket);
        client.debug = null;
        stompClientRef.current = client;

        client.connect({}, () => {
            setIsConnected(true);
            subscriptionRef.current = client.subscribe(`/topic/messages/${activeRoom}`, (msg) => {
                const message = JSON.parse(msg.body);
                setMessages(prev => prev.some(m => m.id === message.id) ? prev : [...prev, message]);
            });
            fetchHistory(activeRoom);
        }, () => setIsConnected(false));

        return () => {
            if (subscriptionRef.current) subscriptionRef.current.unsubscribe();
            if (client && client.connected) client.disconnect();
        };
    }, [activeRoom]);

    const fetchHistory = async (id) => {
        try {
            const res = await axios.get(`http://localhost:8080/chat/messages/${id}`);
            if (Array.isArray(res.data)) setMessages(res.data);
        } catch (err) { console.error(err); }
    };

    const sendMessage = () => {
        if (!input.trim() || !isConnected) return;
        const payload = { roomId: parseInt(activeRoom), senderId: user.id, content: input.trim() };
        stompClientRef.current.send("/app/chat", {}, JSON.stringify(payload));
        setInput('');
    };

    return (
        <div className="chat-container-main">
            <style>{`
                @keyframes orbit {
                    0% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.2); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0, 0) scale(1); }
                }

                .chat-container-main {
                    position: fixed;
                    inset: 0;
                    width: 100vw;
                    height: 100vh;
                    background: #050505;
                    color: white;
                    font-family: 'Inter', sans-serif;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }

                /* Animated Background Blobs */
                .bg-animate {
                    position: absolute;
                    inset: 0;
                    z-index: 0;
                    overflow: hidden;
                    pointer-events: none;
                }
                .blob {
                    position: absolute;
                    width: 500px;
                    height: 500px;
                    border-radius: 50%;
                    filter: blur(120px);
                    opacity: 0.15;
                    animation: orbit 20s infinite ease-in-out;
                }
                .blob-1 { background: #7000ff; top: -10%; left: -10%; }
                .blob-2 { background: #00f2ff; bottom: -10%; right: -10%; animation-delay: -5s; }

                /* Header Alignment Fixed */
                .chat-header {
                    position: relative;
                    z-index: 10;
                    height: 70px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 25px;
                    background: rgba(0,0,0,0.6);
                    backdrop-filter: blur(15px);
                    border-bottom: 1px solid rgba(255,255,255,0.08);
                }

                .header-left { 
                    display: flex; 
                    align-items: center; 
                    gap: 15px; 
                }

                .header-right {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }

                .room-info { 
                    display: flex; 
                    flex-direction: column;
                    justify-content: center;
                }

                .back-btn { 
                    background: #1a1a1a; 
                    border: none; 
                    color: white; 
                    border-radius: 8px; 
                    width: 36px;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer; 
                }
                
                /* Messages Area */
                .messages-view {
                    flex: 1;
                    position: relative;
                    z-index: 5;
                    overflow-y: auto;
                    padding: 20px 5%;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    scrollbar-width: none;
                }

                .msg-box {
                    max-width: 60%;
                    padding: 12px 18px;
                    border-radius: 12px;
                    font-size: 0.95rem;
                    line-height: 1.5;
                }
                .msg-box.me {
                    align-self: flex-end;
                    background: #6200ea;
                    box-shadow: 0 4px 15px rgba(98, 0, 234, 0.3);
                }
                .msg-box.other {
                    align-self: flex-start;
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }

                /* Translucent Bottom Bar */
                .chat-footer {
                    position: relative;
                    z-index: 10;
                    padding: 30px 5%;
                    background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%);
                }

                .input-wrapper {
                    background: rgba(20, 20, 20, 0.6);
                    backdrop-filter: blur(25px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 50px;
                    display: flex;
                    align-items: center;
                    padding: 8px 10px 8px 25px;
                    max-width: 900px;
                    margin: 0 auto;
                    transition: 0.3s;
                }
                .input-wrapper:focus-within {
                    border-color: #00f2ff;
                    box-shadow: 0 0 20px rgba(0, 242, 255, 0.15);
                }

                .input-wrapper input {
                    flex: 1;
                    background: transparent;
                    border: none;
                    color: white;
                    outline: none;
                    font-size: 1rem;
                }

                .send-btn {
                    background: rgba(255,255,255,0.1);
                    color: white;
                    border: none;
                    width: 42px;
                    height: 42px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: 0.2s;
                }
                .send-btn:hover { background: #00f2ff; color: black; transform: scale(1.05); }

                .meta-text {
                    text-align: center;
                    font-size: 0.6rem;
                    color: rgba(255,255,255,0.3);
                    margin-top: 15px;
                    letter-spacing: 2px;
                }
            `}</style>

            <div className="bg-animate">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
            </div>

            <header className="chat-header">
                <div className="header-left">
                    <button className="back-btn" onClick={() => navigate('/lobby')}>
                        <ChevronLeft size={20} />
                    </button>
                    <div className="room-info">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1rem', fontWeight: 'bold' }}>
                            <Hash size={18} color="#00f2ff" /> CHANNEL_{activeRoom}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: '#00ff88', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <div style={{ width: 4, height: 4, background: '#00ff88', borderRadius: '50%' }} /> ENCRYPTED LINK ACTIVE
                        </div>
                    </div>
                </div>

                <div className="header-right">
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: '700', lineHeight: 1 }}>{user.id}</div>
                        <div style={{ fontSize: '0.6rem', color: '#00f2ff', marginTop: '2px' }}>LEVEL_01_USER</div>
                    </div>
                    <div style={{ background: '#6200ea', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' }}>
                        <UserIcon size={20} />
                    </div>
                </div>
            </header>

            <main className="messages-view">
                {messages.length === 0 && (
                    <div style={{ margin: 'auto', textAlign: 'center', opacity: 0.2 }}>
                        <Radio size={48} />
                        <p style={{ marginTop: '10px' }}>WAITING FOR SIGNAL...</p>
                    </div>
                )}
                {messages.map((msg, idx) => {
                    const isMe = String(msg.senderId) === String(user.id);
                    return (
                        <div key={msg.id || idx} className={`msg-box ${isMe ? 'me' : 'other'}`}>
                            {!isMe && <div style={{ fontSize: '0.6rem', color: '#00f2ff', marginBottom: '4px' }}>USER_{msg.senderId}</div>}
                            {msg.content}
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </main>

            <footer className="chat-footer">
                <div className="input-wrapper">
                    <input
                        type="text"
                        placeholder="Secure transmission..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        disabled={!isConnected}
                    />
                    <button className="send-btn" onClick={sendMessage} disabled={!input.trim()}>
                        <Send size={18} />
                    </button>
                </div>
                <div className="meta-text">
                    S3CURE // THROUGH // PORT 8080
                </div>
            </footer>
        </div>
    );
};

export default Chat;