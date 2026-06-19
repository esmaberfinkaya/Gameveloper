import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Minimize2, Maximize2, MessageCircle, ArrowLeft, Search } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

export default function DMWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [view, setView] = useState<'inbox' | 'chat'>('inbox');
  const [targetUser, setTargetUser] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [roomId, setRoomId] = useState<string | null>(null);
  const [inboxRooms, setInboxRooms] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [pendingMessage, setPendingMessage] = useState('');
  
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cUserStr = localStorage.getItem('user');
    if (cUserStr) {
      setCurrentUser(JSON.parse(cUserStr));
    }
  }, []);

  useEffect(() => {
    if (isOpen && currentUser && view === 'inbox') {
      fetchInboxRooms();
    }
  }, [isOpen, currentUser, view]);

  useEffect(() => {
    const handleOpenDM = (e: Event) => {
      const customEvent = e as CustomEvent;
      const payload = customEvent.detail;
      const tUser = payload.user || payload;
      
      const cUserStr = localStorage.getItem('user');
      if (cUserStr) {
        setCurrentUser(JSON.parse(cUserStr));
      }
      setTargetUser(tUser);
      setMessages([]);
      setView('chat');
      setIsOpen(true);
      setIsMinimized(false);

      if (payload.autoSendMessage) {
        setPendingMessage(payload.autoSendMessage);
      } else {
        setPendingMessage('');
      }
    };

    window.addEventListener('open-dm', handleOpenDM);
    return () => window.removeEventListener('open-dm', handleOpenDM);
  }, []);

  useEffect(() => {
    if (isOpen && currentUser && targetUser && view === 'chat' && !socketRef.current) {
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

      socketRef.current.on('receive_message', (msg) => {
        setMessages((prev) => {
          // Gelen mesaj zaten varsa ekleme
          if (prev.some(m => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      });
    }

    return () => {
      if ((!isOpen || view !== 'chat') && socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setRoomId(null);
        setMessages([]);
      }
    };
  }, [isOpen, currentUser, targetUser, view]);

  useEffect(() => {
    if (roomId && pendingMessage && socketRef.current && currentUser) {
      socketRef.current.emit('send_message', {
        roomId,
        senderId: currentUser.id,
        content: pendingMessage
      });
      setPendingMessage('');
    }
  }, [roomId, pendingMessage, currentUser]);

  useEffect(() => {
    if (view === 'chat') {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [messages, view]);

  const fetchInboxRooms = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`http://localhost:5000/api/dm/rooms/${currentUser.id}`);
      if (res.ok) {
        const data = await res.json();
        setInboxRooms(data);
      }
    } catch (err) {
      console.error('Failed to fetch inbox rooms', err);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 0) {
        try {
          const res = await fetch(`http://localhost:5000/api/users/search?q=${searchQuery}`);
          if (res.ok) {
            const data = await res.json();
            // Kendi adımızı sonuçlardan çıkaralım
            setSearchResults(data.filter((u: any) => u.id !== currentUser?.id));
          }
        } catch (err) {
          console.error('Failed to search users', err);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, currentUser]);

  const fetchMessages = async (rId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/dm/rooms/${rId}/messages`);
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

    socketRef.current.emit('send_message', {
      roomId,
      senderId: currentUser.id,
      content: inputText
    });

    setInputText('');
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => { setIsOpen(true); setView('inbox'); setIsMinimized(false); }}
        className="fixed bottom-4 right-4 w-14 h-14 bg-theme-accent text-black rounded-full shadow-[0_0_20px_rgba(0,255,255,0.4)] flex items-center justify-center hover:scale-110 transition-transform z-50 neon-glow-theme"
      >
        <MessageCircle size={28} />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-4 right-4 w-80 md:w-96 bg-[#0a0a0f] border border-theme-accent/50 rounded-2xl shadow-[0_0_30px_rgba(0,255,255,0.15)] overflow-hidden z-50 flex flex-col transition-all duration-300 ${isMinimized ? 'h-14' : 'h-[500px]'}`}>
      
      {/* Header */}
      <div 
        className="h-14 px-4 border-b border-theme-accent/30 bg-[#12121a] flex justify-between items-center cursor-pointer relative"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_15px_rgba(0,255,255,0.05)]"></div>
        <div className="flex items-center gap-3 relative z-10">
          {view === 'chat' && (
            <button 
              onClick={(e) => { e.stopPropagation(); setView('inbox'); setTargetUser(null); }}
              className="text-theme-accent hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          {view === 'chat' && targetUser ? (
            <>
              <div className="w-8 h-8 rounded-full border border-theme-accent flex items-center justify-center bg-black">
                <span className="text-theme-accent font-bold text-xs">{targetUser.name.charAt(0).toUpperCase()}</span>
              </div>
              <span className="font-bold text-white uppercase tracking-wider text-sm">{targetUser.name}</span>
            </>
          ) : (
            <div className="flex items-center gap-2 text-theme-accent">
              <MessageCircle size={20} />
              <span className="font-bold text-white uppercase tracking-wider text-sm">Gelen Kutusu</span>
            </div>
          )}
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
          {view === 'inbox' ? (
            <div className="flex-1 flex flex-col overflow-hidden bg-[#05070a]">
              {/* Arama Çubuğu */}
              <div className="p-3 border-b border-theme-accent/20">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={14} className="text-theme-accent/50" />
                  </div>
                  <input
                    type="text"
                    placeholder="Kullanıcı Ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#0D1117] border border-theme-accent/30 rounded-full pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-theme-accent shadow-[0_0_10px_rgba(0,255,255,0.1)] transition-colors placeholder-gray-500"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                {searchQuery.trim().length > 0 ? (
                  searchResults.length === 0 ? (
                    <div className="text-center text-xs text-gray-500 mt-4">Kullanıcı bulunamadı.</div>
                  ) : (
                    searchResults.map(user => (
                      <div 
                        key={user.id}
                        onClick={() => { setTargetUser(user); setView('chat'); setSearchQuery(''); }}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-theme-accent/10 transition-colors cursor-pointer border border-transparent hover:border-theme-accent/30 mb-1"
                      >
                        <div className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center bg-black shrink-0">
                          <span className="text-white font-bold text-sm">{user.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-bold text-sm truncate">{user.name}</h4>
                          <p className="text-theme-accent text-[10px] uppercase tracking-wider">{user.role}</p>
                        </div>
                      </div>
                    ))
                  )
                ) : inboxRooms.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-2 mt-10">
                    <MessageCircle size={32} className="opacity-20" />
                    <p className="text-sm font-bold uppercase tracking-wider">Mesaj Yok</p>
                  </div>
                ) : (
                  inboxRooms.map((room) => {
                    const otherUser = room.user1Id === currentUser?.id ? room.user2 : room.user1;
                    const latestMsg = room.messages?.[0]?.content || "Mesajlaşmaya başla...";
                    return (
                      <div 
                        key={room.id}
                        onClick={() => { setTargetUser(otherUser); setView('chat'); }}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-theme-accent/10 transition-colors cursor-pointer border border-transparent hover:border-theme-accent/30 mb-1"
                      >
                        <div className="w-12 h-12 rounded-full border border-gray-700 flex items-center justify-center bg-black shrink-0">
                          <span className="text-white font-bold">{otherUser.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-bold text-sm truncate">{otherUser.name}</h4>
                          <p className="text-gray-400 text-xs truncate mt-0.5">{latestMsg}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden bg-[url('/noise.png')]">
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.map((m, i) => {
                  const isMe = m.senderId === currentUser.id;
                  return (
                    <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-2xl ${isMe ? 'bg-theme-accent/20 text-theme-accent border border-theme-accent/50 rounded-tr-sm shadow-[0_0_10px_rgba(0,255,255,0.1)]' : 'bg-gray-800 text-gray-200 rounded-tl-sm border border-gray-700'}`}>
                        <p className="text-sm font-medium">{m.content}</p>
                      </div>
                      <span className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">
                        {new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={sendMessage} className="p-3 border-t border-theme-accent/30 bg-[#12121a] flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Terminal'e yaz..."
                  className="flex-1 bg-black border border-gray-700 rounded-full px-4 py-2 text-sm text-theme-accent focus:outline-none focus:border-theme-accent shadow-[inset_0_0_10px_rgba(0,255,255,0.05)] transition-colors font-mono"
                />
                <button 
                  type="submit" 
                  disabled={!inputText.trim()}
                  className="w-10 h-10 rounded-full bg-theme-accent text-black flex items-center justify-center disabled:opacity-50 hover:bg-theme-accent/80 transition-colors shadow-[0_0_15px_rgba(0,255,255,0.3)]"
                >
                  <Send size={16} className="-ml-0.5" />
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
}
