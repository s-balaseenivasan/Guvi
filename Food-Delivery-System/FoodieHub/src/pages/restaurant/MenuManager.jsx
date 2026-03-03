import { useEffect, useRef, useState } from 'react';
import { FiEdit2, FiPlus, FiSave, FiToggleLeft, FiToggleRight, FiTrash2, FiUpload, FiX } from 'react-icons/fi';
import Loading from '../../common/Loading';
import { menuAPI, restaurantAPI, uploadAPI } from '../../services/api';

const EMPTY_FORM = {
  name: '',
  category: '',
  description: '',
  price: '',
  image: '',
  isAvailable: true,
  nutritionInfo: { calories: '', protein: '', carbs: '', fat: '' },
  addOns: [],
};

const MenuItemForm = ({ initial, onSave, onCancel }) => {
  const [form, setForm] = useState(initial);
  const [addonInput, setAddonInput] = useState({ name: '', price: '' });
  const [saving, setSaving] = useState(false);
  const [imgUploading, setImgUploading] = useState(false);
  const [error, setError] = useState('');
  const imgInputRef = useRef(null);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const setNutrition = (key, value) =>
    setForm((f) => ({ ...f, nutritionInfo: { ...f.nutritionInfo, [key]: value } }));

  const addAddon = () => {
    if (!addonInput.name || addonInput.price === '') return;
    setForm((f) => ({
      ...f,
      addOns: [...f.addOns, { name: addonInput.name.trim(), price: Number(addonInput.price) }],
    }));
    setAddonInput({ name: '', price: '' });
  };

  const removeAddon = (i) =>
    setForm((f) => ({ ...f, addOns: f.addOns.filter((_, j) => j !== i) }));

  const handleSave = async () => {
    if (!form.name.trim() || !form.category.trim() || form.price === '') {
      setError('Name, category, and price are required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSave({ ...form, price: Number(form.price) });
    } catch (err) {
      setError(err.message || 'Save failed');
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 py-8">
      <div className="card w-full max-w-lg p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {initial._id ? 'Edit Menu Item' : 'Add Menu Item'}
          </h2>
          <button onClick={onCancel} className="rounded p-1 hover:bg-slate-100">
            <FiX className="text-xl" />
          </button>
        </div>

        {error && <p className="mb-3 rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>}

        <div className="space-y-3">
          {/* Name & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium">Name *</label>
              <input
                className="input-field"
                placeholder="e.g. Margherita Pizza"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Category *</label>
              <input
                className="input-field"
                placeholder="e.g. Pizza, Drinks"
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
              />
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="mb-1 block text-xs font-medium">Price (₹) *</label>
            <input
              className="input-field"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={form.price}
              onChange={(e) => set('price', e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-xs font-medium">Description</label>
            <textarea
              className="input-field h-16 resize-none"
              placeholder="Brief description of the item..."
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="mb-1 block text-xs font-medium">Image</label>
            <input
              ref={imgInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setImgUploading(true);
                setError('');
                try {
                  const res = await uploadAPI.image(file);
                  set('image', res.data.url);
                } catch {
                  setError('Image upload failed');
                } finally {
                  setImgUploading(false);
                  e.target.value = '';
                }
              }}
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => imgInputRef.current?.click()}
                disabled={imgUploading}
                className="btn-secondary flex items-center gap-1.5 text-xs"
              >
                <FiUpload size={12} />
                {imgUploading ? 'Uploading…' : 'Upload Image'}
              </button>
              {form.image && (
                <img
                  src={form.image}
                  alt="preview"
                  className="h-10 w-10 rounded-lg object-cover"
                  onError={(e) => (e.target.style.display = 'none')}
                />
              )}
            </div>
          </div>

          {/* Availability */}
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={form.isAvailable}
              onChange={(e) => set('isAvailable', e.target.checked)}
            />
            <span className="text-sm font-medium">Available for ordering</span>
          </label>

          {/* Nutrition Info */}
          <div className="rounded-lg border border-slate-200 p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Nutrition Info (optional)
            </p>
            <div className="grid grid-cols-2 gap-2">
              {['calories', 'protein', 'carbs', 'fat'].map((field) => (
                <input
                  key={field}
                  className="input-field text-sm"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={form.nutritionInfo[field] || ''}
                  onChange={(e) => setNutrition(field, e.target.value)}
                />
              ))}
            </div>
          </div>

          {/* Add-ons */}
          <div className="rounded-lg border border-slate-200 p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Add-ons / Extras
            </p>
            {form.addOns.length > 0 && (
              <ul className="mb-2 space-y-1">
                {form.addOns.map((addon, i) => (
                  <li key={i} className="flex items-center justify-between rounded bg-slate-50 px-2 py-1 text-sm">
                    <span>
                      {addon.name}{' '}
                      <span className="text-primary-600">+₹{Number(addon.price).toFixed(2)}</span>
                    </span>
                    <button
                      onClick={() => removeAddon(i)}
                      className="ml-2 text-red-400 hover:text-red-600"
                    >
                      <FiX />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex gap-2">
              <input
                className="input-field flex-1 text-sm"
                placeholder="Add-on name"
                value={addonInput.name}
                onChange={(e) => setAddonInput((a) => ({ ...a, name: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && addAddon()}
              />
              <input
                className="input-field w-20 text-sm"
                type="number"
                min="0"
                step="0.01"
                placeholder="Price"
                value={addonInput.price}
                onChange={(e) => setAddonInput((a) => ({ ...a, price: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && addAddon()}
              />
              <button onClick={addAddon} className="btn-secondary px-3">
                <FiPlus />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button onClick={onCancel} className="btn-secondary flex-1">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving} className="btn-primary flex flex-1 items-center justify-center gap-2">
              <FiSave />
              {saving ? 'Saving...' : initial._id ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MenuManager = () => {
  const [items, setItems] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formItem, setFormItem] = useState(null); // null = closed, EMPTY_FORM = create, item = edit
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await restaurantAPI.getMine();
        setRestaurantId(res.data._id);
        const menuRes = await menuAPI.getByRestaurant(res.data._id);
        setItems(menuRes.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load menu. Make sure your restaurant profile is set up.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async (payload) => {
    if (formItem?._id) {
      const res = await menuAPI.update(formItem._id, payload);
      setItems((prev) => prev.map((i) => (i._id === formItem._id ? res.data : i)));
    } else {
      const res = await menuAPI.create(payload);
      setItems((prev) => [...prev, res.data]);
    }
    setFormItem(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this menu item? This cannot be undone.')) return;
    try {
      await menuAPI.remove(id);
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      alert(err.message || 'Delete failed');
    }
  };

  const toggleAvailability = async (item) => {
    try {
      const res = await menuAPI.update(item._id, { isAvailable: !item.isAvailable });
      setItems((prev) => prev.map((i) => (i._id === item._id ? res.data : i)));
    } catch (err) {
      alert(err.message || 'Update failed');
    }
  };

  const grouped = items.reduce((acc, item) => {
    const key = item.category || 'Uncategorized';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  if (loading) return <Loading fullScreen />;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Menu Manager</h1>
          <p className="mt-1 text-sm text-slate-500">{items.length} item{items.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setFormItem(EMPTY_FORM)}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus /> Add Item
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      {Object.keys(grouped).length === 0 ? (
        <div className="card py-20 text-center">
          <p className="mb-2 text-slate-500">Your menu is empty.</p>
          <button onClick={() => setFormItem(EMPTY_FORM)} className="btn-primary mt-2">
            Add Your First Item
          </button>
        </div>
      ) : (
        Object.entries(grouped).map(([category, categoryItems]) => (
          <section key={category} className="mb-8">
            <h2 className="mb-3 border-b border-slate-200 pb-2 text-xl font-semibold">
              {category}
              <span className="ml-2 text-sm font-normal text-slate-400">
                ({categoryItems.length})
              </span>
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {categoryItems.map((item) => (
                <article key={item._id} className="card flex items-start gap-3">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 shrink-0 rounded-lg object-cover"
                      onError={(e) => (e.target.style.display = 'none')}
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold">{item.name}</h3>
                        {item.description && (
                          <p className="line-clamp-2 text-sm text-slate-500">{item.description}</p>
                        )}
                      </div>
                      <p className="shrink-0 font-semibold text-primary-600">
                        ₹{Number(item.price).toFixed(2)}
                      </p>
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-xs">
                      {item.nutritionInfo?.calories && (
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-600">
                          {item.nutritionInfo.calories} cal
                        </span>
                      )}
                      {item.addOns?.length > 0 && (
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-600">
                          {item.addOns.length} add-on{item.addOns.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => toggleAvailability(item)}
                        className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                          item.isAvailable
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {item.isAvailable ? (
                          <>
                            <FiToggleRight /> Available
                          </>
                        ) : (
                          <>
                            <FiToggleLeft /> Unavailable
                          </>
                        )}
                      </button>
                      <button
                        onClick={() =>
                          setFormItem({
                            ...item,
                            price: String(item.price),
                            nutritionInfo: item.nutritionInfo || { calories: '', protein: '', carbs: '', fat: '' },
                          })
                        }
                        className="rounded p-1 text-slate-400 hover:text-primary-600"
                        title="Edit"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="rounded p-1 text-slate-400 hover:text-red-600"
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))
      )}

      {formItem !== null && (
        <MenuItemForm
          initial={formItem}
          onSave={handleSave}
          onCancel={() => setFormItem(null)}
        />
      )}
    </main>
  );
};

export default MenuManager;
