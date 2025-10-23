// src/pages/pt/PTProfile.jsx
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import PTMainLayout from '~/layouts/pt/PTMainLayout'
import ptProfileService from '~/services/ptProfileService'
import { getMyAccount as getUserProfile, updateProfile as updateUserProfile } from '~/services/userService'

const emptyProfile = {
  coverImage: '',
  bio: '',
  specialties: [],
  yearsExperience: 0,
  certificates: [],
  gymLocation: '',
  location: { address: '', coords: { type: 'Point', coordinates: [0, 0] } },
  availableForNewClients: true,
  socials: { facebook: '', instagram: '', tiktok: '' },
  videoIntroUrl: ''
}

const emptyUser = {
  name: '',
  avatar: '',
  gender: 'other',
  dob: '',
  address: '',
  email: '',
  phone: ''
}

export default function PTProfileV1() {
  const [form, setForm] = useState(emptyProfile)
  const [user, setUser] = useState(emptyUser)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // avatar upload
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')

  const setField = (key, value) => setForm(p => ({ ...p, [key]: value }))

  useEffect(() => {
    (async () => {
      try {
        // load song song user + pt profile
        const [uRes, pRes] = await Promise.all([
          getUserProfile(),              // GET /auth/me
          ptProfileService.getMyProfile() // GET /pt/profile/me
        ])

        if (uRes?.data) setUser({ ...emptyUser, ...uRes.data })

        if (pRes?.data) {
          const d = pRes.data
          setForm({
            ...emptyProfile,
            ...d,
            socials: { ...emptyProfile.socials, ...(d.socials || {}) },
            location: {
              ...emptyProfile.location,
              ...(d.location || {}),
              coords: {
                type: 'Point',
                coordinates:
                  d.location?.coords?.coordinates?.length === 2
                    ? d.location.coords.coordinates
                    : [0, 0]
              }
            }
          })
        }
      } catch (e) {
        setError('Không tải được dữ liệu hồ sơ.')
        toast.error('Không tải được dữ liệu hồ sơ.')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

    try {
      // chuẩn hoá payload PTProfile
      const payload = { ...form }
      payload.specialties = (payload.specialties || []).map(s => s.trim()).filter(Boolean)
      payload.certificates = (payload.certificates || []).filter(c => c?.name?.trim())
      const coords = payload.location?.coords?.coordinates
      if (!Array.isArray(coords) || coords.length !== 2) {
        payload.location = {
          ...(payload.location || {}),
          coords: { type: 'Point', coordinates: [0, 0] }
        }
      }

      // gọi 2 API song song
      const [userRes, ptRes] = await Promise.all([
        updateUserProfile(
          {
            name: user.name,
            gender: user.gender,
            dob: user.dob,
            address: user.address
          },
          avatarFile // file hoặc null
        ),
        ptProfileService.upsertMyProfile(payload) // PUT /pt/profile/me
      ])

      if (userRes?.success || ptRes?.success) {
        setMessage('Đã lưu tài khoản & hồ sơ PT thành công')
        toast.success('Đã lưu tài khoản & hồ sơ PT thành công')
        // nếu có avatar mới thì giữ preview, backend đã lưu URL mới cho lần load sau
      }
    } catch (e) {
      const msg = e?.response?.data?.message || 'Lưu thất bại.'
      setError(msg)
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  const [lng, lat] = form.location?.coords?.coordinates || [0, 0]

  if (loading) {
    return (
      <PTMainLayout>
        <div className="p-6 text-gray-300">Đang tải hồ sơ…</div>
      </PTMainLayout>
    )
  }

  return (
    <PTMainLayout>
      {/* CARD 1: ACCOUNT (USER) */}
      <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="mb-4 text-lg font-semibold text-white">Account</h2>

        <div className="grid gap-4 md:grid-cols-[160px_1fr]">
          {/* Avatar + upload */}
          <div className="flex flex-col items-center gap-3">
            <div className="h-28 w-28 overflow-hidden rounded-full border border-white/10 bg-white/10">
              <img
                src={avatarPreview || user.avatar || 'https://placehold.co/200x200?text=Avatar'}
                alt="avatar"
                className="h-full w-full object-cover"
              />
            </div>
            <label className="inline-block cursor-pointer rounded-lg border border-white/10 px-3 py-1.5 text-xs text-gray-200 hover:bg-white/10">
              Choose avatar
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  setAvatarFile(f || null)
                  setAvatarPreview(f ? URL.createObjectURL(f) : '')
                }}
              />
            </label>
          </div>

          {/* Thông tin cơ bản */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-300">Name</label>
              <input
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 p-2 text-sm text-gray-200"
                value={user.name || ''}
                onChange={(e) => setUser(p => ({ ...p, name: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300">Gender</label>
              <select
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 p-2 text-sm text-gray-200"
                value={user.gender || 'other'}
                onChange={(e) => setUser(p => ({ ...p, gender: e.target.value }))}
              >
                <option value="male">male</option>
                <option value="female">female</option>
                <option value="other">other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-300">Date of birth</label>
              <input
                type="date"
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 p-2 text-sm text-gray-200"
                value={user.dob ? String(user.dob).substring(0, 10) : ''}
                onChange={(e) => setUser(p => ({ ...p, dob: e.target.value }))}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-gray-300">Address</label>
              <input
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 p-2 text-sm text-gray-200"
                value={user.address || ''}
                onChange={(e) => setUser(p => ({ ...p, address: e.target.value }))}
              />
            </div>

            <div className="md:col-span-2 grid grid-cols-2 gap-4 text-sm text-gray-400">
              <div>Email: <span className="text-gray-200">{user.email || '—'}</span></div>
              <div>Phone: <span className="text-gray-200">{user.phone || '—'}</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">PT Profile</h1>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>

      {/* FORM PT PROFILE */}
      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-5">
        {/* Cover Image URL */}
        <div>
          <label className="block text-sm text-gray-300">Cover Image URL</label>
          <input
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 p-2 text-sm text-gray-200"
            value={form.coverImage || ''}
            onChange={(e) => setField('coverImage', e.target.value)}
            placeholder="https://..."
          />
          {form.coverImage && (
            <img
              src={form.coverImage}
              alt="cover"
              className="mt-2 h-32 w-full rounded-lg object-cover border border-white/10"
            />
          )}
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm text-gray-300">Bio</label>
          <textarea
            rows={4}
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 p-2 text-sm text-gray-200"
            value={form.bio || ''}
            onChange={(e) => setField('bio', e.target.value)}
            placeholder="Giới thiệu bản thân, kinh nghiệm..."
          />
        </div>

        {/* Specialties & Years */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-300">Specialties (phẩy ngăn cách)</label>
            <input
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 p-2 text-sm text-gray-200"
              value={(form.specialties || []).join(', ')}
              onChange={(e) =>
                setField('specialties', e.target.value.split(',').map(s => s.trim()).filter(Boolean))
              }
              placeholder="fat loss, muscle gain..."
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300">Years of experience</label>
            <input
              type="number"
              min={0}
              max={50}
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 p-2 text-sm text-gray-200"
              value={form.yearsExperience || 0}
              onChange={(e) => setField('yearsExperience', Number(e.target.value || 0))}
            />
          </div>
        </div>

        {/* Gym location */}
        <div>
          <label className="block text-sm text-gray-300">Gym Location (khu vực hoạt động)</label>
          <input
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 p-2 text-sm text-gray-200"
            value={form.gymLocation || ''}
            onChange={(e) => setField('gymLocation', e.target.value)}
            placeholder="VD: Quận 7 & lân cận, hoặc Online only"
          />
        </div>

        {/* Available */}
        <div>
          <label className="inline-flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={!!form.availableForNewClients}
              onChange={(e) => setField('availableForNewClients', e.target.checked)}
            />
            Đang nhận học viên mới
          </label>
        </div>

        {/* Socials */}
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm text-gray-300">Facebook</label>
            <input
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 p-2 text-sm text-gray-200"
              value={form.socials?.facebook || ''}
              onChange={(e) => setField('socials', { ...form.socials, facebook: e.target.value })}
              placeholder="https://facebook.com/..."
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300">Instagram</label>
            <input
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 p-2 text-sm text-gray-200"
              value={form.socials?.instagram || ''}
              onChange={(e) => setField('socials', { ...form.socials, instagram: e.target.value })}
              placeholder="https://instagram.com/..."
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300">TikTok</label>
            <input
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 p-2 text-sm text-gray-200"
              value={form.socials?.tiktok || ''}
              onChange={(e) => setField('socials', { ...form.socials, tiktok: e.target.value })}
              placeholder="https://tiktok.com/@..."
            />
          </div>
        </div>

        {/* Video intro */}
        <div>
          <label className="block text-sm text-gray-300">Video intro URL</label>
          <input
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 p-2 text-sm text-gray-200"
            value={form.videoIntroUrl || ''}
            onChange={(e) => setField('videoIntroUrl', e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>

        {/* Coords */}
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm text-gray-300">Address</label>
            <input
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 p-2 text-sm text-gray-200"
              value={form.location?.address || ''}
              onChange={(e) => setField('location', { ...form.location, address: e.target.value })}
              placeholder="Số nhà/đường/phường..."
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300">Longitude (lng)</label>
            <input
              type="number"
              step="0.000001"
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 p-2 text-sm text-gray-200"
              value={lng}
              onChange={(e) =>
                setForm(p => ({
                  ...p,
                  location: { ...(p.location || {}), coords: { type: 'Point', coordinates: [Number(e.target.value), lat] } }
                }))
              }
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300">Latitude (lat)</label>
            <input
              type="number"
              step="0.000001"
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 p-2 text-sm text-gray-200"
              value={lat}
              onChange={(e) =>
                setForm(p => ({
                  ...p,
                  location: { ...(p.location || {}), coords: { type: 'Point', coordinates: [lng, Number(e.target.value)] } }
                }))
              }
            />
          </div>
        </div>
      </form>

      {(message || error) && (
        <div className={`mt-4 rounded-lg px-3 py-2 text-sm ${message ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'}`}>
          {message || error}
        </div>
      )}
    </PTMainLayout>
  )
}
