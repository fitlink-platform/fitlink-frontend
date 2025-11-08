import React, { useEffect, useState, useContext } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { fetchTrainingSessions } from '~/services/trainingSessionService'
import { AuthContext } from '~/contexts/AuthContext'

moment.locale('vi')
const localizer = momentLocalizer(moment)

const TrainingCalendar = ({ role = 'student' }) => {
  const { user } = useContext(AuthContext)
  const [events, setEvents] = useState([])

  useEffect(() => {
    if (user?._id) loadSessions()
  }, [user])

  const loadSessions = async () => {
    try {
      const data = await fetchTrainingSessions({
        userId: user._id,
        role
      })

      if (!data?.sessions?.length) {
        console.warn('⚠️ Không có dữ liệu lịch tập!')
        setEvents([])
        return
      }

      const now = new Date()

      const formatted = data.sessions.map((s) => {
        const start = new Date(s.startTime)
        const end = new Date(s.endTime)

        let statusType = 'future'
        if (end < now) statusType = 'past'
        else if (start <= now && end >= now) statusType = 'current'

        return {
          id: s._id,
          title: s.title || 'Buổi tập',
          start,
          end,
          statusType
        }
      })

      console.log('📅 Render lên calendar:', formatted)
      setEvents(formatted)
    } catch (err) {
      console.error('❌ Lỗi khi tải lịch tập:', err)
    }
  }

  const eventStyleGetter = (event) => {
    let bg = '#3b82f6'
    if (event.statusType === 'past') bg = '#22c55e'
    if (event.statusType === 'current') bg = '#eab308'

    return {
      style: {
        backgroundColor: bg,
        color: 'white',
        borderRadius: '8px',
        fontSize: '13px',
        padding: '4px 6px',
        fontWeight: 500,
        opacity: 0.95
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            📅 Lịch tập luyện
          </h1>
          <div className="text-sm text-gray-600 flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-blue-500"></span> Sắp tới
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-yellow-400"></span> Đang diễn
              ra
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-green-500"></span> Đã qua
            </span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            defaultView="week"
            views={['month', 'week', 'day']}
            eventPropGetter={eventStyleGetter}
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
  )
}

export default TrainingCalendar
