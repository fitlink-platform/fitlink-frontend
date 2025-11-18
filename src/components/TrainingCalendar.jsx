// import React, { useEffect, useState, useContext } from 'react'
// import { Calendar, momentLocalizer } from 'react-big-calendar'
// import moment from 'moment'
// import 'react-big-calendar/lib/css/react-big-calendar.css'
// import { AuthContext } from '~/contexts/AuthContext'
// import { fetchTrainingSessions } from '~/services/trainingSessionService'
// import { fetchStudentPackages } from '~/services/studentPackage'
// import { ChevronDown, ChevronRight, ArrowLeft } from 'lucide-react'
// import { useNavigate } from 'react-router-dom'

// moment.locale('vi')
// const localizer = momentLocalizer(moment)

// const TrainingCalendar = ({ role = 'student' }) => {
//   const { user } = useContext(AuthContext)
//   const [events, setEvents] = useState([])
//   const [packages, setPackages] = useState([])
//   const [expandedPT, setExpandedPT] = useState(null)
//   const [selectedPackage, setSelectedPackage] = useState(null)
//   const [currentDate, setCurrentDate] = useState(new Date())
//   const [view, setView] = useState('week')
//   const navigate = useNavigate()

//   useEffect(() => {
//     if (user?._id) loadPackages()
//   }, [user])

//   const loadPackages = async () => {
//     try {
//       const data = await fetchStudentPackages()
//       setPackages(data.data || [])
//     } catch (err) {
//       console.error('❌ Lỗi khi tải gói tập:', err)
//     }
//   }

//   useEffect(() => {
//     if (selectedPackage?._id) {
//       setEvents([])
//       loadSessions(selectedPackage._id)
//     }
//   }, [selectedPackage])

//   useEffect(() => {
//     if (selectedPackage?._id) {
//       const interval = setInterval(() => {
//         loadSessions(selectedPackage._id)
//       }, 2000)
//       return () => clearInterval(interval)
//     }
//   }, [selectedPackage])

//   const loadSessions = async (packageId) => {
//     try {
//       const data = await fetchTrainingSessions({
//         userId: user._id,
//         role,
//         packageId
//       })
//       if (!data?.sessions?.length) {
//         setEvents([])
//         return
//       }
//       const formatted = data.sessions.map((s) => {
//         const start = new Date(s.startTime)
//         const end = new Date(s.endTime)
//         const statusType = s.status || 'scheduled'
//         return {
//           id: s._id,
//           title: s.title || 'Buổi tập',
//           start,
//           end,
//           statusType
//         }
//       })
//       setEvents(formatted)
//     } catch (err) {
//       console.error('❌ Lỗi khi tải lịch tập:', err)
//     }
//   }

//   const groupPackagesByPT = (packages) => {
//     const grouped = {}
//     packages.forEach((pkg) => {
//       let ptName = 'PT chưa rõ'
//       if (pkg.pt?.name && pkg.pt.name.trim() !== '') ptName = pkg.pt.name
//       else if (pkg.pt?.email) ptName = pkg.pt.email.split('@')[0]
//       if (!grouped[ptName]) grouped[ptName] = []
//       grouped[ptName].push(pkg)
//     })
//     return grouped
//   }

//   const eventStyleGetter = (event) => {
//     let bg = '#3b82f6'
//     if (event.statusType === 'completed') bg = '#22c55e'
//     if (event.statusType === 'missed') bg = '#dc2626'
//     return {
//       style: {
//         backgroundColor: bg,
//         color: 'white',
//         borderRadius: '8px',
//         fontSize: '13px',
//         padding: '4px 6px',
//         fontWeight: 500,
//         opacity: 0.95,
//         transition: 'background-color 0.3s ease'
//       }
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       {/* ===== SIDEBAR ===== */}
//       <div className="w-80 bg-white border-r border-gray-200 p-5 shadow-sm overflow-y-auto">
//         {/* 🔙 Nút quay lại */}
//         <button
//           onClick={() => navigate('/')}
//           className="flex items-center gap-2 mb-5 px-3 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 border border-gray-200 hover:border-blue-300"
//         >
//           <ArrowLeft size={18} />
//           <span className="font-medium">Quay lại trang chủ</span>
//         </button>

//         <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
//           Danh sách PT & gói tập
//         </h2>

