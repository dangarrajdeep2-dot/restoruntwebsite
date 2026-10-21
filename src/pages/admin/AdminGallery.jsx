import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Upload, Image as ImageIcon, Sparkles } from 'lucide-react';
import { getGallery, createGalleryItem, deleteGalleryItem } from '../../api/gallery';
import { uploadImage } from '../../api/storage';

export default function AdminGallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    image_url: '',
    caption: '',
    category: 'food',
  });

  const loadData = async () => {
    setLoading(true);
    const { data } = await getGallery();
    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const { publicUrl, error } = await uploadImage(file, 'gallery');
      if (error) throw error;
      if (publicUrl) {
        setForm((prev) => ({ ...prev, image_url: publicUrl }));
      }
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.image_url) {
      alert('Please provide or upload an image.');
      return;
    }
    await createGalleryItem(form);
    setForm({ image_url: '', caption: '', category: 'food' });
    loadData();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this gallery photo?')) return;
    await deleteGalleryItem(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Upload & Add Form Card */}
      <div className="p-6 rounded-2xl bg-forest-900/60 border border-gold/25 shadow-xl">
        <h3 className="font-serif text-lg font-bold text-cream mb-4">
          Add Photo to Public Gallery
        </h3>

        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs items-end">
          {/* File Upload / URL */}
          <div className="md:col-span-5">
            <label className="block text-cream/80 font-medium mb-1">Image (Upload or URL)</label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                placeholder="https://..."
                className="flex-1 px-3 py-2 rounded-xl bg-forest-950 border border-gold/25 text-cream focus:outline-none focus:border-gold"
              />
              <label className="px-3 py-2 rounded-xl bg-forest-950 border border-gold/30 text-gold hover:bg-gold/10 cursor-pointer flex items-center space-x-1">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploading ? '...' : 'Upload'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Caption */}
          <div className="md:col-span-4">
            <label className="block text-cream/80 font-medium mb-1">Photo Caption</label>
            <input
              type="text"
              required
              value={form.caption}
              onChange={(e) => setForm({ ...form, caption: e.target.value })}
              placeholder="e.g. Garden Dining Pavilion at Dusk"
              className="w-full px-3 py-2 rounded-xl bg-forest-950 border border-gold/25 text-cream focus:outline-none focus:border-gold"
            />
          </div>

          {/* Category */}
          <div className="md:col-span-2">
            <label className="block text-cream/80 font-medium mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-forest-950 border border-gold/25 text-cream focus:outline-none focus:border-gold capitalize"
            >
              <option value="ambiance">Ambiance</option>
              <option value="food">Food</option>
              <option value="events">Events</option>
              <option value="outdoor">Outdoor</option>
              <option value="chef">Chef</option>
            </select>
          </div>

          {/* Submit */}
          <div className="md:col-span-1">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gold-gradient text-forest-950 font-bold uppercase tracking-wider shadow-md hover:shadow-gold/30 flex items-center justify-center"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-2xl overflow-hidden bg-forest-900 border border-gold/20 shadow-lg aspect-square flex flex-col justify-end"
          >
            <img
              src={item.image_url}
              alt={item.caption}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-transparent to-transparent" />

            <div className="relative p-3 z-10 flex items-end justify-between">
              <div className="min-w-0 flex-1 pr-2">
                <span className="text-[10px] text-gold uppercase tracking-wider block font-bold">
                  {item.category}
                </span>
                <p className="text-xs text-cream font-medium truncate">
                  {item.caption}
                </p>
              </div>

              <button
                onClick={() => handleDelete(item.id)}
                className="p-1.5 rounded-lg bg-forest-950/80 text-red-400 border border-red-500/30 hover:bg-red-900"
                title="Delete Photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
