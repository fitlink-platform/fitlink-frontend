// src/pages/SearchPTs.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchPTs } from "~/services/searchService";
import { PackageTagLabels } from "~/domain/enum";
import Navbar from "~/components/Navbar";
import MainLayout from "~/layouts/MainLayout";

export default function SearchPTs() {
  const navigate = useNavigate();
  const [pts, setPTs] = useState([]);
  const [availableAt, setAvailableAt] = useState("");
  const [sortBy, setSortBy] = useState("best");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [total, setTotal] = useState(0);

  // Location + mode
  const [showLocationScreen, setShowLocationScreen] = useState(false);
  const [area, setArea] = useState("");
  const [selectedMode, setSelectedMode] = useState("");
  const [detecting, setDetecting] = useState(false);
  const [detectedInfo, setDetectedInfo] = useState("");
  const [coords, setCoords] = useState("");
  const [showFallback, setShowFallback] = useState(false);

  // Search by name + goals
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");

  // Provinces
  const provinces = [
    "An Giang", "Bắc Ninh", "Cà Mau", "Cần Thơ", "Cao Bằng", "Đà Nẵng", "Đắk Lắk", "Điện Biên",
    "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Nội", "Hà Tĩnh", "Hải Phòng", "Hưng Yên",
    "Khánh Hòa", "Lai Châu", "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Nghệ An", "Ninh Bình",
    "Phú Thọ", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sơn La", "Tây Ninh", "Thái Nguyên",
    "Thanh Hóa", "Huế", "Tuyên Quang", "Vĩnh Long", "Hồ Chí Minh",
  ];

  // Detect GPS location
  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported.");
      return;
    }
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const latLon = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
        setCoords(latLon);
        try {
          const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1&accept-language=en`;
          const res = await fetch(url);
          const data = await res.json();
          const addr = data?.address || {};
          const line = addr.city || addr.town || addr.state || data?.display_name || "";
          setDetectedInfo(`Detected: ${line || latLon}`);
        } catch {
          setDetectedInfo(`Detected coordinates: ${latLon}`);
        } finally {
          setDetecting(false);
        }
      },
      () => {
        alert("Failed to get location permission.");
        setDetecting(false);
      }
    );
  };

  // Load saved
  useEffect(() => {
    const savedArea = localStorage.getItem("studentArea");
    const savedMode = localStorage.getItem("studentMode") || "";
    const savedCoords = localStorage.getItem("studentCoords") || "";

    if (savedArea) {
      setArea(savedArea);
      setCoords("");
      localStorage.removeItem("studentCoords");
    } else if (savedCoords) {
      setCoords(savedCoords);
    }

    if (savedMode) setSelectedMode(savedMode);

    setShowLocationScreen(!savedArea && !savedCoords);
  }, []);

  // Save local
  useEffect(() => {
    if (area) localStorage.setItem("studentArea", area);
    if (coords) localStorage.setItem("studentCoords", coords);
    if (selectedMode) localStorage.setItem("studentMode", selectedMode);
  }, [area, coords, selectedMode]);

  // Fetch PTs
  const fetchPTs = async () => {
    if (!area && !coords) return;

    try {
      setLoading(true);
      setError("");

      const params = {
        availableAt,
        sortBy,
        specialty: goal,
        page,
        limit,
        modes: selectedMode ? [selectedMode] : [],
        name,
      };

      if (area) params.area = area;
      else if (coords) params.coords = coords;

      const res = await searchPTs(params);
      const list = res?.items || [];
      setPTs(list);
      setTotal(res?.total || 0);

      setShowFallback(list.length === 0 && !!coords);
    } catch (err) {
      console.error(err);
      setError("Failed to load trainers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!showLocationScreen && (area || coords) && selectedMode) fetchPTs();
  }, [availableAt, sortBy, name, goal, page, limit, area, coords, selectedMode, showLocationScreen]);

  const handleConfirmArea = () => {
    if (!area && !coords) {
      alert("Please select a location (city or GPS).");
      return;
    }
    setShowLocationScreen(false);
    setPage(1);
    fetchPTs();
  };

  // SETUP SCREEN
  if (showLocationScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white text-gray-800 flex flex-col">
        <MainLayout>

          <div className="px-10 mt-20 mb-2">
            <button
              onClick={() => setShowLocationScreen(false)}
              className="text-sm font-medium text-orange-600 hover:text-orange-700 transition"
            >
              ← Back to Trainers
            </button>
          </div>

          <div className="flex flex-col items-center justify-center flex-1 px-4 py-8">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-orange-100">
              <h1 className="text-2xl font-bold text-center text-orange-600 mb-2">
                Find Personal Trainers <span className="text-gray-900">near you</span>
              </h1>
              <p className="text-gray-500 text-center text-sm mb-6">
                Update your location to discover nearby PTs 🏋️‍♂️
              </p>

              {/* Select area */}
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select your province/city:
              </label>
              <select
                value={area}
                onChange={(e) => {
                  setArea(e.target.value);
                  if (e.target.value) {
                    setCoords("");
                    localStorage.removeItem("studentCoords");
                  }
                }}
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 mb-4"
              >
                <option value="">-- Choose Province/City --</option>
                {provinces.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>

              {/* Coordinates */}
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Or enter coordinates:
              </label>
              <input
                type="text"
                value={coords}
                onChange={(e) => setCoords(e.target.value)}
                placeholder="e.g., 15.9681,108.2634"
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 mb-4"
              />

              <div className="flex gap-3 mb-5">
                <button
                  onClick={detectLocation}
                  disabled={detecting}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white py-2 rounded-lg"
                >
                  {detecting ? 'Detecting...' : '📍 Use My Location'}
                </button>
                <button
                  onClick={() => {
                    if (!coords) {
                      alert('No coordinates to save yet.');
                      return;
                    }
                    localStorage.setItem('studentCoords', coords);
                    alert(`Saved: ${coords}`);
                  }}
                  className="flex-1 bg-gray-800 hover:bg-gray-900 text-white py-2 rounded-lg"
                >
                  💾 Save
                </button>
              </div>

              <button
                onClick={handleConfirmArea}
                disabled={!area && !coords}
                className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg text-lg"
              >
                🔎 Confirm & Search
              </button>

              {detectedInfo && (
                <p className="text-center text-sm text-gray-500 mt-4">{detectedInfo}</p>
              )}
            </div>
          </div>
        </MainLayout>
      </div>
    );
  }

  // MAIN PAGE
  return (
    <>
      <MainLayout>


        <div className="min-h-screen bg-gradient-to-b from-orange-50 via-orange-50/60 to-white text-gray-900 px-6 py-8 pt-24">
          <div className="max-w-7xl mx-auto">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Personal Trainers</h1>
                <p className="text-slate-600 text-sm mt-1">
                  Current area: {area || "—"} | Coordinates: {coords || "—"} | Mode: {selectedMode || "—"}
                </p>
              </div>

              <button
                onClick={() => setShowLocationScreen(true)}
                className="text-sm text-orange-600 hover:text-orange-500 underline"
              >
                ✏️ Change area & mode
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
              <input
                type="text"
                placeholder="Search by name..."
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setPage(1);
                }}
                className="bg-white border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-sm shadow-sm"
              />

              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="bg-white border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-sm min-w-[200px] shadow-sm"
              >
                <option value="">All goals</option>
                {Object.keys(PackageTagLabels).map((key) => (
                  <option key={key} value={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}
                  </option>
                ))}
              </select>

              <select
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                className="bg-white border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-sm min-w-[150px] shadow-sm"
              >
                <option value="">All modes</option>
                <option value="atPtGym">At PT's Gym</option>
                <option value="atClient">At Client's Home / Gym</option>
                <option value="atOtherGym">At Other Gym</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="bg-white border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-sm shadow-sm"
              >
                <option value="best">Best match</option>
                <option value="rating">Highest rating</option>
                <option value="price">Lowest price</option>
              </select>
            </div>

            {/* Results */}
            {loading ? (
              <div className="text-center text-slate-500 py-10 animate-pulse">Loading trainers...</div>
            ) : error ? (
              <div className="text-center text-red-500 py-10 font-medium">{error}</div>
            ) : pts.length === 0 ? (
              <div className="text-center text-slate-500 py-16">
                <p className="text-lg mb-2">No trainers found 🏋️‍♂️</p>

                {showFallback && (
                  <div className="mt-4">
                    <p className="text-sm mb-3">
                      No trainers nearby. Try searching by city instead?
                    </p>
                    <button
                      onClick={() => {
                        setCoords("");
                        fetchPTs();
                      }}
                      className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg"
                    >
                      🔄 Search by City
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 max-w-5xl w-full">
                {pts.map((pt) => {
                  const rating = pt.ratingAvg || 0;
                  const ratingRounded = Math.round(rating);
                  const ratingCount = pt.ratingCount || 0;

                  const modes = [];
                  if (pt.deliveryModes?.atPtGym) modes.push("atPtGym");
                  if (pt.deliveryModes?.atClient) modes.push("atClient");
                  if (pt.deliveryModes?.atOtherGym) modes.push("atOtherGym");

                  const priceText = pt.lowestPricePerSession
                    ? `${Number(pt.lowestPricePerSession).toLocaleString("vi-VN")}₫ / buổi`
                    : "Giá: liên hệ";

                  return (
                    <article
                      key={pt._id}
                      className="group mx-auto w-full max-w-sm bg-white rounded-3xl border border-orange-100 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                    >
                      {/* ----- COVER IMAGE ----- */}
                      <div className="relative">
                        <img
                          src={
                            pt.coverImage ||
                            pt.userInfo?.avatar ||
                            "https://placehold.co/600x360"
                          }
                          alt={pt.userInfo?.name}
                          className="w-full h-44 object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* ----- BADGES ----- */}
                        {pt.availableForNewClients && (
                          <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 shadow-sm">
                            Nhận học viên mới
                          </span>
                        )}

                        {pt.verified && (
                          <span className="absolute top-3 right-3 rounded-full bg-orange-500 text-white px-2.5 py-1 text-[11px] font-semibold shadow">
                            Verified
                          </span>
                        )}

                        {/* ----- AVATAR CIRCULAR ----- */}
                        <div className="absolute -bottom-7 left-4 h-20 w-20 rounded-full border-2 border-white overflow-hidden shadow-md bg-slate-200">
                          <img
                            src={
                              pt.userInfo?.avatar ||
                              pt.coverImage ||
                              "https://placehold.co/120x120"
                            }
                            alt="avatar"
                            className="h-full w-full object-cover object-top"
                          />
                        </div>
                      </div>

                      {/* ----- CONTENT ----- */}
                      <div className="pt-10 pb-4 px-4 flex flex-col justify-between min-h-[190px]">
                        <div>
                          {/* Name + exp */}
                          <h3 className="text-base font-semibold text-slate-900 truncate">
                            {pt.userInfo?.name || "Unnamed Trainer"}
                          </h3>

                          <p className="text-xs text-slate-500 mt-0.5">
                            {pt.yearsExperience
                              ? `${pt.yearsExperience}+ năm kinh nghiệm`
                              : "PT cá nhân"}
                          </p>

                          {/* Rating */}
                          <div className="mt-2 flex items-center gap-2 text-xs">
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span
                                  key={i}
                                  className={
                                    i < ratingRounded
                                      ? "text-amber-400"
                                      : "text-slate-300"
                                  }
                                >
                                  ★
                                </span>
                              ))}
                            </div>

                            {ratingCount > 0 ? (
                              <span className="text-slate-500">
                                {rating.toFixed(1)} · {ratingCount} đánh giá
                              </span>
                            ) : (
                              <span className="text-slate-400 italic">
                                Chưa có đánh giá
                              </span>
                            )}
                          </div>

                          {/* Gym + Price */}
                          <p className="mt-2 text-xs text-slate-600">
                            📍 {pt.primaryGym?.name || "Khu vực linh hoạt"}
                          </p>

                          <p className="mt-1 text-sm font-semibold text-orange-600">
                            {priceText}
                          </p>

                          {/* Tags */}
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {pt.specialties?.slice(0, 2).map((s) => (
                              <span
                                key={s}
                                className="inline-flex items-center rounded-full bg-orange-50 text-[11px] text-orange-700 px-2 py-0.5"
                              >
                                {s}
                              </span>
                            ))}

                            {modes.slice(0, 2).map((m) => (
                              <span
                                key={m}
                                className="inline-flex items-center rounded-full bg-slate-50 text-[11px] text-slate-600 px-2 py-0.5"
                              >
                                {m}
                              </span>
                            ))}
                          </div>
                        </div>
                        {/* Button */}
                        <button
                          onClick={() => navigate(`/pt/${pt.userInfo?._id}`)}
                          className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full py-2 text-sm transition"
                        >
                          View details
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </MainLayout>
    </>
  );
}
