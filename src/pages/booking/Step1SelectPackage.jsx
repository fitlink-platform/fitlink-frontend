// src/pages/booking/Step1SelectPackage.jsx
import { useSearchParams } from "react-router-dom";
import { useBooking } from "~/contexts/BookingContext";

export default function Step1SelectPackage({ packages = [], onNext }) {
  const [sp, setSp] = useSearchParams();
  const { set, state } = useBooking();

  const pick = (p) => {
    sp.set("packageId", p._id);
    setSp(sp, { replace: true });

    // Giữ nguyên thuật toán/shape dữ liệu
    set({
      packageId: p._id,
      package: {
        _id: p._id,
        name: p.name,
        totalSessions: p.totalSessions || 9,
        sessionDurationMin: p.sessionDurationMin || 60,
        recurrence: p.recurrence,
        supports: p.supports,
      },
      packageSnapshot: {
        name: p?.name,
        price: p?.price || 0,
        currency: "VND",
        totalSessions: p?.totalSessions || null,
        sessionDurationMin: p?.sessionDurationMin || null,
      },
    });
  };

  const formatVND = (n) => (n || 0).toLocaleString("vi-VN");

  // 👉 Chỉ phục vụ HIỂN THỊ, không đổi dữ liệu gốc
  const formatRecurrenceLabel = (rec) => {
    if (!rec) return null;
    if (typeof rec === "string") return rec;
    // Một số trường hợp service trả về mảng trực tiếp
    if (Array.isArray(rec)) return rec.join(" • ");

    // Trường hợp phổ biến: { daysOfWeek: [1,3,5] } hoặc [0..6]
    const dows = Array.isArray(rec?.daysOfWeek) ? rec.daysOfWeek : null;
    if (!dows) return null;

    const max = Math.max(...dows);
    // Nếu có số 0 hoặc max <= 6 => giả định 0..6 (0: CN)
    const zeroBased = dows.includes(0) || max <= 6;

    const names = zeroBased
      ? ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]
      : ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]; // 1..7

    const mapped = dows
      .map((n) => {
        if (zeroBased) return names[n] ?? n;
        // 1..7
        if (n >= 1 && n <= 7) return names[n - 1];
        return n;
      })
      .filter(Boolean);

    return mapped.length ? mapped.join(" • ") : null;
  };

  const hasData = Array.isArray(packages) && packages.length > 0;

  return (
    <section className="space-y-5">
      <header>
        <p className="text-neutral-300">Chọn một gói để bắt đầu.</p>
      </header>

      {hasData ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {packages.map((p) => {
            const active = state.packageId === p._id;
            const perSession =
              p?.price && p?.totalSessions
                ? Math.round(p.price / p.totalSessions)
                : null;
            const recurrenceLabel = formatRecurrenceLabel(p?.recurrence);

            return (
              <button
                key={p._id}
                onClick={() => pick(p)}
                className={[
                  "group text-left rounded-2xl border p-4 transition-all duration-200 focus:outline-none",
                  active
                    ? "border-red-500 bg-red-600/10 ring-1 ring-red-500/20 shadow-[0_8px_24px_rgba(220,38,38,0.18)]"
                    : "border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 hover:border-neutral-700",
                ].join(" ")}
              >
                {/* Title + Price */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-neutral-100 group-hover:text-white">
                      {p.name}
                    </h3>
                    <p className="mt-1 text-sm text-neutral-400 line-clamp-2">
                      {p.description || "—"}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-red-300">
                      {formatVND(p.price)} <span className="text-xs">VND</span>
                    </div>
                    {perSession && (
                      <div className="text-[11px] text-neutral-400">
                        ≈ {formatVND(perSession)} / buổi
                      </div>
                    )}
                  </div>
                </div>

                {/* Meta badges */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-lg border border-neutral-700 bg-neutral-800/70 px-2.5 py-1 text-xs text-neutral-200">
                    {p.totalSessions || 9} buổi
                  </span>
                  <span className="inline-flex items-center rounded-lg border border-neutral-700 bg-neutral-800/70 px-2.5 py-1 text-xs text-neutral-200">
                    {p.sessionDurationMin || 60} phút/buổi
                  </span>
                  {recurrenceLabel && (
                    <span className="inline-flex items-center rounded-lg border border-neutral-700 bg-neutral-800/70 px-2.5 py-1 text-xs text-neutral-300">
                      {recurrenceLabel}
                    </span>
                  )}
                </div>

                {active && (
                  <div className="mt-3 h-0.5 w-full rounded bg-gradient-to-r from-rose-500 via-red-600 to-rose-500" />
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-5 text-neutral-400">
          Chưa có gói nào được cấu hình cho PT này.
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={!state.packageId}
          className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:hover:bg-red-600 transition shadow-[0_6px_18px_rgba(220,38,38,0.25)]"
        >
          Tiếp tục
        </button>
      </div>
    </section>
  );
}