//         {packages.length === 0 ? (
//           <p className="text-sm text-gray-500">Chưa có gói tập nào.</p>
//         ) : (
//           Object.entries(groupPackagesByPT(packages)).map(
//             ([ptName, ptPackages]) => (
//               <div key={ptName} className="mb-4">
//                 <button
//                   onClick={() =>
//                     setExpandedPT((prev) => (prev === ptName ? null : ptName))
//                   }
//                   className={`w-full flex items-center justify-between px-3 py-2 font-medium rounded-lg transition ${
//                     expandedPT === ptName
//                       ? 'bg-blue-100 text-blue-700 border border-blue-400'
//                       : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
//                   }`}
//                 >
//                   <div className="flex items-center gap-2">
//                     <img
//                       src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
//                         ptName
//                       )}&background=random`}
//                       alt={ptName}
//                       className="w-6 h-6 rounded-full"
//                     />
//                     <span>{ptName}</span>
//                   </div>
//                   {expandedPT === ptName ? (
//                     <ChevronDown size={18} />
//                   ) : (
//                     <ChevronRight size={18} />
//                   )}
//                 </button>

//                 {expandedPT === ptName && (
//                   <ul className="mt-2 ml-4 space-y-1">
//                     {ptPackages.map((pkg) => {
//                       const slotTime = pkg.booking?.slotKey || 'Không rõ giờ'
//                       return (
//                         <li
//                           key={pkg._id}
//                           onClick={() => setSelectedPackage(pkg)}
//                           className={`cursor-pointer px-3 py-2 text-sm rounded-md border transition group ${
//                             selectedPackage?._id === pkg._id
//                               ? 'bg-blue-50 border-blue-300 text-blue-700'
//                               : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-800'
//                           }`}
//                         >
//                           <div className="flex items-start gap-2">
//                             <span className="mt-[2px]">📦</span>
//                             <div className="flex flex-col leading-tight">
//                               <span className="font-medium">
//                                 {pkg.package?.name || 'Gói tập không tên'}
//                               </span>
//                               <span className="text-xs text-gray-500 mt-0.5 group-hover:text-gray-600">
//                                 {slotTime.replace('-', ' – ')}
//                               </span>
//                             </div>
//                           </div>
//                         </li>
//                       )
//                     })}
//                   </ul>
//                 )}
//               </div>
//             )
//           )
//         )}
//       </div>

//       {/* ===== MAIN CALENDAR ===== */}
//       <div className="flex-1 p-8">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex items-center justify-between mb-6">
//             <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
//               📅 Lịch tập luyện
//             </h1>
//           </div>

//           <div className="text-sm text-gray-600 flex items-center gap-4 mb-4">
//             <span className="flex items-center gap-1">
//               <span className="w-3 h-3 rounded bg-blue-500"></span> Sắp tới
//             </span>
//             <span className="flex items-center gap-1">
//               <span className="w-3 h-3 rounded bg-green-500"></span> Hoàn thành
//             </span>
//             <span className="flex items-center gap-1">
//               <span className="w-3 h-3 rounded bg-red-600"></span> Vắng
//             </span>
//           </div>

//           <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
//             <Calendar
//               localizer={localizer}
//               events={events}
//               startAccessor="start"
//               endAccessor="end"
//               date={currentDate}
//               onNavigate={setCurrentDate}
//               view={view}
//               onView={setView}
//               views={['month', 'week', 'day']}
//               eventPropGetter={eventStyleGetter}
//               min={new Date(0, 0, 0, 4, 0)}
//               max={new Date(0, 0, 0, 22, 0)}
//               messages={{
//                 week: 'Tuần',
//                 day: 'Ngày',
//                 month: 'Tháng',
//                 previous: 'Trước',
//                 next: 'Sau',
//                 today: 'Hôm nay'
//               }}
//               style={{ height: '80vh' }}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default TrainingCalendar

