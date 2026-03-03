import { useEffect, useRef, useState } from 'react';
import { FiEdit2, FiSave, FiStar, FiUpload, FiX, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import Loading from '../../common/Loading';
import { restaurantAPI, uploadAPI } from '../../services/api';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const CUISINES = [
  'Italian', 'Indian', 'Chinese', 'Japanese', 'Mexican',
  'American', 'Mediterranean', 'Thai', 'French', 'Greek', 'Korean', 'Vietnamese',
];
const DEFAULT_HOURS = DAYS.map((day) => ({ day, open: '09:00', close: '22:00', closed: false }));
const PRICE_LABELS = { 1: '₹ (Budget)', 2: '₹₹ (Moderate)', 3: '₹₹₹ (Upscale)', 4: '₹₹₹₹ (Fine Dining)' };

const emptyForm = () => ({
  name: '',
  description: '',
  image: '',
  location: { street: '', city: '', state: '', zipCode: '' },
  cuisineType: [],
  hoursOfOperation: DEFAULT_HOURS,
  priceRange: 2,
  isOpen: true,
});

const RestaurantDashboard = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [imgUploading, setImgUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState(emptyForm());
  const imgInputRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await restaurantAPI.getMine();
        const r = res.data;
        setRestaurant(r);
        setForm({
          name: r.name || '',
          description: r.description || '',
          image: r.images?.[0] || '',
          location: r.location || { street: '', city: '', state: '', zipCode: '' },
          cuisineType: r.cuisineType || [],
          hoursOfOperation: r.hoursOfOperation?.length ? r.hoursOfOperation : DEFAULT_HOURS,
          priceRange: r.priceRange || 2,
          isOpen: r.isOpen ?? true,
        });
      } catch {
        // No restaurant yet — show create form
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const setLocation = (key, value) =>
    setForm((f) => ({ ...f, location: { ...f.location, [key]: value } }));
  const toggleCuisine = (c) =>
    setField(
      'cuisineType',
      form.cuisineType.includes(c) ? form.cuisineType.filter((x) => x !== c) : [...form.cuisineType, c]
    );
  const updateHour = (day, key, value) =>
    setField(
      'hoursOfOperation',
      form.hoursOfOperation.map((h) => (h.day === day ? { ...h, [key]: value } : h))
    );

  const handleToggleOpen = async () => {
    if (!restaurant) return;
    setToggling(true);
    setError('');
    try {
      const res = await restaurantAPI.update(restaurant._id, { isOpen: !restaurant.isOpen });
      setRestaurant(res.data);
      setSuccess(res.data.isOpen ? 'Restaurant is now Open.' : 'Restaurant is now Closed.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update status');
    } finally {
      setToggling(false);
    }
  };

  const startCreate = () => {
    setForm(emptyForm());
    setEditing(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setError('Restaurant name is required');
      return;
    }
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const { image, ...rest } = form;
      const payload = { ...rest, images: image ? [image] : [] };
      const res = restaurant
        ? await restaurantAPI.update(restaurant._id, payload)
        : await restaurantAPI.create(payload);
      setRestaurant(res.data);
      setSuccess('Restaurant profile saved successfully!');
      setEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditing(false);
    setError('');
    if (restaurant) {
      setForm({
        name: restaurant.name || '',
        description: restaurant.description || '',
        image: restaurant.images?.[0] || '',
        location: restaurant.location || { street: '', city: '', state: '', zipCode: '' },
        cuisineType: restaurant.cuisineType || [],
        hoursOfOperation: restaurant.hoursOfOperation?.length ? restaurant.hoursOfOperation : DEFAULT_HOURS,
        priceRange: restaurant.priceRange || 2,
        isOpen: restaurant.isOpen ?? true,
      });
    }
  };

  if (loading) return <Loading fullScreen />;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Restaurant Dashboard</h1>
          {restaurant && (
            <div className="mt-1 flex items-center gap-3 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1">
                <FiStar className="text-amber-500" />
                {Number(restaurant.rating || 0).toFixed(1)}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  restaurant.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
              >
                {restaurant.isOpen ? 'Open' : 'Closed'}
              </span>
            </div>
          )}
        </div>
        {!editing ? (
          restaurant ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleOpen}
                disabled={toggling}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  restaurant.isOpen
                    ? 'bg-green-100 text-green-700 hover:bg-red-50 hover:text-red-700'
                    : 'bg-red-100 text-red-700 hover:bg-green-50 hover:text-green-700'
                }`}
              >
                {restaurant.isOpen
                  ? <><FiToggleRight className="text-lg" /> Open</>
                  : <><FiToggleLeft className="text-lg" /> Closed</>}
              </button>
              <button onClick={() => setEditing(true)} className="btn-secondary flex items-center gap-2">
                <FiEdit2 /> Edit Profile
              </button>
            </div>
          ) : (
            <button onClick={startCreate} className="btn-primary">
              Create Profile
            </button>
          )
        ) : (
          <div className="flex gap-2">
            <button onClick={cancelEdit} className="btn-secondary flex items-center gap-2">
              <FiX /> Cancel
            </button>
            <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
              <FiSave /> {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}
      </div>

      {error && <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {success && <p className="mb-4 rounded bg-green-50 p-3 text-sm text-green-700">{success}</p>}

      {!restaurant && !editing && (
        <div className="card py-16 text-center">
          <p className="mb-4 text-slate-500">
            You haven&apos;t set up your restaurant profile yet.
          </p>
          <button onClick={startCreate} className="btn-primary">
            Create Restaurant Profile
          </button>
        </div>
      )}

      {(restaurant || editing) && (
        <div className="space-y-6">
          {/* Basic Info */}
          <section className="card space-y-4">
            <h2 className="text-lg font-semibold">Basic Information</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Restaurant Name *</label>
                {editing ? (
                  <input
                    className="input-field"
                    value={form.name}
                    onChange={(e) => setField('name', e.target.value)}
                    placeholder="e.g. The Golden Fork"
                  />
                ) : (
                  <p className="font-medium">{restaurant?.name}</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Price Range</label>
                {editing ? (
                  <select
                    className="input-field"
                    value={form.priceRange}
                    onChange={(e) => setField('priceRange', Number(e.target.value))}
                  >
                    {[1, 2, 3, 4].map((p) => (
                      <option key={p} value={p}>
                        {PRICE_LABELS[p]}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p>{'₹'.repeat(restaurant?.priceRange || 2)}</p>
                )}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Description</label>
              {editing ? (
                <textarea
                  className="input-field h-24 resize-none"
                  value={form.description}
                  onChange={(e) => setField('description', e.target.value)}
                  placeholder="Describe your restaurant, specialties, ambiance..."
                />
              ) : (
                <p className="text-slate-600">{restaurant?.description || 'No description provided.'}</p>
              )}
            </div>

            {/* Restaurant Image */}
            <div>
              <label className="mb-1 block text-sm font-medium">Restaurant Image</label>
              {editing ? (
                <div className="space-y-2">
                  {/* hidden file input */}
                  <input
                    ref={imgInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setImgUploading(true);
                      try {
                        const res = await uploadAPI.image(file);
                        setField('image', res.data.url);
                      } catch {
                        setError('Image upload failed');
                      } finally {
                        setImgUploading(false);
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => imgInputRef.current?.click()}
                    disabled={imgUploading}
                    className="btn-secondary flex items-center gap-2 text-sm"
                  >
                    <FiUpload />
                    {imgUploading ? 'Uploading…' : 'Upload Image'}
                  </button>
                  {form.image && (
                    <img
                      src={form.image}
                      alt="Preview"
                      className="h-32 w-full rounded-xl object-cover"
                      onError={(e) => (e.target.style.display = 'none')}
                    />
                  )}
                </div>
              ) : restaurant?.images?.[0] ? (
                <img
                  src={restaurant.images[0]}
                  alt={restaurant.name}
                  className="h-40 w-full rounded-xl object-cover"
                  onError={(e) => (e.target.style.display = 'none')}
                />
              ) : (
                <p className="text-sm text-slate-400">No image set</p>
              )}
            </div>

            {editing && (
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300"
                  checked={form.isOpen}
                  onChange={(e) => setField('isOpen', e.target.checked)}
                />
                <span className="text-sm font-medium">Currently accepting orders</span>
              </label>
            )}
          </section>

          {/* Location */}
          <section className="card space-y-4">
            <h2 className="text-lg font-semibold">Location</h2>
            {editing ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <input
                    className="input-field"
                    placeholder="Street address"
                    value={form.location.street}
                    onChange={(e) => setLocation('street', e.target.value)}
                  />
                </div>
                <input
                  className="input-field"
                  placeholder="City"
                  value={form.location.city}
                  onChange={(e) => setLocation('city', e.target.value)}
                />
                <input
                  className="input-field"
                  placeholder="State"
                  value={form.location.state}
                  onChange={(e) => setLocation('state', e.target.value)}
                />
                <input
                  className="input-field sm:col-span-2"
                  placeholder="ZIP Code"
                  value={form.location.zipCode}
                  onChange={(e) => setLocation('zipCode', e.target.value)}
                />
              </div>
            ) : (
              <p className="text-slate-600">
                {[
                  restaurant?.location?.street,
                  restaurant?.location?.city,
                  restaurant?.location?.state,
                  restaurant?.location?.zipCode,
                ]
                  .filter(Boolean)
                  .join(', ') || 'No location set'}
              </p>
            )}
          </section>

          {/* Cuisine Types */}
          <section className="card space-y-3">
            <h2 className="text-lg font-semibold">Cuisine Types</h2>
            <div className="flex flex-wrap gap-2">
              {CUISINES.map((c) => {
                const selected = (editing ? form.cuisineType : restaurant?.cuisineType || []).includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    disabled={!editing}
                    onClick={() => editing && toggleCuisine(c)}
                    className={`rounded-full border px-3 py-1 text-sm font-medium transition ${
                      selected
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-slate-300 text-slate-500 hover:border-primary-400 disabled:cursor-default'
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Hours of Operation */}
          <section className="card space-y-4">
            <h2 className="text-lg font-semibold">Hours of Operation</h2>
            <div className="divide-y divide-slate-100">
              {(editing ? form.hoursOfOperation : restaurant?.hoursOfOperation || DEFAULT_HOURS).map(
                (hour) => (
                  <div key={hour.day} className="flex flex-wrap items-center gap-3 py-2.5 text-sm first:pt-0 last:pb-0">
                    {/* Day name */}
                    <span className="w-24 shrink-0 font-medium text-slate-700">{hour.day}</span>

                    {editing ? (
                      <>
                        {/* Open / Closed toggle pill */}
                        <button
                          type="button"
                          onClick={() => updateHour(hour.day, 'closed', !hour.closed)}
                          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition ${
                            hour.closed
                              ? 'bg-red-100 text-red-600 hover:bg-red-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {hour.closed ? 'Closed' : 'Open'}
                        </button>

                        {/* Time inputs — only visible when open */}
                        {!hour.closed && (
                          <>
                            <input
                              type="time"
                              className="input-field w-28 text-sm"
                              value={hour.open}
                              onChange={(e) => updateHour(hour.day, 'open', e.target.value)}
                            />
                            <span className="text-slate-400">–</span>
                            <input
                              type="time"
                              className="input-field w-28 text-sm"
                              value={hour.close}
                              onChange={(e) => updateHour(hour.day, 'close', e.target.value)}
                            />
                          </>
                        )}
                      </>
                    ) : (
                      <span className={`font-medium ${hour.closed ? 'text-red-500' : 'text-slate-600'}`}>
                        {hour.closed ? 'Closed' : `${hour.open} – ${hour.close}`}
                      </span>
                    )}
                  </div>
                )
              )}
            </div>
          </section>
        </div>
      )}
    </main>
  );
};

export default RestaurantDashboard;
