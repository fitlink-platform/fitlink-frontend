import { useState } from 'react'
import { initStudentPackageCheckout, payTransaction } from '~/services/paymentService'

export default function PackageDetailModal({ pkg, onClose }) {
  const [loading, setLoading] = useState(false)
  const [agree, setAgree] = useState(true) // nếu muốn bật checkbox điều khoản, để true mặc định cho nhanh

  const handleBuy = async () => {
    if (!agree) return
    try {
      setLoading(true)
      // 1) init transaction
      const init = await initStudentPackageCheckout(pkg._id)
      if (!init?.success) {
        alert(init?.message || 'Không khởi tạo giao dịch được')
        return
      }
      // 2) tạo link PayOS
      const trxId = init.data.transactionId
      const pay = await payTransaction(trxId)
      if (pay?.success && pay?.data?.checkoutUrl) {
        // 3) redirect sang PayOS (flow “đơn giản như Pet Spa”)
        window.location.href = pay.data.checkoutUrl
      } else {
        alert(pay?.message || 'Không tạo được link thanh toán')
      }
    } catch (e) {
      console.error(e)
      alert('Có lỗi khi tạo giao dịch')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-2">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{pkg?.name}</h3>
            <p className="text-gray-500 text-sm mt-1">PT: {pkg?.pt?.name || '—'}</p>
          </div>
          <button
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">{pkg?.description || '—'}</p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-lg bg-gray-50 p-3">
              <div className="text-gray-500">Giá</div>
              <div className="text-gray-900 font-semibold">{(pkg?.price || 0).toLocaleString()} VND</div>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <div className="text-gray-500">Thời hạn</div>
              <div className="text-gray-900 font-semibold">{pkg?.durationDays} ngày</div>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <div className="text-gray-500">Số buổi</div>
              <div className="text-gray-900 font-semibold">{pkg?.totalSessions}</div>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <div className="text-gray-500">Hiển thị</div>
              <div className="text-gray-900 font-semibold">{pkg?.visibility || 'public'}</div>
            </div>
          </div>

          {Array.isArray(pkg?.tags) && pkg.tags.length > 0 && (
            <div>
              <div className="text-sm text-gray-500 mb-1">Tags</div>
              <div className="flex flex-wrap gap-2">
                {pkg.tags.map((t, i) => (
                  <span key={i} className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-lg border border-gray-200 p-3 text-sm text-gray-600">
            <div className="font-semibold text-gray-800 mb-1">Điều khoản</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Thanh toán qua PayOS an toàn, bảo mật.</li>
              <li>Không hoàn tiền sau khi kích hoạt gói, trừ trường hợp đặc biệt theo chính sách.</li>
              <li>Gói sẽ kích hoạt khi thanh toán thành công và có hiệu lực trong {pkg?.durationDays} ngày.</li>
            </ul>
            <label className="mt-3 inline-flex items-center gap-2 text-gray-700">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
              Tôi đồng ý với điều khoản
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={handleBuy}
            disabled={loading || !agree}
            className="rounded-lg bg-orange-500 px-4 py-2 font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
          >
            {loading ? 'Đang mở QR…' : 'Mua gói'}
          </button>
        </div>
      </div>
    </div>
  )
}
