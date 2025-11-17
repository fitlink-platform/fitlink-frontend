import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchPTs } from "~/services/searchService";
import { PackageTagLabels } from "~/domain/enum";
import Navbar from '~/components/Navbar';

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
  const [showFallback, setShowFallback] = useState(false); // 👈 fallback UI flag

  // Search by name + goals
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");

  // Provinces
  const provinces = [
    "An Giang", "Bắc Ninh", "Cà Mau", "Cần Thơ", "Cao Bằng", "Đà Nẵng", "Đắk Lắk", "Điện Biên", "Đồng Nai",
    "Đồng Tháp", "Gia Lai", "Hà Nội", "Hà Tĩnh", "Hải Phòng", "Hưng Yên", "Khánh Hòa", "Lai Châu", "Lâm Đồng", "Lạng Sơn", "Lào Cai", 
    "Nghệ An", "Ninh Bình", "Phú Thọ", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị",  "Sơn La",
    "Tây Ninh", "Thái Nguyên", "Thanh Hóa", "Huế", "Tuyên Quang", "Vĩnh Long", "Hồ Chí Minh"
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

      // Fallback UI nếu không có PT gần
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

  // ✅ sửa điều kiện — không check mode ở màn setup
  const handleConfirmArea = () => {
    if (!area && !coords) {
      alert("Please select a location (city or GPS).");
      return;
    }
    setShowLocationScreen(false);
    setPage(1);
    fetchPTs();
  };

  // ✅ Setup screen
  if (showLocationScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white text-gray-800 flex flex-col">
        <div className="w-full">
          <Navbar />
        </div>
        <div className="px-10 mt-2">
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
              Update your location to discover nearby PTs that match your goals 🏋️‍♂️
            </p>

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
              className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-gray-800 mb-4 focus:ring-2 focus:ring-orange-400"
            >
              <option value="">-- Choose Province/City --</option>
              {provinces.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Or enter coordinates (Latitude, Longitude):
            </label>
            <input
              type="text"
              value={coords}
              onChange={(e) => setCoords(e.target.value)}
              placeholder="e.g., 15.9681,108.2634"
              className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-gray-800 mb-4 focus:ring-2 focus:ring-orange-400"
            />

            <div className="flex gap-3 mb-5">
              <button
                onClick={detectLocation}
                disabled={detecting}
                className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition"
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
                  alert(`✅ Location saved: ${coords}`);
                }}
                className="flex-1 bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 rounded-lg transition"
              >
                💾 Save Location
              </button>
            </div>

            <button
              onClick={handleConfirmArea}
              disabled={!area && !coords}
              className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg text-lg transition"
            >
              🔎 Confirm & Search
            </button>

            {detectedInfo && (
              <p className="text-center text-sm text-gray-500 mt-4">{detectedInfo}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ✅ Main display
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-900 text-gray-100 px-6 py-8 pt-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Personal Trainers</h1>
              <p className="text-gray-400 text-sm mt-1">
                Current area: {area || "—"} | Coordinates: {coords || "—"} | Mode:{" "}
                {selectedMode || "—"}
              </p>
            </div>
            <button
              onClick={() => setShowLocationScreen(true)}
              className="text-sm text-orange-400 hover:text-orange-300 underline"
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
              className="bg-slate-800 border border-slate-700 text-gray-100 rounded-lg px-3 py-2 text-sm"
            />
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-gray-100 rounded-lg px-3 py-2 text-sm min-w-[200px]"
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
              className="bg-slate-800 border border-slate-700 text-gray-100 rounded-lg px-3 py-2 text-sm min-w-[150px]"
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
              className="bg-slate-800 border border-slate-700 text-gray-100 rounded-lg px-3 py-2 text-sm"
            >
              <option value="best">Best match</option>
              <option value="rating">Highest rating</option>
              <option value="price">Lowest price</option>
            </select>
          </div>

          {/* Results */}
          {loading ? (
            <div className="text-center text-gray-400 py-10 animate-pulse">
              Loading trainers...
            </div>
          ) : error ? (
            <div className="text-center text-red-400 py-10 font-medium">{error}</div>
          ) : pts.length === 0 ? (
            <div className="text-center text-gray-400 py-16">
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
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition"
                  >
                    🔄 Search by City
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pts.map((pt) => (
                <div
                  key={pt._id}
                  className="bg-slate-800 rounded-xl border border-slate-700 shadow-md hover:-translate-y-1 transition transform overflow-hidden"
                >
                  <img
                    src={pt.userInfo?.avatar || "https://placehold.co/400x200"}
                    alt={pt.userInfo?.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-5 flex flex-col justify-between min-h-[190px]">
                    <div>
                      <h3 className="text-lg font-semibold text-white truncate">
                        {pt.userInfo?.name || "Unnamed Trainer"}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">
                        📧 {pt.userInfo?.email || "N/A"} <br />
                        📞 {pt.userInfo?.phone || "N/A"}
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        {pt.specialties?.length
                          ? pt.specialties.slice(0, 3).join(", ")
                          : "No specialties listed"}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/pt/${pt.userInfo?._id}`)}
                      className="mt-4 bg-orange-600 hover:bg-orange-500 text-white font-medium rounded-lg py-2 transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
