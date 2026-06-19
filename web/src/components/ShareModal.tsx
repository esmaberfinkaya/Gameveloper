import React, { useState, useEffect } from 'react';
import { X, Search, Send } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemTitle: string;
  itemLink: string;
}

export default function ShareModal({ isOpen, onClose, itemTitle, itemLink }: ShareModalProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const cUserStr = localStorage.getItem('user');
    if (cUserStr) setCurrentUser(JSON.parse(cUserStr));
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Fetch all users
      fetch('http://localhost:5000/api/users')
        .then(res => res.json())
        .then(data => setUsers(data))
        .catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredUsers = users.filter(u => 
    u.id !== currentUser?.id && 
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleShare = (user: any) => {
    const shareMessage = `Sana bir içerik gönderdim: ${itemTitle}\nLink: ${itemLink}`;
    window.dispatchEvent(new CustomEvent('open-dm', { 
      detail: { user, autoSendMessage: shareMessage } 
    }));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0a0a0f] border border-theme-accent/50 rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col shadow-[0_0_30px_rgba(34,197,94,0.15)]">
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">Paylaş</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-theme-accent transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 border-b border-gray-800">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Kullanıcı Ara..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#12121a] border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-theme-accent transition-colors text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
          {filteredUsers.length === 0 ? (
            <p className="text-center text-gray-500 text-sm py-4">Kullanıcı bulunamadı.</p>
          ) : (
            filteredUsers.map(u => (
              <div key={u.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-theme-accent/10 cursor-pointer transition-colors" onClick={() => handleShare(u)}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-theme-accent flex items-center justify-center bg-black shrink-0">
                    <span className="text-white font-bold">{u.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-white font-bold text-sm truncate">{u.name}</h4>
                    <p className="text-theme-accent text-[10px] uppercase tracking-wider truncate">{u.role}</p>
                  </div>
                </div>
                <button className="text-theme-accent hover:text-white transition-colors">
                  <Send size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
