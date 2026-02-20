'use client';

import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
    user: string;
    message: string;
    timestamp: string;
}

export default function Chat({ roomId }: { roomId: string }) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [username, setUsername] = useState(`User-${Math.floor(Math.random() * 1000)}`);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Use direct URL if available (for IP access), otherwise fallback to proxy (localhost)
        const socketUrl = process.env.NEXT_PUBLIC_CHAT_URL || undefined;
        console.log('Connecting to chat:', socketUrl);
        const newSocket = io(socketUrl, {
            path: '/api/socket',
            autoConnect: true,
        });
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to chat server', newSocket.id);
            newSocket.emit('join_room', roomId);
        });

        newSocket.on('connect_error', (err) => {
            console.error('Chat connection error:', err);
        });

        newSocket.on('receive_message', (msg: Message) => {
            setMessages((prev) => [...prev, msg].slice(-50)); // Keep last 50 messages
        });

        return () => {
            newSocket.emit('leave_room', roomId);
            newSocket.disconnect();
        };
    }, [roomId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && socket) {
            socket.emit('send_message', {
                roomId,
                message: input,
                username,
            });
            setInput('');
        }
    };

    return (
        <div className="flex flex-col h-[500px] w-full max-w-md bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
            <div className="p-3 bg-neutral-800 border-b border-neutral-700 font-bold text-white">
                Live Chat
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.map((msg, idx) => (
                    <div key={idx} className="break-words">
                        <span className="font-bold text-blue-400 mr-2">{msg.user}:</span>
                        <span className="text-gray-200">{msg.message}</span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="p-3 bg-neutral-800 border-t border-neutral-700 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Say something..."
                    className="flex-1 bg-neutral-900 border border-neutral-700 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-semibold transition-colors"
                >
                    Send
                </button>
            </form>
        </div>
    );
}
