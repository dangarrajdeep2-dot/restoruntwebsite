import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Search, 
  Sparkles, 
  Check, 
  X,
  Flame,
  Image as ImageIcon
} from 'lucide-react';
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '../../api/menu';
import { getCategories } from '../../api/categories';
import { uploadImage } from '../../api/storage';

export default function AdminMenu() {
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingDish, setEditingDish] = useState(null); // null when not modal
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form state for add / edit
  const [form, setForm] = useState({
    name: '',
    category_id: '',
    description: '',
    price: '',
    type: 'veg',
    spice_level: 1,
    image_url: '',
    chef_special: false,
    is_available: true,
    preparation_time: 15,
  });

  const loadData = async () => {
    setLoading(true);
    const [dishRes, catRes] = await Promise.all([
      getMenuItems(),
      getCategories(),
    ]);
    if (dishRes.data) setDishes(dishRes.data);
    if (catRes.data) setCategories(catRes.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingDish({ id: null });
    setForm({
      name: '',
      category_id: categories[0]?.id || '',
      description: '',
      price: '',
      type: 'veg',
      spice_level: 1,
      image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
      chef_special: false,
      is_available: true,
      preparation_time: 15,
    });
  };

  const handleOpenEdit = (dish) => {
    setEditingDish(dish);
    setForm({
      name: dish.name,
      category_id: dish.category_id,
      description: dish.description || '',
      price: dish.price,
      type: dish.type,
      spice_level: dish.spice_level || 1,
      image_url: dish.image_url || '',
      chef_special: dish.chef_special || false,
      is_available: dish.is_available !== false,
      preparation_time: dish.preparation_time || 15,
    });
  };

  const handleToggleAvailable = async (dish) => {
    const updatedStatus = !dish.is_available;
    await updateMenuItem(dish.id, { is_available: updatedStatus });
    setDishes((prev) =>
      prev.map((d) => (d.id === dish.id ? { ...d, is_available: updatedStatus } : d))
    );
  };

  const handleDelete = async (dishId) => {
    if (!window.confirm('Are you sure you want to delete this dish from the menu?')) return;
    await deleteMenuItem(dishId);
    setDishes((prev) => prev.filter((d) => d.id !== dishId));
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const { publicUrl, error } = await uploadImage(file, 'menu-images');
      if (error) throw error;
      if (publicUrl) {
        setForm((prev) => ({ ...prev, image_url: publicUrl }));
      }
    } catch (err) {
      alert('Failed to upload image: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      spice_level: Number(form.spice_level),
      preparation_time: Number(form.preparation_time),
    };

    if (editingDish.id) {
      // Update
      await updateMenuItem(editingDish.id, payload);
    } else {
      // Create
      await createMenuItem(payload);
    }

    setEditingDish(null);
    loadData();
  };

  const filtered = dishes.filter((d) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return d.name?.toLowerCase().includes(q) || d.description?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/60" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dishes..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-forest-900 border border-gold/25 text-cream text-xs focus:outline-none focus:border-gold"
          />
        </div>

        <button
          onClick={handleOpenAdd}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gold-gradient text-forest-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg hover:shadow-gold/30"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Dish</span>
        </button>
      </div>

      {/* Dishes Table */}
      <div className="rounded-2xl bg-forest-900/60 border border-gold/25 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-forest-950 border-b border-gold/20 text-gold uppercase tracking-wider">
                <th className="py-3 px-4">Dish</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Available</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-800">
              {filtered.map((dish) => {
                const cat = categories.find((c) => c.id === dish.category_id);
                return (
                  <tr key={dish.id} className="hover:bg-forest-800/40 transition-colors">
                    <td className="py-3 px-4 flex items-center space-x-3">
                      <img
                        src={dish.image_url || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=150&q=80'}
                        alt={dish.name}
                        className="w-10 h-10 rounded-lg object-cover border border-gold/20 flex-shrink-0"
                      />
                      <div>
                        <div className="font-semibold text-cream">{dish.name}</div>
                        <div className="text-[10px] text-cream/50 line-clamp-1">{dish.description}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-cream/80">
                      {cat?.name || 'Kathiyawadi'}
                    </td>
                    <td className="py-3 px-4 font-serif font-bold text-gold">
                      ₹{dish.price}
                    </td>
                    <td className="py-3 px-4 uppercase text-[10px] font-bold">
                      <span className={dish.type === 'jain' ? 'text-amber-400' : 'text-emerald-400'}>
                        ● {dish.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleAvailable(dish)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase transition-colors ${
                          dish.is_available
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-red-500/20 text-red-300 border border-red-500/40'
                        }`}
                      >
                        {dish.is_available ? 'Available' : 'Out of Stock'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenEdit(dish)}
                          className="p-1.5 rounded-lg bg-forest-950 border border-gold/30 text-gold hover:bg-gold hover:text-forest-950"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(dish.id)}
                          className="p-1.5 rounded-lg bg-forest-950 border border-red-500/30 text-red-400 hover:bg-red-900/60"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Dish Modal */}
      {editingDish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-forest-900 border border-gold/30 rounded-2xl p-6 shadow-2xl">
            <button
              onClick={() => setEditingDish(null)}
              className="absolute top-4 right-4 p-2 text-cream/70 hover:text-gold"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-xl font-bold text-cream mb-4">
              {editingDish.id ? 'Edit Menu Dish' : 'Add New Dish to Menu'}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-cream/80 font-medium mb-1">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Ringan No Olo"
                  className="w-full px-3 py-2 rounded-xl bg-forest-950 border border-gold/25 text-cream focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-cream/80 font-medium mb-1">Category *</label>
                  <select
                    value={form.category_id}
                    onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-forest-950 border border-gold/25 text-cream focus:outline-none focus:border-gold"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-cream/80 font-medium mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="e.g. 220"
                    className="w-full px-3 py-2 rounded-xl bg-forest-950 border border-gold/25 text-cream focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-cream/80 font-medium mb-1">Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Ingredients, preparation details, tadka aroma..."
                  className="w-full px-3 py-2 rounded-xl bg-forest-950 border border-gold/25 text-cream focus:outline-none focus:border-gold resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-cream/80 font-medium mb-1">Diet Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-forest-950 border border-gold/25 text-cream focus:outline-none focus:border-gold"
                  >
                    <option value="veg">Vegetarian</option>
                    <option value="jain">Jain Friendly</option>
                    <option value="non-veg">Non-Veg</option>
                  </select>
                </div>

                <div>
                  <label className="block text-cream/80 font-medium mb-1">Spice (1-3)</label>
                  <select
                    value={form.spice_level}
                    onChange={(e) => setForm({ ...form, spice_level: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-forest-950 border border-gold/25 text-cream focus:outline-none focus:border-gold"
                  >
                    <option value={1}>1 - Mild</option>
                    <option value={2}>2 - Medium</option>
                    <option value={3}>3 - Spicy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-cream/80 font-medium mb-1">Prep Time (min)</label>
                  <input
                    type="number"
                    min={5}
                    value={form.preparation_time}
                    onChange={(e) => setForm({ ...form, preparation_time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-forest-950 border border-gold/25 text-cream focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-cream/80 font-medium mb-1">Dish Image URL or Upload</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.image_url}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    placeholder="https://images.unsplash..."
                    className="flex-1 px-3 py-2 rounded-xl bg-forest-950 border border-gold/25 text-cream focus:outline-none focus:border-gold"
                  />
                  <label className="px-3 py-2 rounded-xl bg-forest-950 border border-gold/30 text-gold hover:bg-gold/10 cursor-pointer flex items-center space-x-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.chef_special}
                    onChange={(e) => setForm({ ...form, chef_special: e.target.checked })}
                    className="rounded text-gold focus:ring-0"
                  />
                  <span className="text-cream">Chef's Special Badge</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_available}
                    onChange={(e) => setForm({ ...form, is_available: e.target.checked })}
                    className="rounded text-gold focus:ring-0"
                  />
                  <span className="text-cream">Available in Stock</span>
                </label>
              </div>

              <div className="pt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingDish(null)}
                  className="px-4 py-2.5 rounded-xl border border-gold/30 text-cream/70"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gold-gradient text-forest-950 font-bold uppercase tracking-wider shadow-lg"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
