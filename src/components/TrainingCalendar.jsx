// import React, { useEffect, useState, useContext } from 'react'
// import { Calendar, momentLocalizer } from 'react-big-calendar'
// import moment from 'moment'
// import 'react-big-calendar/lib/css/react-big-calendar.css'
// import { AuthContext } from '~/contexts/AuthContext'
// import { fetchTrainingSessions } from '~/services/trainingSessionService'
// import { fetchStudentPackages } from '~/services/studentPackage'
// import { ChevronDown, ChevronRight, ArrowLeft } from 'lucide-react'
// import { useNavigate } from 'react-router-dom'
// import socket from '~/api/socket'

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
//       const res = await fetchStudentPackages()
//       setPackages(res.data || [])
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

//   //REALTIME — THÊM MỚI
//   useEffect(() => {
//     if (!selectedPackage?._id) return

//     const handler = (data) => {
//       console.log('🔥 REALTIME SESSION UPDATE:', data)
//       loadSessions(selectedPackage._id)
//     }

//     socket.on('session_updated', handler)
//     return () => socket.off('session_updated', handler)
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

//       const formatted = data.sessions.map((s) => ({
//         id: s._id,
//         title: s.title || 'Buổi tập',
//         start: new Date(s.startTime),
//         end: new Date(s.endTime),
//         statusType: s.status || 'scheduled'
//       }))

//       setEvents(formatted)
//     } catch (err) {
//       console.error('❌ Lỗi khi tải lịch tập:', err)
//     }
//   }

