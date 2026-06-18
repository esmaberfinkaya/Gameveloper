import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Minimize2, Maximize2 } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

export default function DMWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [targetUser, setTargetUser] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [roomId, setRoomId] = useState<string | null>(null);
  
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOpenDM = (e: Event) => {
      const customEvent = e as CustomEvent;
      const tUser = customEvent.detail;
      const cUserStr = localStorage.getItem('user');
      if (cUserStr) {
        setCurrentUser(JSON.parse(cUserStr));
      }
      setTargetUser(tUser);
      setIsOpen(true);
      setIsMinimized(false);
    };

    window.addEventListener('open-dm', handleOpenDM);
    return () => window.removeEventListener('open-dm', handleOpenDM);
  }, []);

  useEffect(() => {
    if (isOpen && currentUser && targetUser && !socketRef.current) {
      // Connect to socket
      socketRef.current = io('http://localhost:5000');
      
      socketRef.current.emit('join_dm', {
        user1Id: currentUser.id,
        user2Id: targetUser.id
      });

      socketRef.current.on('dm_room_joined', (room) => {
        setRoomId(room.id);
        fetchMessages(room.id);
      });

      socketRef.current.on('receive_dm', (msg) => {
        setMessages((prev) => [...prev, msg]);
      });
    }

    return () => {
      if (!isOpen && socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setRoomId(null);
        setMessages([]);
      }
    };
  }, [isOpen, currentUser, targetUser]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const fetchMessages = async (rId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/dm/${rId}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Failed to fetch messages', err);
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !roomId || !socketRef.current) return;

    socketRef.current.emit('send_dm', {
      roomId,
      senderId: currentUser.id,
      content: inputText
    });

    setInputText('');
  };

  if (!isOpen || !targetUser) return null;

  return (
    <div className={`fixed bottom-4 right-4 w-80 md:w-96 bg-[#0a0a0f] border border-theme-accent/50 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.1)] overflow-hidden z-50 flex flex-col transition-all duration-300 ${isMinimized ? 'h-14' : 'h-[500px]'}`}>
      
      {/* Header */}
      <div 
        className="h-14 px-4 border-b border-gray-800 bg-[#12121a] flex justify-between items-center cursor-pointer relative"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_15px_rgba(255,255,255,0.1)]" style={{ borderColor: 'white' }}></div>
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center bg-black shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            <span className="text-white font-bold text-xs">{targetUser.name.charAt(0).toUpperCase()}</span>
          </div>
          <span className="font-bold text-white uppercase tracking-wider text-sm">{targetUser.name}</span>
        </div>
        <div className="flex items-center gap-2 relative z-10">
          <button className="text-gray-400 hover:text-white transition-colors" onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}>
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button className="text-gray-400 hover:text-red-500 transition-colors" onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}>
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Body */}
      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[url('/noise.png')]">
            {messages.map((m, i) => {
              const isMe = m.senderId === currentUser.id;
              return (
                <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl ${isMe ? 'bg-white text-black rounded-tr-sm shadow-[0_0_10px_rgba(255,255,255,0.2)]' : 'bg-gray-800 text-gray-200 rounded-tl-sm border border-gray-700'}`}>
                    <p className="text-sm font-medium">{m.content}</p>
                  </div>
                  <span className="text-[10px] text-gray-500 mt-1 uppercase">
                    {new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="p-3 border-t border-gray-800 bg-[#12121a] flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Mesaj yaz..."
              className="flex-1 bg-black border border-gray-700 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-white shadow-[inset_0_0_5px_rgba(255,255,255,0.1)] transition-colors"
            />
            <button 
              type="submit" 
              disabled={!inputText.trim()}
              className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center disabled:opacity-50 hover:bg-gray-200 transition-colors shadow-[0_0_10px_rgba(255,255,255,0.3)]"
            >
              <Send size={16} className="-ml-0.5" />
            </button>
          </form>
        </>
      )}
    </div>
  );
}
