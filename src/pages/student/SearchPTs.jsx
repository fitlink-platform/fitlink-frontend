// src/pages/SearchPTs.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchPTs } from "~/services/searchService";
import { PackageTagLabels } from "~/domain/enum";
import MainLayout from "~/layouts/MainLayout";

export default function SearchPTs() {
  const navigate = useNavigate();
  const [pts, setPTs] = useState([]);
  const [availableAt, setAvailableAt] = useState("");
  const [sortBy, setSortBy] = useState("best");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
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
          const line =
            addr.city || addr.town || addr.state || data?.display_name || "";
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
    if (!showLocationScreen && (area || coords) && selectedMode) {
      fetchPTs();
    }
  }, [
    availableAt,
    sortBy,
    name,
    goal,
    page,
    limit,
    area,
    coords,
    selectedMode,
    showLocationScreen,
  ]);

  const handleConfirmArea = () => {
    if (!area && !coords) {
      alert("Please select a location (city or GPS).");
      return;
    }
    setShowLocationScreen(false);
    setPage(1);
    fetchPTs();
  };

  // =============== SETUP SCREEN ===============
  if (showLocationScreen) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-b from-orange-50 via-orange-50/60 to-white text-gray-800 flex flex-col pt-20">
          <div className="max-w-5xl mx-auto w-full px-4 lg:px-0">
            <button
              onClick={() => setShowLocationScreen(false)}
              className="inline-flex items-center text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors mb-6 group"
            >
              <span className="mr-1 transition-transform group-hover:-translate-x-0.5">
                ←
              </span>
              Back to Trainers
            </button>

            <div className="flex flex-col items-center justify-center pb-12">
              <div className="w-full bg-white/90 backdrop-blur rounded-3xl shadow-[0_18px_45px_rgba(15,23,42,0.12)] p-8 md:p-10 border border-orange-100/70 relative overflow-hidden">
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-orange-100/60 blur-3xl" />
                <div className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-amber-100/70 blur-3xl" />

                <div className="relative z-10">
                  <h1 className="text-3xl md:text-4xl font-extrabold text-center text-slate-900 mb-2 tracking-tight">
                    Find{" "}
                    <span className="text-orange-600">Personal Trainers</span>{" "}
                    near you
                  </h1>
                  <p className="text-gray-500 text-center text-sm md:text-base mb-8">
                    Set your location so we can show you the best coaches around
                    you. You can always update this later.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Select area */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Province / City
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
                        className="w-full bg-gray-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400/70 focus:border-orange-400 transition-shadow"
                      >
                        <option value="">-- Choose Province/City --</option>
                        {provinces.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Coordinates */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Or coordinates (Latitude, Longitude)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={coords}
                          onChange={(e) => setCoords(e.target.value)}
                          placeholder="e.g., 15.96810, 108.26340"
                          className="w-full bg-gray-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400/70 focus:border-orange-400 transition-shadow"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-3 mb-6">
                    <button
                      onClick={detectLocation}
                      disabled={detecting}
                      className="flex-1 inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl text-sm md:text-base shadow-md shadow-orange-500/30 transition-all hover:shadow-lg hover:-translate-y-0.5"
                    >
                      {detecting ? "Detecting..." : "📍 Use My Location"}
                    </button>
                    <button
                      onClick={() => {
                        if (!coords) {
                          alert("No coordinates to save yet.");
                          return;
                        }
                        localStorage.setItem("studentCoords", coords);
                        alert(`Saved: ${coords}`);
                      }}
                      className="flex-1 inline-flex items-center justify-center bg-slate-900 hover:bg-slate-950 text-white font-semibold py-2.5 rounded-xl text-sm md:text-base shadow-md shadow-slate-900/25 transition-all hover:shadow-lg hover:-translate-y-0.5"
                    >
                      💾 Save Location
                    </button>
                  </div>

                  <button
                    onClick={handleConfirmArea}
                    disabled={!area && !coords}
                    className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-2xl text-sm md:text-base tracking-wide shadow-lg shadow-orange-500/30 transition-all hover:-translate-y-0.5"
                  >
                    🔎 Confirm & Search Trainers
                  </button>

                  {detectedInfo && (
                    <p className="text-center text-xs md:text-sm text-gray-500 mt-4">
                      {detectedInfo}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // =============== MAIN PAGE ===============
  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-orange-50/60 to-white text-gray-900 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-0 space-y-8">
          {/* Header */}
          <section className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-orange-500 bg-orange-100/70 px-3 py-1 rounded-full">
                Personal Trainers
                <span className="h-1 w-1 rounded-full bg-orange-500" />
              </p>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                Find the right coach for{" "}
                <span className="text-orange-600">your fitness journey</span>
              </h1>
              <p className="text-slate-600 text-sm md:text-base">
                Area: <span className="font-medium">{area || "Not set"}</span>{" "}
                · Coordinates:{" "}
                <span className="font-mono text-xs md:text-sm">
                  {coords || "—"}
                </span>{" "}
                · Mode:{" "}
                <span className="font-medium">
                  {selectedMode || "All modes"}
                </span>
              </p>
              {total > 0 && (
                <p className="text-xs md:text-sm text-slate-500">
                  Showing{" "}
                  <span className="font-semibold text-slate-700">
                    {pts.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-700">
                    {total}
                  </span>{" "}
                  trainers found
                </p>
              )}
            </div>

            <div className="flex flex-col items-start md:items-end gap-3">
              <button
                onClick={() => setShowLocationScreen(true)}
                className="inline-flex items-center gap-1 text-sm text-orange-600 hover:text-orange-500 underline-offset-4 hover:underline transition-colors"
              >
                ✏️ Change area & mode
              </button>
              <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/80 border border-orange-100 px-3 py-1">
                  ✅ Verified PTs
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/80 border border-slate-100 px-3 py-1">
                  📍 Location-based search
                </span>
              </div>
            </div>
          </section>

          {/* Filters */}
          <section className="bg-white/90 backdrop-blur border border-orange-100/70 rounded-3xl shadow-[0_16px_40px_rgba(15,23,42,0.06)] px-4 py-4 md:px-6 md:py-5">
            <div className="flex flex-wrap items-center gap-3 md:gap-4">
              <div className="flex-1 min-w-[180px]">
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Search by name
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                    🔍
                  </span>
                  <input
                    type="text"
                    placeholder="e.g., Minh Nguyễn..."
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setPage(1);
                    }}
                    className="w-full bg-gray-50 border border-slate-200 text-slate-800 rounded-xl pl-8 pr-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400/70 focus:border-orange-400 transition-shadow"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 md:gap-4">
                <div className="min-w-[170px]">
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Training goal
                  </label>
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="bg-gray-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400/70 focus:border-orange-400"
                  >
                    <option value="">All goals</option>
                    {Object.keys(PackageTagLabels).map((key) => (
                      <option key={key} value={key}>
                        {key
                          .charAt(0)
                          .toUpperCase() +
                          key
                            .slice(1)
                            .replace(/([A-Z])/g, " $1")}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="min-w-[160px]">
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Training mode
                  </label>
                  <select
                    value={selectedMode}
                    onChange={(e) => setSelectedMode(e.target.value)}
                    className="bg-gray-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400/70 focus:border-orange-400"
                  >
                    <option value="">All modes</option>
                    <option value="atPtGym">At PT's Gym</option>
                    <option value="atClient">
                      At Client&apos;s Home / Gym
                    </option>
                    <option value="atOtherGym">At Other Gym</option>
                  </select>
                </div>

                <div className="min-w-[150px]">
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Sort by
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setPage(1);
                    }}
                    className="bg-gray-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400/70 focus:border-orange-400"
                  >
                    <option value="best">Best match</option>
                    <option value="rating">Highest rating</option>
                    <option value="price">Lowest price</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Results */}
          <section>
            {loading ? (
              <div className="text-center text-slate-500 py-16">
                <div className="inline-flex flex-col items-center gap-3 animate-pulse">
                  <div className="h-10 w-10 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
                  <p className="text-sm">Loading trainers...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-14 font-medium">
                {error}
              </div>
            ) : pts.length === 0 ? (
              <div className="text-center text-slate-500 py-16">
                <p className="text-lg mb-2 font-semibold">
                  No trainers found 🏋️‍♂️
                </p>

                {showFallback && (
                  <div className="mt-4 space-y-3">
                    <p className="text-sm">
                      We couldn&apos;t find any trainers near your coordinates.
                      Try searching by city instead?
                    </p>
                    <button
                      onClick={() => {
                        setCoords("");
                        fetchPTs();
                      }}
                      className="inline-flex items-center gap-1 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-orange-500/30 transition-all hover:-translate-y-0.5"
                    >
                      🔄 Search by city
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
                {pts.map((pt, index) => (
                  <article
                    key={pt._id}
                    className="group bg-white rounded-3xl border border-orange-100/80 shadow-[0_18px_40px_rgba(15,23,42,0.08)] overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(15,23,42,0.18)]"
                    style={{
                      animation: `fadeInUp 0.45s ease-out ${index * 40}ms both`,
                    }}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={
                          pt.userInfo?.avatar || "https://placehold.co/400x220"
                        }
                        alt={pt.userInfo?.name}
                        className="w-full h-48 object-cover transform transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {pt.specialties?.length > 0 && (
                        <div className="absolute left-3 bottom-3 flex flex-wrap gap-1">
                          {pt.specialties.slice(0, 2).map((s) => (
                            <span
                              key={s}
                              className="inline-flex items-center rounded-full bg-white/90 text-xs font-semibold text-slate-800 px-2.5 py-1 shadow-sm"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex flex-col justify-between min-h-[190px]">
                      <div className="space-y-1.5">
                        <h3 className="text-lg font-semibold text-slate-900 truncate">
                          {pt.userInfo?.name || "Unnamed Trainer"}
                        </h3>

                        <p className="text-xs text-slate-500">
                          📧 {pt.userInfo?.email || "N/A"}
                          <br />
                          📞 {pt.userInfo?.phone || "N/A"}
                        </p>

                        <p className="text-sm text-slate-600 mt-1.5 line-clamp-2">
                          {pt.bio ||
                            (pt.specialties?.length
                              ? `Specialized in ${pt.specialties
                                  .slice(0, 3)
                                  .join(", ")}`
                              : "This trainer has not added a bio yet.")}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 text-[11px] font-semibold text-orange-600 px-2 py-1">
                            ⭐ Top Rated Match
                          </span>
                          {selectedMode && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 text-[11px] text-slate-600 px-2 py-1">
                              📍 Mode: {selectedMode}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() =>
                            navigate(`/pt/${pt.userInfo?._id}`)
                          }
                          className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full px-4 py-2 text-xs md:text-sm shadow-md shadow-orange-500/30 transition-all hover:-translate-y-0.5"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* small inline keyframes for fade-in cards */}
        <style>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translate3d(0, 14px, 0);
            }
            to {
              opacity: 1;
              transform: translate3d(0, 0, 0);
            }
          }
        `}</style>
      </div>
    </MainLayout>
  );
}