import React, { useEffect, useState, useContext } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { AuthContext } from '~/contexts/AuthContext'
import { fetchTrainingSessions } from '~/services/trainingSessionService'
import { fetchStudentPackages } from '~/services/studentPackage'
import { ChevronDown, ChevronRight, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import socket from '~/api/socket'

moment.locale('vi')
const localizer = momentLocalizer(moment)

const TrainingCalendar = ({ role = 'student' }) => {
  const { user } = useContext(AuthContext)
  const [events, setEvents] = useState([])
  const [packages, setPackages] = useState([])
  const [expandedPT, setExpandedPT] = useState(null)
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState('week')
  const navigate = useNavigate()

  useEffect(() => {
    if (user?._id) loadPackages()
  }, [user])

  const loadPackages = async () => {
    try {
      const res = await fetchStudentPackages()
      setPackages(res.data || [])
    } catch (err) {
      console.error('❌ Lỗi khi tải gói tập:', err)
    }
  }

  useEffect(() => {
    if (selectedPackage?._id) {
      setEvents([])
      loadSessions(selectedPackage._id)
    }
  }, [selectedPackage])

  // 🔥 REALTIME — THÊM MỚI
  useEffect(() => {
    if (!selectedPackage?._id) return

    const handler = (data) => {
      console.log('🔥 REALTIME SESSION UPDATE:', data)
      loadSessions(selectedPackage._id)
    }

    socket.on('session_updated', handler)
    return () => socket.off('session_updated', handler)
  }, [selectedPackage])

  const loadSessions = async (packageId) => {
    try {
      const data = await fetchTrainingSessions({
        userId: user._id,
        role,
        packageId
      })

      if (!data?.sessions?.length) {
        setEvents([])
        return
      }

      const formatted = data.sessions.map((s) => ({
        id: s._id,
        title: s.title || 'Buổi tập',
        start: new Date(s.startTime),
        end: new Date(s.endTime),
        statusType: s.status || 'scheduled'
      }))

      setEvents(formatted)
    } catch (err) {
      console.error('❌ Lỗi khi tải lịch tập:', err)
    }
  }

  const groupPackagesByPT = (packages) => {
    const grouped = {}
    packages.forEach((pkg) => {
      let ptName = 'PT chưa rõ'
      if (pkg.pt?.name) ptName = pkg.pt.name
      else if (pkg.pt?.email) ptName = pkg.pt.email.split('@')[0]
      if (!grouped[ptName]) grouped[ptName] = []
      grouped[ptName].push(pkg)
    })
    return grouped
  }

  const eventStyleGetter = (event) => {
    let bg = '#3b82f6'
    if (event.statusType === 'completed') bg = '#22c55e'
    if (event.statusType === 'missed') bg = '#dc2626'
    return {
      style: {
        backgroundColor: bg,
        color: 'white',
        borderRadius: '8px',
        fontSize: '13px',
        padding: '4px 6px'
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ===== SIDEBAR ===== */}
      <div className="w-80 bg-white border-r border-gray-200 p-5 shadow-sm overflow-y-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 mb-5 px-3 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-blue-50 hover:text-blue-700"
        >
          <ArrowLeft size={18} />
          <span className="font-medium">Quay lại trang chủ</span>
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          Danh sách PT & gói tập
        </h2>

        {packages.length === 0 ? (
          <p className="text-sm text-gray-500">Chưa có gói tập nào.</p>
        ) : (
          Object.entries(groupPackagesByPT(packages)).map(
            ([ptName, ptPackages]) => (
              <div key={ptName} className="mb-4">
                <button
                  onClick={() =>
                    setExpandedPT((prev) => (prev === ptName ? null : ptName))
                  }
                  className={`w-full flex items-center justify-between px-3 py-2 font-medium rounded-lg ${
                    expandedPT === ptName
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        ptName
                      )}`}
                      className="w-6 h-6 rounded-full"
                    />
                    <span>{ptName}</span>
                  </div>
                  {expandedPT === ptName ? (
                    <ChevronDown size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  )}
                </button>

                {expandedPT === ptName && (
                  <ul className="mt-2 ml-4 space-y-1">
                    {ptPackages.map((pkg) => (
                      <li
                        key={pkg._id}
                        onClick={() => setSelectedPackage(pkg)}
                        className={`cursor-pointer px-3 py-2 text-sm rounded-md border ${
                          selectedPackage?._id === pkg._id
                            ? 'bg-blue-50 border-blue-400 text-blue-700'
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {pkg.package?.name || 'Gói tập'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {pkg.booking?.slotKey}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          )
        )}
      </div>

      {/* ===== MAIN CALENDAR ===== */}
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
            📅 Lịch tập luyện
          </h1>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              date={currentDate}
              onNavigate={setCurrentDate}
              view={view}
              onView={setView}
              views={['month', 'week', 'day']}
              eventPropGetter={eventStyleGetter}
              min={new Date(0, 0, 0, 4, 0)}
              max={new Date(0, 0, 0, 22, 0)}
              messages={{
                week: 'Tuần',
                day: 'Ngày',
                month: 'Tháng',
                previous: 'Trước',
                next: 'Sau',
                today: 'Hôm nay'
              }}
              style={{ height: '80vh' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrainingCalendar
