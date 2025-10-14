// src/pages/pt/PTPackageCreate.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import PTMainLayout from '~/layouts/pt/PTMainLayout';
import { createPackage } from '~/services/packageService';

const empty = {
  name: '',
  description: '',
  price: 0,
  totalSessions: 8,
  durationDays: 30,
  visibility: 'private',
  tagsText: '' // nhập dạng chuỗi, sẽ tách thành mảng
};

export default function PTPackageCreate() {
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const setField = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name?.trim()) {
      toast.error('Vui lòng nhập tên gói');
      return;
    }
    if (!form.totalSessions || !form.durationDays) {
      toast.error('Vui lòng nhập số buổi và thời hạn');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price || 0),
        totalSessions: Number(form.totalSessions || 0),
        durationDays: Number(form.durationDays || 0),
        visibility: form.visibility,
        tags: form.tagsText
          ? form.tagsText.split(',').map(s => s.trim()).filter(Boolean)
          : []
      };

      const res = await createPackage(payload);
      toast.success('Tạo gói tập thành công');
      // điều hướng về danh sách hoặc trang manage gói vừa tạo
      navigate('/pt/packages', { replace: true })
    } catch (err) {
      const msg = err?.response?.data?.message || 'Tạo gói thất bại';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <PTMainLayout>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Create package</h1>
        <div className="flex items-center gap-3">
          <Link
            to="/pt/packages"
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-gray-200 hover:bg-white/10"
          >
            Back
          </Link>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-5 max-w-3xl">
        <div>
          <label className="block text-sm text-gray-300">Name *</label>
          <input
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 p-2 text-sm text-gray-200"
            value={form.name}
            onChange={(e) => setField('name', e.target.value)}
            placeholder="VD: 1 tháng / 8 buổi"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300">Description</label>
          <textarea
            rows={4}
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 p-2 text-sm text-gray-200"
            value={form.description}
            onChange={(e) => setField('description', e.target.value)}
            placeholder="Mô tả ngắn về gói tập, lợi ích, đối tượng phù hợp…"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm text-gray-300">Price (₫)</label>
            <input
              type="number"
              min={0}
              step="10000"
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 p-2 text-sm text-gray-200"
              value={form.price}
              onChange={(e) => setField('price', Number(e.target.value || 0))}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300">Total sessions *</label>
            <input
              type="number"
              min={1}
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 p-2 text-sm text-gray-200"
              value={form.totalSessions}
              onChange={(e) => setField('totalSessions', Number(e.target.value || 0))}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300">Duration (days) *</label>
            <input
              type="number"
              min={1}
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 p-2 text-sm text-gray-200"
              value={form.durationDays}
              onChange={(e) => setField('durationDays', Number(e.target.value || 0))}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm text-gray-300">Visibility</label>
            <select
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 p-2 text-sm text-gray-200"
              value={form.visibility}
              onChange={(e) => setField('visibility', e.target.value)}
            >
              <option value="private">private</option>
              <option value="public">public</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-300">Tags (ngăn cách bằng dấu phẩy)</label>
            <input
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 p-2 text-sm text-gray-200"
              value={form.tagsText}
              onChange={(e) => setField('tagsText', e.target.value)}
              placeholder="fat loss, muscle gain, online…"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            to="/pt/packages"
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-200 hover:bg-white/10"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Create'}
          </button>
        </div>
      </form>
    </PTMainLayout>
  );
}
