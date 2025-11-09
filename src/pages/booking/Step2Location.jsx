// src/pages/booking/Step2Location.jsx
import { useBooking } from "~/contexts/BookingContext";
import MapD from "~/components/MapD";
import { use, useEffect } from "react";

const Chip = ({ active, disabled, onClick, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-3 py-2 rounded-xl border text-sm mr-2 mb-2
      ${active ? "bg-red-600/20 border-red-500 text-red-200" : "bg-neutral-900/60 border-neutral-700 text-neutral-300"}
      ${disabled ? "opacity-50" : "hover:bg-neutral-800"}`}
  >
    {children}
  </button>
);

export default function Step2Location({ pt, onBack, onNext }) {
  const { state, set } = useBooking();
  const supports = state.package?.supports || pt?.deliveryModes || {};
  const ptLocation = pt?.primaryGym?.location?.coordinates || { lat: 21.0278, lng: 105.8342 };

  console.log("ptLocation: ", ptLocation);

  useEffect(() => {
    // nếu location PT thay đổi, reset mode
    set({
      clientAddress: null,     // { address, location:{ lat, lng }, name? }
      otherGymAddress: null,   // { address, location:{ lat, lng }, name? }
      ptGymAddress: pt.primaryGym,
    });
  }, []);

  const canNext = !!state.mode;

  return (
    console.log("Step2Location: ", pt),

    <div className="space-y-4">
      <div className="text-slate-300">Chọn địa điểm dạy.</div>
      <div className="flex gap-2 flex-wrap">
        <Chip active={state.mode === 'atPtGym'} disabled={!supports?.atPtGym} onClick={() => set({ mode: 'atPtGym' })}>Tại gym PT</Chip>
        <Chip active={state.mode === 'atClient'} disabled={!supports?.atClient} onClick={() => set({ mode: 'atClient' })}>Tại nhà tôi</Chip>
        <Chip active={state.mode === 'atOtherGym'} disabled={!supports?.atOtherGym} onClick={() => set({ mode: 'atOtherGym' })}>Tại gym khác</Chip>
      </div>

      {/* TODO: nếu atClient/atOtherGym → hiển thị Map, nhập tọa độ, tính distance/fee, set({ distanceKm, travelFee, inRange }) */}
      <MapD center={{ lat: 15.978688557140982, lng: 108.25093838439885 }} ptLocation={{ lat: ptLocation[1], lng: ptLocation[0] }} />

      <div className="flex justify-between">
        <button className="px-4 py-2 rounded-xl border border-neutral-700 text-neutral-200 hover:bg-neutral-800" onClick={onBack}>
          Quay lại
        </button>
        <button className="px-4 py-2 rounded-xl bg-red-600 text-white disabled:opacity-50 hover:bg-red-700 transition" onClick={onNext} disabled={!canNext}>
          Tiếp tục
        </button>
      </div>
    </div>
  );
}
