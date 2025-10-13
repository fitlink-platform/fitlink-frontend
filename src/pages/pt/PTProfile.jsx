import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import PTMainLayout from '~/layouts/pt/PTMainLayout'
import ptProfileService from '~/services/ptProfileService'

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

export default function PTProfile() {
    const [form, setForm] = useState(emptyProfile)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const setField = (key, value) => setForm(p => ({ ...p, [key]: value }))

    useEffect(() => {
        (async () => {
            try {
                const res = await ptProfileService.getMyProfile()
                if (res?.data) {
                    const d = res.data
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
                setError('Không tải được hồ sơ PT.')
                toast.error('Không tải được hồ sơ PT.')
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
            const payload = { ...form }
            payload.specialties = (payload.specialties || []).map(s => s.trim()).filter(Boolean)
            payload.certificates = (payload.certificates || []).filter(c => c?.name?.trim())
            const coords = payload.location?.coords?.coordinates
            if (!Array.isArray(coords) || coords.length !== 2) {
                payload.location.coords.coordinates = [0, 0]
            }
            const res = await ptProfileService.upsertMyProfile(payload)
            if (res?.success) {
                setMessage('Đã lưu hồ sơ PT thành công ✅')
                toast.success('Đã lưu hồ sơ PT thành công ✅')
            }
        } catch (e) {
            setError(e?.response?.data?.message || 'Lưu thất bại.')
            toast.error(e?.response?.data?.message || 'Lưu thất bại.')
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

            {/* phần dưới sẽ cuộn riêng vì main của layout đã overflow-y-auto */}
            <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-5">
                {/* Cover Image */}
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

                {/* Specialties & years */}
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

                {/* Available toggle */}
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
        </PTMainLayout>
    )
}
