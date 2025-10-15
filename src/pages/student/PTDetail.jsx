import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getPTDetailPublic } from '~/services/ptProfileService'
import { getPackagesByPTPublic } from '~/services/packageService'
import {
    FaFacebook,
    FaInstagram,
    FaTiktok,
    FaMapMarkerAlt,
    FaArrowLeft
} from 'react-icons/fa'
import PackageDetailModal from '~/components/student/PackageDetailModel'

const PTDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [ptDetail, setPtDetail] = useState(null)
    const [packages, setPackages] = useState([])
    const [error, setError] = useState('')
    const [selectedPackage, setSelectedPackage] = useState(null)


    const handleGetPtDetail = async () => {
        try {
            const res = await getPTDetailPublic(id)
            setPtDetail(res.data)
        } catch (e) {
            setError('Something went wrong!')
        }
    }

    const handleGetPackagePublic = async () => {
        try {
            const res = await getPackagesByPTPublic(id)
            setPackages(res?.data || [])
        } catch (e) {
            setError('Something went wrong!')
        }
    }

    useEffect(() => {
        handleGetPtDetail()
        handleGetPackagePublic()
    }, [id])

    if (error)
        return <div className="text-center text-red-500 mt-10">{error}</div>
    if (!ptDetail)
        return <div className="text-center text-gray-400 mt-10">Loading...</div>

    const {
        user,
        coverImage,
        bio,
        specialties,
        yearsExperience,
        certificates,
        location,
        socials,
        gymLocation
    } = ptDetail

    return (
        <div className="min-h-screen bg-gray-50 pb-20 relative">
            <div className="relative w-full h-80 md:h-[360px]">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 left-4 z-30 flex items-center gap-2 bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md transition"
                >
                    <FaArrowLeft className="text-sm" />
                    <span>Quay lại</span>
                </button>

                {/* Ảnh cover */}
                <img
                    src={coverImage}
                    alt="cover"
                    className="w-full h-full object-cover rounded-b-3xl shadow-md"
                />

                {/* Lớp overlay mờ */}
                <div className="absolute inset-0 bg-black/30 rounded-b-3xl" />

                {/* Avatar PT */}
                <div className="absolute -bottom-16 left-1/2 md:left-24 transform -translate-x-1/2 md:translate-x-0">
                    <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-40 h-40 md:w-44 md:h-44 rounded-full border-4 border-white shadow-xl object-cover"
                    />
                </div>
            </div>

            {/* Info Section */}
            <div className="max-w-5xl mx-auto mt-24 px-6">
                <div className="text-center md:text-left">
                    <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                    <p className="text-indigo-600 font-medium mt-1">
                        Certified Personal Trainer
                    </p>

                    <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4 text-gray-700">
                        <p>📧 {user.email}</p>
                        <p>📞 {user.phone}</p>
                        <p>
                            <FaMapMarkerAlt className="inline mr-1 text-indigo-500" />{' '}
                            {location?.address || gymLocation}
                        </p>
                    </div>
                </div>

                {/* Bio */}
                <div className="mt-8 bg-white rounded-2xl shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">
                        🧠 Giới thiệu
                    </h2>
                    <p className="text-gray-700 leading-relaxed">{bio}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                        <span className="bg-indigo-100 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full">
                            Kinh nghiệm: {yearsExperience} năm
                        </span>
                        {ptDetail.verified ? (
                            <span className="bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">
                                ✅ Đã xác minh
                            </span>
                        ) : (
                            <span className="bg-yellow-100 text-yellow-700 text-sm font-medium px-3 py-1 rounded-full">
                                ⏳ Chưa xác minh
                            </span>
                        )}
                    </div>
                </div>

                {/* Specialties */}
                <div className="mt-8 bg-white rounded-2xl shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        🔥 Chuyên môn
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {specialties.map((spec, idx) => (
                            <span
                                key={idx}
                                className="bg-indigo-50 text-indigo-700 font-medium px-4 py-2 rounded-full shadow-sm text-sm"
                            >
                                {spec}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Certificates */}
                <div className="mt-8 bg-white rounded-2xl shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        📜 Chứng chỉ
                    </h2>
                    <div className="space-y-3">
                        {certificates.map((c) => (
                            <div
                                key={c._id}
                                className="flex justify-between items-center border-b border-gray-100 pb-2"
                            >
                                <div>
                                    <p className="font-medium text-gray-800">{c.name}</p>
                                    <p className="text-gray-500 text-sm">
                                        {c.issuer} • {c.year}
                                    </p>
                                </div>
                                {c.url && (
                                    <a
                                        href={c.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-600 hover:underline text-sm"
                                    >
                                        Xem →
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Socials */}
                <div className="mt-8 bg-white rounded-2xl shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        🌐 Mạng xã hội
                    </h2>
                    <div className="flex gap-5 text-2xl text-gray-600">
                        {socials.facebook && (
                            <a
                                href={socials.facebook}
                                target="_blank"
                                rel="noreferrer"
                                className="hover:text-indigo-600"
                            >
                                <FaFacebook />
                            </a>
                        )}
                        {socials.instagram && (
                            <a
                                href={socials.instagram}
                                target="_blank"
                                rel="noreferrer"
                                className="hover:text-pink-500"
                            >
                                <FaInstagram />
                            </a>
                        )}
                        {socials.tiktok && (
                            <a
                                href={socials.tiktok}
                                target="_blank"
                                rel="noreferrer"
                                className="hover:text-black"
                            >
                                <FaTiktok />
                            </a>
                        )}
                    </div>
                </div>

                {/* Packages */}
                <div className="mt-10">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        💪 Gói tập luyện
                    </h2>
                    {packages.length === 0 ? (
                        <p className="text-gray-500 italic">Chưa có gói nào được đăng.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {packages.map((pkg) => (
                                <div
                                    key={pkg._id}
                                    className="bg-white border border-gray-100 rounded-2xl shadow-md p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="flex flex-col h-full">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-indigo-700">
                                                {pkg.name}
                                            </h3>
                                            <p className="text-gray-600 mt-2 line-clamp-3 text-sm">
                                                {pkg.description}
                                            </p>
                                            <p className="mt-3 text-gray-800 font-bold text-base">
                                                💰 {pkg.price?.toLocaleString()} VND
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                ⏱ Thời lượng: {pkg.duration} ngày
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => setSelectedPackage(pkg)}
                                            className="mt-4 w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white py-2.5 rounded-lg font-semibold text-sm transition"
                                        >
                                            Xem chi tiết
                                        </button>

                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {selectedPackage && (
                <PackageDetailModal
                    pkg={selectedPackage}
                    onClose={() => setSelectedPackage(null)}
                />
            )}

        </div>

    )
}

export default PTDetail