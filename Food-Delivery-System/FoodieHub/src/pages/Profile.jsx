import { useEffect, useState } from 'react';
import {
  FiCreditCard,
  FiEdit2,
  FiMapPin,
  FiPlus,
  FiSave,
  FiTrash2,
  FiUser,
  FiX,
} from 'react-icons/fi';
import Loading from '../common/Loading';
import { useAuth } from '../context/AuthContext';
import { authAPI, paymentAPI } from '../services/api';

const ROLE_COLORS = {
  customer: 'bg-blue-100 text-blue-700',
  restaurant: 'bg-orange-100 text-orange-700',
  admin: 'bg-purple-100 text-purple-700',
};

const emptyAddress = () => ({ label: 'Home', street: '', city: '', state: '', zipCode: '' });

const ProfilePage = () => {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  // ── Main profile edit (username + phone only) ──────────────────────────────
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ username: '', phone: '' });

  // ── Address management — independent of the main edit form ────────────────
  const [showAddAddr, setShowAddAddr] = useState(false);
  const [newAddr, setNewAddr] = useState(emptyAddress());
  const [addrSaving, setAddrSaving] = useState(false);

  // ── Feedback ──────────────────────────────────────────────────────────────
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ── Payment history ───────────────────────────────────────────────────────
  const [payments, setPayments] = useState(null);
  const [loadingPayments, setLoadingPayments] = useState(false);

  const flash = (msg, isError = false) => {
    if (isError) { setError(msg); setSuccess(''); }
    else { setSuccess(msg); setError(''); }
    setTimeout(() => { setError(''); setSuccess(''); }, 4000);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await authAPI.getMe();
        const p = res.data;
        setProfile(p);
        setForm({ username: p.username || '', phone: p.phone || '' });
      } catch {
        flash('Failed to load profile', true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Main profile save ─────────────────────────────────────────────────────
  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    if (!form.username.trim()) { flash('Username is required', true); return; }
    setSaving(true);
    setError(''); setSuccess('');
    try {
      const res = await authAPI.updateMe({ username: form.username, phone: form.phone });
      setProfile(res.data);
      setEditing(false);
      flash('Profile updated successfully!');
    } catch (err) {
      flash(err.message || 'Update failed', true);
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditing(false);
    setError('');
    if (profile) setForm({ username: profile.username || '', phone: profile.phone || '' });
  };

  // ── Address CRUD — each action saves to backend immediately ───────────────
  const persistAddresses = async (newList) => {
    const res = await authAPI.updateMe({ addresses: newList });
    setProfile(res.data);
  };

  const addAddress = async () => {
    if (!newAddr.street.trim() || !newAddr.city.trim()) {
      flash('Street and city are required', true);
      return;
    }
    setAddrSaving(true);
    try {
      await persistAddresses([...(profile?.addresses || []), { ...newAddr }]);
      setNewAddr(emptyAddress());
      setShowAddAddr(false);
      flash('Address saved!');
    } catch (err) {
      flash(err.message || 'Failed to add address', true);
    } finally {
      setAddrSaving(false);
    }
  };

  const removeAddress = async (idx) => {
    setAddrSaving(true);
    try {
      const newList = (profile?.addresses || []).filter((_, i) => i !== idx);
      await persistAddresses(newList);
      flash('Address removed.');
    } catch (err) {
      flash(err.message || 'Failed to remove address', true);
    } finally {
      setAddrSaving(false);
    }
  };

  // ── Payment history ───────────────────────────────────────────────────────
  const loadPayments = async () => {
    setLoadingPayments(true);
    try {
      const res = await paymentAPI.history();
      setPayments(res.data || []);
    } catch {
      setPayments([]);
    } finally {
      setLoadingPayments(false);
    }
  };

  if (loading) return <Loading fullScreen />;

  const addresses = profile?.addresses || [];

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Profile</h1>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="btn-secondary flex items-center gap-2">
            <FiEdit2 /> Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={cancelEdit} className="btn-secondary flex items-center gap-2">
              <FiX /> Cancel
            </button>
            <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
              <FiSave /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      {error && <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {success && <p className="mb-4 rounded bg-green-50 p-3 text-sm text-green-700">{success}</p>}

      <div className="space-y-6">
        {/* Account Info */}
        <section className="card space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600">
              <FiUser className="text-xl" />
            </div>
            <div>
              <p className="font-semibold">{profile?.username}</p>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${ROLE_COLORS[profile?.role] || 'bg-slate-100 text-slate-600'}`}>
                {profile?.role}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Username</label>
              {editing ? (
                <input className="input-field" value={form.username} onChange={(e) => set('username', e.target.value)} />
              ) : (
                <p className="text-slate-800">{profile?.username}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
              <p className="text-slate-500">{profile?.email}</p>
              <p className="text-xs text-slate-400">Email cannot be changed</p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Phone</label>
              {editing ? (
                <input className="input-field" type="tel" placeholder="+91 99999 00000" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
              ) : (
                <p className="text-slate-800">{profile?.phone || 'Not set'}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Member Since</label>
              <p className="text-slate-500">
                {profile?.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
                  : 'N/A'}
              </p>
            </div>
          </div>
        </section>

        {/* ── Saved Addresses (customers only) ─────────────────────────────── */}
        {profile?.role === 'customer' && (
          <section className="card space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <FiMapPin className="text-primary-600" /> Saved Addresses
              </h2>
              {/* Add button always visible — no need to enter "Edit" mode */}
              <button
                onClick={() => { setShowAddAddr(true); setNewAddr(emptyAddress()); setError(''); }}
                disabled={addrSaving || showAddAddr}
                className="btn-secondary flex items-center gap-1 text-sm"
              >
                <FiPlus /> Add Address
              </button>
            </div>

            {/* Address list */}
            {addresses.length === 0 && !showAddAddr ? (
              <p className="text-sm text-slate-400">
                No saved addresses yet. Click "Add Address" to add one and speed up checkout.
              </p>
            ) : (
              <div className="space-y-2">
                {addresses.map((addr, i) => (
                  <div key={i} className="flex items-start justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{addr.label || `Address ${i + 1}`}</p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {[addr.street, addr.city, addr.state, addr.zipCode].filter(Boolean).join(', ')}
                      </p>
                    </div>
                    <button
                      onClick={() => removeAddress(i)}
                      disabled={addrSaving}
                      className="ml-4 shrink-0 text-red-400 hover:text-red-600 disabled:opacity-40"
                      title="Remove address"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add address inline form */}
            {showAddAddr && (
              <div className="space-y-3 rounded-xl border border-primary-200 bg-primary-50 p-4">
                <h3 className="text-sm font-semibold text-primary-800">New Address</h3>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    className="input-field col-span-2 text-sm"
                    placeholder="Label (Home, Work, Other…)"
                    value={newAddr.label}
                    onChange={(e) => setNewAddr((a) => ({ ...a, label: e.target.value }))}
                  />
                  <input
                    className="input-field col-span-2 text-sm"
                    placeholder="Street address *"
                    value={newAddr.street}
                    onChange={(e) => setNewAddr((a) => ({ ...a, street: e.target.value }))}
                  />
                  <input
                    className="input-field text-sm"
                    placeholder="City *"
                    value={newAddr.city}
                    onChange={(e) => setNewAddr((a) => ({ ...a, city: e.target.value }))}
                  />
                  <input
                    className="input-field text-sm"
                    placeholder="State"
                    value={newAddr.state}
                    onChange={(e) => setNewAddr((a) => ({ ...a, state: e.target.value }))}
                  />
                  <input
                    className="input-field col-span-2 text-sm"
                    placeholder="ZIP Code"
                    value={newAddr.zipCode}
                    onChange={(e) => setNewAddr((a) => ({ ...a, zipCode: e.target.value }))}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setShowAddAddr(false); setNewAddr(emptyAddress()); }}
                    className="btn-secondary flex-1 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addAddress}
                    disabled={addrSaving}
                    className="btn-primary flex-1 text-sm"
                  >
                    {addrSaving ? 'Saving…' : 'Save Address'}
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Payment History (customers only) */}
        {profile?.role === 'customer' && (
          <section className="card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <FiCreditCard className="text-primary-600" /> Payment History
              </h2>
              {payments === null && (
                <button onClick={loadPayments} disabled={loadingPayments} className="btn-secondary text-sm">
                  {loadingPayments ? 'Loading...' : 'View History'}
                </button>
              )}
            </div>

            {payments === null ? (
              <p className="text-sm text-slate-400">Click "View History" to load your payment records.</p>
            ) : payments.length === 0 ? (
              <p className="text-sm text-slate-400">No payments on record.</p>
            ) : (
              <div className="space-y-2">
                {payments.map((p) => (
                  <div key={p._id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3 text-sm">
                    <div>
                      <p className="font-medium">
                        ₹{Number(p.amount).toFixed(2)}{' '}
                        <span className="font-normal text-slate-400">{p.currency?.toUpperCase()}</span>
                      </p>
                      <p className="text-xs text-slate-400">
                        {new Date(p.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                      {p.receiptUrl && (
                        <a href={p.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-600 hover:underline">
                          View receipt
                        </a>
                      )}
                    </div>
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                      p.status === 'succeeded' ? 'bg-green-100 text-green-700'
                        : p.status === 'failed' ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Danger Zone */}
        <section className="card border-red-200">
          <h2 className="mb-3 font-semibold text-slate-700">Account Actions</h2>
          <button
            onClick={() => { if (window.confirm('Are you sure you want to log out?')) logout(); }}
            className="btn-secondary text-sm text-red-600 hover:border-red-300 hover:bg-red-50"
          >
            Sign Out
          </button>
        </section>
      </div>
    </main>
  );
};

export default ProfilePage;
