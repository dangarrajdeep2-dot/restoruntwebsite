import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Layers } from 'lucide-react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../api/categories';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    sort_order: 1,
    description: '',
  });

  const loadData = async () => {
    setLoading(true);
    const { data } = await getCategories();
    if (data) setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({
      name: '',
      slug: '',
      sort_order: categories.length + 1,
      description: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingId(cat.id);
    setForm({
      name: cat.name,
      slug: cat.slug,
      sort_order: cat.sort_order || 1,
      description: cat.description || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    await deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateCategory(editingId, form);
    } else {
      await createCategory(form);
    }
    setModalOpen(false);
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg font-bold text-cream">Menu Categories</h3>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-gold-gradient text-forest-950 font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 shadow-md"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="p-5 rounded-2xl bg-forest-900/60 border border-gold/20 shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-gold uppercase font-mono tracking-wider">
                  Order: #{cat.sort_order}
                </span>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1 rounded text-cream/70 hover:text-gold"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="p-1 rounded text-cream/70 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h4 className="font-serif text-base font-bold text-cream mb-1">
                {cat.name}
              </h4>
              <p className="text-xs text-cream/60 line-clamp-2">
                {cat.description || 'No description provided.'}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-forest-800 text-[11px] font-mono text-gold/70">
              slug: {cat.slug}
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-forest-900 border border-gold/30 rounded-2xl p-6 shadow-2xl">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-cream/70 hover:text-gold"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-lg font-bold text-cream mb-4">
              {editingId ? 'Edit Category' : 'Create Category'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-cream/80 font-medium mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                    setForm({ ...form, name, slug: editingId ? form.slug : slug });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-forest-950 border border-gold/25 text-cream focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-cream/80 font-medium mb-1">URL Slug *</label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-forest-950 border border-gold/25 text-cream font-mono focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-cream/80 font-medium mb-1">Display Sort Order</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-forest-950 border border-gold/25 text-cream focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-cream/80 font-medium mb-1">Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-forest-950 border border-gold/25 text-cream focus:outline-none focus:border-gold resize-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gold/30 text-cream/70"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gold-gradient text-forest-950 font-bold uppercase tracking-wider shadow-lg"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
