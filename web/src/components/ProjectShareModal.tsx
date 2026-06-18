import React, { useState } from 'react';
import { X, Upload, PlayCircle, Store, Send } from 'lucide-react';

interface ProjectShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onUpdate: () => void;
}

export default function ProjectShareModal({ isOpen, onClose, user, onUpdate }: ProjectShareModalProps) {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [storeUrl, setStoreUrl] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !summary || !youtubeUrl || !storeUrl || !image) {
      alert('Tüm alanları doldurmanız ve görsel yüklemeniz zorunludur.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          summary,
          youtubeUrl,
          storeUrl,
          images: image,
          userId: user.id
        })
      });

      if (response.ok) {
        onUpdate();
        onClose();
        setTitle('');
        setSummary('');
        setYoutubeUrl('');
        setStoreUrl('');
        setImage(null);
      } else {
        alert('Proje paylaşılırken bir hata oluştu.');
      }
    } catch (error) {
      console.error(error);
      alert('Bağlantı hatası.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0a0a0f] border border-theme-accent/50 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[0_0_30px_rgba(var(--theme-accent),0.15)]">
        <div className="flex justify-between items-center p-6 border-b border-gray-800 sticky top-0 bg-[#0a0a0f]/90 backdrop-blur z-10">
          <h2 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
            Proje Paylaş
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-theme-accent transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Proje Adı</label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-[#12121a] border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-theme-accent transition-colors"
              placeholder="Oyununuzun adını girin..."
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Ana Fikir Özeti</label>
            <textarea 
              value={summary} 
              onChange={e => setSummary(e.target.value)}
              className="w-full bg-[#12121a] border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-theme-accent transition-colors min-h-[100px]"
              placeholder="Projenizin öne çıkan özellikleri neler?"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2"><PlayCircle size={14}/> YouTube Linki</label>
              <input 
                type="url" 
                value={youtubeUrl} 
                onChange={e => setYoutubeUrl(e.target.value)}
                className="w-full bg-[#12121a] border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-theme-accent transition-colors"
                placeholder="https://youtube.com/watch?v=..."
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2"><Store size={14}/> Mağaza Linki</label>
              <input 
                type="url" 
                value={storeUrl} 
                onChange={e => setStoreUrl(e.target.value)}
                className="w-full bg-[#12121a] border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-theme-accent transition-colors"
                placeholder="Steam, Play Store vs..."
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Proje Görseli (Base64)</label>
            <div className="border-2 border-dashed border-gray-800 hover:border-theme-accent/50 rounded-lg p-6 flex flex-col items-center justify-center bg-[#12121a] transition-colors relative overflow-hidden group">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                required={!image}
              />
              {image ? (
                <div className="w-full h-40 relative">
                  <img src={image} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white font-bold">Görseli Değiştir</p>
                  </div>
                </div>
              ) : (
                <>
                  <Upload size={32} className="text-gray-600 group-hover:text-theme-accent mb-2 transition-colors" />
                  <p className="text-gray-400 text-sm">Görsel seçmek için tıklayın veya sürükleyin</p>
                </>
              )}
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-theme-accent text-black font-black uppercase tracking-widest px-8 py-3 rounded-lg hover:bg-theme-accent/90 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? 'PAYLAŞILIYOR...' : 'PROJEYİ YAYINLA'} <Send size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
