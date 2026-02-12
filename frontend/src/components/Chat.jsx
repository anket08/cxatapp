import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import axios from 'axios';
import { Send, Hash, Activity, LogOut, User as UserIcon, ChevronLeft, AlertCircle } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const Chat = ({ user, activeRoom: propActiveRoom, onLeaveRoom }) => {
    const { roomId: paramRoomId } = useParams();
    const navigate = useNavigate();
    const activeRoom = propActiveRoom || paramRoomId;

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [connectionError, setConnectionError] = useState(false);

    const stompClientRef = useRef(null);
    const subscriptionRef = useRef(null);
    const messagesEndRef = useRef(null);

    // --- 1. Scroll Logic ---
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // --- 2. WebSocket Connection & Subscription ---
    useEffect(() => {
        if (!activeRoom) return;

        // Cleanup function for previous connection/subscription
        const cleanup = () => {
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
                subscriptionRef.current = null;
            }
            if (stompClientRef.current && stompClientRef.current.connected) {
                stompClientRef.current.disconnect();
                stompClientRef.current = null;
                setIsConnected(false);
            }
        };

        cleanup(); // Cleanup before starting new connection

        const socket = new SockJS('http://localhost:8080/ws');
        const client = Stomp.over(socket);
        client.debug = () => { }; // Keep console clean

        client.connect({}, () => {
            setIsConnected(true);
            setConnectionError(false);
            stompClientRef.current = client;

            // Subscribe to the specific room topic
            subscriptionRef.current = client.subscribe('/topic/messages', (msg) => {
                const message = JSON.parse(msg.body);
                // Ensure message belongs to current room
                if (String(message.roomId) === String(activeRoom)) {
                    setMessages((prev) => {
                        // Avoid duplicates if message ID exists
                        if (prev.some(m => m.id === message.id)) return prev;
                        return [...prev, message];
                    });
                }
            });

            // Fetch history *after* connection established
            fetchHistory(activeRoom);

        }, (error) => {
            console.error("Connection Error:", error);
            setIsConnected(false);
            setConnectionError(true);
            // Simple retry logic could go here, but avoiding complex polling
        });

        return cleanup;
    }, [activeRoom]); // Re-run effect when activeRoom changes

    // --- 3. History Fetching ---
    const fetchHistory = async (roomId) => {
        try {
            const res = await axios.get(`http://localhost:8080/chat/messages/${roomId}`);
            if (Array.isArray(res.data)) {
                setMessages(res.data);
            }
        } catch (err) {
            console.error("History fetch failed:", err);
        }
    };

    // --- 4. Send Message ---
    const sendMessage = () => {
        if (!input.trim() || !activeRoom || !isConnected || !stompClientRef.current) return;

        const messagePayload = {
            roomId: parseInt(activeRoom, 10), // Ensure number format if backend expects Long
            senderId: user.id,
            content: input.trim()
        };

        try {
            stompClientRef.current.send("/app/chat", {}, JSON.stringify(messagePayload));
            setInput('');
        } catch (error) {
            console.error("Send failed:", error);
        }
    };

    const handleLeave = () => {
        if (onLeaveRoom) onLeaveRoom();
        navigate('/lobby');
    };

    return (
        <div className="landing-hero" style={{ position: 'fixed', zIndex: 50, overflow: 'hidden' }}>
            <div className="animated-gradient-bg"></div>
            <div className="floating-orb orb-1"></div>
            <div className="floating-orb orb-2"></div>

            <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`, backgroundSize: '60px 60px' }}></div>
            </div>

            <div className="chat-root" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'relative', zIndex: 10 }}>
                <div
                    className="chat-container"
                    style={{
                        maxWidth: '1200px',
                        height: '90vh',
                        background: 'rgba(10, 10, 10, 0.7)',
                        backdropFilter: 'blur(30px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        boxShadow: '0 40px 80px -20px rgba(0, 0, 0, 0.8)',
                        borderRadius: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                    }}
                >
                    {/* Header */}
                    <header className="chat-header" style={{ background: 'rgba(255,255,255,0.02)', padding: '20px 30px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <button
                                className="icon-btn exit-btn"
                                onClick={handleLeave}
                                style={{
                                    background: 'transparent',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: '#fff',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '0.8rem',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <ChevronLeft size={16} /> EXIT_CHANNEL
                            </button>
                            <div className="room-info" style={{ display: 'flex', flexDirection: 'column' }}>
                                <div className="room-title" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem', fontWeight: 'bold', color: '#fff' }}>
                                    <Hash size={20} style={{ color: '#00f2ff' }} />
                                    <span>FREQUENCY_{activeRoom}</span>
                                </div>
                                <div className="status-indicator" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.7rem', color: isConnected ? '#00ff95' : '#ff4b4b' }}>
                                    <div className="pulse-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: isConnected ? '#00ff95' : '#ff4b4b', boxShadow: isConnected ? '0 0 8px #00ff95' : 'none' }}></div>
                                    <span>{isConnected ? 'UPLINK_STABLE' : 'SEARCHING_NETWORK...'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="header-right" style={{ display: 'flex', gap: '15px' }}>
                            {connectionError && (
                                <div style={{ color: '#ff4b4b', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem' }}>
                                    <AlertCircle size={16} /> CONNECTION_REFUSED
                                </div>
                            )}
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '50%' }}>
                                <Activity size={20} color="#00f2ff" />
                            </div>
                        </div>
                    </header>

                    {/* Messages Feed */}
                    <div className="chat-viewport" style={{ flex: 1, overflowY: 'auto', padding: '30px', display: 'flex', flexDirection: 'column' }}>
                        <div className="messages-feed" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {messages.map((msg, idx) => {
                                const isMe = String(msg.senderId) === String(user.id);
                                return (
                                    <div
                                        key={msg.id || idx}
                                        style={{
                                            display: 'flex',
                                            justifyContent: isMe ? 'flex-end' : 'flex-start',
                                            width: '100%'
                                        }}
                                    >
                                        <div style={{
                                            maxWidth: '70%',
                                            display: 'flex',
                                            flexDirection: isMe ? 'row-reverse' : 'row',
                                            gap: '12px'
                                        }}>
                                            {!isMe && (
                                                <div style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '50%',
                                                    background: 'rgba(255,255,255,0.1)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    border: '1px solid rgba(255,255,255,0.1)'
                                                }}>
                                                    <UserIcon size={14} color="#fff" />
                                                </div>
                                            )}

                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                                                {!isMe && <span style={{ fontSize: '0.7rem', color: '#666', marginBottom: '4px', marginLeft: '4px' }}>USER_{msg.senderId}</span>}
                                                <div style={{
                                                    padding: '12px 18px',
                                                    borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                                    background: isMe ? 'linear-gradient(135deg, #00f2ff, #00a8ff)' : 'rgba(255,255,255,0.05)',
                                                    color: isMe ? '#000' : '#fff',
                                                    fontSize: '0.95rem',
                                                    lineHeight: '1.5',
                                                    border: isMe ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                                    boxShadow: isMe ? '0 4px 15px rgba(0, 242, 255, 0.3)' : 'none'
                                                }}>
                                                    {msg.content}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {messages.length === 0 && (
                                <div className="empty-state" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.3, marginTop: '50px' }}>
                                    <div style={{ fontSize: '4rem', fontWeight: '900', color: '#fff', letterSpacing: '-5px' }}>NULL</div>
                                    <p style={{ letterSpacing: '4px', fontSize: '0.8rem', marginTop: '10px' }}>NO_DATA_TRANSMISSIONS</p>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="chat-input-area" style={{ padding: '20px 30px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <div className="input-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                placeholder="TYPE_MESSAGE..."
                                disabled={!isConnected}
                                style={{
                                    width: '100%',
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    padding: '16px 60px 16px 20px',
                                    borderRadius: '12px',
                                    color: '#fff',
                                    outline: 'none',
                                    fontSize: '0.95rem',
                                    fontFamily: 'inherit'
                                }}
                            />
                            <button
                                className={`send-trigger ${input.trim() ? 'active' : ''}`}
                                onClick={sendMessage}
                                disabled={!isConnected || !input.trim()}
                                style={{
                                    position: 'absolute',
                                    right: '8px',
                                    background: input.trim() ? '#00f2ff' : 'transparent',
                                    color: input.trim() ? '#000' : 'rgba(255,255,255,0.2)',
                                    border: 'none',
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: input.trim() ? 'pointer' : 'default',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <Send size={18} />
                            </button>
                        </div>
                        <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)' }}>
                            PRESS ENTER TO TRANSMIT - ENCRYPTED CHANNEL
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;