//   const groupPackagesByPT = (packages) => {
//     const grouped = {}
//     packages.forEach((pkg) => {
//       let ptName = 'PT chưa rõ'
//       if (pkg.pt?.name) ptName = pkg.pt.name
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
//         padding: '4px 6px'
//       }
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       {/* ===== SIDEBAR ===== */}
//       <div className="w-80 bg-white border-r border-gray-200 p-5 shadow-sm overflow-y-auto">
//         <button
//           onClick={() => navigate('/')}
//           className="flex items-center gap-2 mb-5 px-3 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-blue-50 hover:text-blue-700"
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
//                   className={`w-full flex items-center justify-between px-3 py-2 font-medium rounded-lg ${
//                     expandedPT === ptName
//                       ? 'bg-blue-100 text-blue-700'
//                       : 'bg-gray-100'
//                   }`}
//                 >
//                   <div className="flex items-center gap-2">
//                     <img
//                       src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
//                         ptName
//                       )}`}
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
//                     {ptPackages.map((pkg) => (
//                       <li
//                         key={pkg._id}
//                         onClick={() => setSelectedPackage(pkg)}
//                         className={`cursor-pointer px-3 py-2 text-sm rounded-md border ${
//                           selectedPackage?._id === pkg._id
//                             ? 'bg-blue-50 border-blue-400 text-blue-700'
//                             : 'bg-white border-gray-200'
//                         }`}
//                       >
//                         <div className="flex flex-col">
//                           <span className="font-medium">
//                             {pkg.package?.name || 'Gói tập'}
//                           </span>
//                           <span className="text-xs text-gray-500">
//                             {pkg.booking?.slotKey}
//                           </span>
//                         </div>
//                       </li>
//                     ))}
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
//           <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
//             📅 Lịch tập luyện
//           </h1>

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
import axios from '~/api/axiosClient'

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

  const [showBMIModal, setShowBMIModal] = useState(false)
  const [selectedSession, setSelectedSession] = useState(null)
  const [existingBMI, setExistingBMI] = useState(null)

  // thêm state input
  const [height, setHeight] = useState("")
  const [weight, setWeight] = useState("")
  const [note, setNote] = useState("")

  useEffect(() => {
    if (user?._id) loadPackages()
  }, [user])

  const loadPackages = async () => {
    try {
      const res = await fetchStudentPackages()
      setPackages(res.data || [])
    } catch (err) {}
  }

  useEffect(() => {
    if (selectedPackage?._id) {
      setEvents([])
      loadSessions(selectedPackage._id)
    }
  }, [selectedPackage])

  useEffect(() => {
    if (!selectedPackage?._id) return

    const handler = () => {
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
    } catch (err) {}
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

  const handleSaveBMI = async () => {
    if (!height || !weight) {
      alert("Vui lòng nhập đầy đủ dữ liệu!")
      return
    }

    try {
      await axios.post("/student/bmi/session", {
        heightCm: parseFloat(height),
        weightKg: parseFloat(weight),
        sessionId: selectedSession?.id,
        note
      })

      alert("Đã lưu BMI thành công")

      setShowBMIModal(false)
      setExistingBMI(null)
    } catch (err) {
      alert("Lỗi khi lưu BMI")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">

      <div className="w-80 bg-white border-r border-gray-200 p-5 shadow-sm overflow-y-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 mb-5 px-3 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-blue-50 hover:text-blue-700"
        >
          <ArrowLeft size={18} />
          <span className="font-medium">Quay lại trang chủ</span>
        </button>

        <h2 className="text-xl font-semibold mb-4">Danh sách PT & gói tập</h2>

        {packages.length === 0 ? (
          <p className="text-sm text-gray-500">Chưa có gói tập nào.</p>
        ) : (
          Object.entries(groupPackagesByPT(packages)).map(([ptName, ptPackages]) => (
            <div key={ptName} className="mb-4">

              <button
                onClick={() =>
                  setExpandedPT((prev) => (prev === ptName ? null : ptName))
                }
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg ${
                  expandedPT === ptName
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(ptName)}`}
                    className="w-6 h-6 rounded-full"
                  />
                  <span>{ptName}</span>
                </div>
                {expandedPT === ptName ? <ChevronDown size={18}/> : <ChevronRight size={18}/>}
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
                        <span className="font-medium">{pkg.package?.name}</span>
                        <span className="text-xs text-gray-500">
                          {pkg.booking?.slotKey}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))
        )}
      </div>

      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">

          <h1 className="text-3xl font-bold mb-6">📅 Lịch tập luyện</h1>

          <div className="bg-white border rounded-2xl shadow-sm p-6">

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

              onSelectEvent={async (event) => {
                setSelectedSession(event)
                setShowBMIModal(true)

                setExistingBMI(null)
                setHeight("")
                setWeight("")
                setNote("")

                try {
                  const res = await axios.get(`/student/bmi/session/${event.id}`)
                  if (res.data.exists) {
                    setExistingBMI(res.data.data)
                    setHeight(res.data.data.heightCm)
                    setWeight(res.data.data.weightKg)
                    setNote(res.data.data.note)
                  }
                } catch {}
              }}
            />
          </div>
        </div>
      </div>

      {showBMIModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">

            <h2 className="text-xl font-bold mb-4">Cập nhật BMI buổi tập</h2>

            <p className="text-sm mb-3">
              Buổi tập: <b>{selectedSession?.title}</b>
            </p>

            <input
              id="bmiHeight"
              type="number"
              placeholder="Chiều cao (cm)"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              disabled={!!existingBMI}
              className="w-full border p-2 rounded mb-3"
            />

            <input
              id="bmiWeight"
              type="number"
              placeholder="Cân nặng (kg)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              disabled={!!existingBMI}
              className="w-full border p-2 rounded mb-3"
            />

            <textarea
              id="bmiNote"
              placeholder="Ghi chú"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={!!existingBMI}
              className="w-full border p-2 rounded mb-3"
            />

            <div className="flex gap-3 mt-4">
              <button
                className="flex-1 bg-gray-300 py-2 rounded"
                onClick={() => setShowBMIModal(false)}
              >
                Hủy
              </button>

              {!existingBMI && (
                <button
                  className="flex-1 bg-blue-600 text-white py-2 rounded"
                  onClick={handleSaveBMI}
                >
                  Lưu
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default TrainingCalendar
