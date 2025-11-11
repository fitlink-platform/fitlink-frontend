// src/pages/pt/PTWallet.jsx
import { useEffect, useState } from 'react'
import PTMainLayout from '~/layouts/pt/PTMainLayout'
import { toast } from 'react-toastify'
import { getMyWallet, listMyPayoutRequests, createPayoutRequest } from '~/services/ptWalletService'

/** Helpers an toàn khi render */
const formatVND = (n) => Number(n ?? 0).toLocaleString('vi-VN')
const safeDateTime = (d) => (d ? new Date(d).toLocaleString('vi-VN') : '—')

function WithdrawModal({ open, onClose, onCreated }) {
  const [accountName, setAccountName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [bankName, setBankName] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setAccountName('')
      setAccountNumber('')
      setBankName('')
      setAmount('')
    }
  }, [open])

  if (!open) return null

  const handleSubmit = async () => {
    if (!accountName || !accountNumber || !bankName || !amount) {
      toast.error('Vui lòng nhập đầy đủ thông tin')
      return
    }
    if (Number(amount) <= 0) {
      toast.error('Số tiền không hợp lệ')
      return
    }

    try {
      setLoading(true)
      await createPayoutRequest({
        accountName,
        accountNumber,
        bankName,
        amount: Number(amount)
      })
      toast.success('Đã gửi yêu cầu rút tiền')
      onCreated?.()
      onClose()
    } catch (e) {
      toast.error(e?.response?.data?.error || 'Lỗi gửi yêu cầu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl bg-gray-900 border border-white/10 p-4">
        <h3 className="text-white font-semibold text-lg mb-3">Gửi yêu cầu rút tiền</h3>

        <div className="grid gap-3">
          <div>
            <label className="text-sm text-gray-300">Ngân hàng</label>
            <input
              className="mt-1 w-full rounded-md bg-white/5 border border-white/10 p-2 text-sm text-white"
              value={bankName}
              onChange={e => setBankName(e.target.value)}
              placeholder="VD: Vietcombank"
            />
          </div>
          <div>
            <label className="text-sm text-gray-300">Số tài khoản</label>
            <input
              className="mt-1 w-full rounded-md bg-white/5 border border-white/10 p-2 text-sm text-white"
              value={accountNumber}
              onChange={e => setAccountNumber(e.target.value)}
              placeholder="0123456789"
            />
          </div>
          <div>
            <label className="text-sm text-gray-300">Tên chủ tài khoản</label>
            <input
              className="mt-1 w-full rounded-md bg-white/5 border border-white/10 p-2 text-sm text-white"
              value={accountName}
              onChange={e => setAccountName(e.target.value)}
              placeholder="Nguyen Van A"
            />
          </div>
          <div>
            <label className="text-sm text-gray-300">Số tiền muốn rút (VND)</label>
            <input
              type="number"
              className="mt-1 w-full rounded-md bg-white/5 border border-white/10 p-2 text-sm text-white"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            className="px-3 py-1.5 text-sm rounded-lg border border-white/10 text-gray-200 hover:bg-white/10"
            onClick={onClose}
          >
            Huỷ
          </button>
          <button
            className="px-3 py-1.5 text-sm rounded-lg bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-60"
            disabled={loading}
            onClick={handleSubmit}
          >
            Gửi yêu cầu
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PTWallet() {
  // Khởi tạo an toàn để tránh undefined.toLocaleString
  const [wallet, setWallet] = useState({ available: 0, withdrawn: 0 })
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  const loadWallet = async () => {
    try {
      // service đã trả res.data -> đây là object ví
      const data = await getMyWallet()
      setWallet({
        available: Number(data?.available ?? 0),
        withdrawn: Number(data?.withdrawn ?? 0)
      })
    } catch (e) {
      toast.error('Không tải được ví')
    }
  }

  const loadRequests = async () => {
    setLoading(true)
    try {
      // service đã trả res.data (có thể là {items:[]} hoặc array)
      const data = await listMyPayoutRequests({ status: status || undefined })
      const list = Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : [])
      setRequests(list)
    } catch (e) {
      toast.error('Không tải được danh sách yêu cầu')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadWallet()
    loadRequests()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  return (
    <PTMainLayout>
      <div className="p-4 text-white">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">💰 Ví của tôi</h1>
          <div className="flex items-center gap-2">
            <button
              className="rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-200 hover:bg-white/10"
              onClick={() => { loadWallet(); loadRequests(); }}
            >
              Làm mới
            </button>
            <button
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm text-white hover:bg-orange-600"
              onClick={() => setModalOpen(true)}
            >
              Gửi yêu cầu rút tiền
            </button>
          </div>
        </div>

        {/* Số dư */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm text-gray-400">Số dư khả dụng</div>
            <div className="text-2xl font-semibold text-green-400">
              {formatVND(wallet?.available)} ₫
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm text-gray-400">Tổng đã rút</div>
            <div className="text-2xl font-semibold text-orange-400">
              {formatVND(wallet?.withdrawn)} ₫
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Lịch sử yêu cầu rút tiền</h2>
          <select
            className="rounded-md bg-white/5 border border-white/10 px-3 py-2 text-sm text-white"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="pending">Đang chờ</option>
            <option value="completed">Hoàn tất</option>
            <option value="rejected">Từ chối</option>
          </select>
        </div>

        {/* Danh sách yêu cầu */}
        <div className="rounded-2xl border border-white/10 bg-white/5">
          {loading ? (
            <div className="p-6 text-sm text-gray-300">Loading…</div>
          ) : requests.length === 0 ? (
            <div className="p-6 text-sm text-gray-300">Chưa có yêu cầu nào</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-gray-400">
                  <tr>
                    <th className="px-3 py-2 font-medium">Ngân hàng</th>
                    <th className="px-3 py-2 font-medium">Số TK</th>
                    <th className="px-3 py-2 font-medium">Chủ TK</th>
                    <th className="px-3 py-2 font-medium">Số tiền</th>
                    <th className="px-3 py-2 font-medium">Trạng thái</th>
                    <th className="px-3 py-2 font-medium">Ngày</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map(r => (
                    <tr key={r?._id || `${r?.accountNumber}-${r?.createdAt}`}>
                      <td className="px-3 py-2 text-gray-300">{r?.bankName || '—'}</td>
                      <td className="px-3 py-2 text-gray-300">{r?.accountNumber || '—'}</td>
                      <td className="px-3 py-2 text-gray-300">{r?.accountName || '—'}</td>
                      <td className="px-3 py-2 text-gray-300">{formatVND(r?.amount)} ₫</td>
                      <td className="px-3 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            r?.status === 'completed'
                              ? 'bg-green-500/20 text-green-400'
                              : r?.status === 'rejected'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}
                        >
                          {r?.status || '—'}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-gray-400 text-xs">
                        {safeDateTime(r?.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <WithdrawModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onCreated={() => { loadWallet(); loadRequests(); }}
        />
      </div>
    </PTMainLayout>
  )
}
