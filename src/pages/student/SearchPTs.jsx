import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchPTs } from "~/services/searchService";

export default function SearchPTs() {
  const navigate = useNavigate();
  const [pts, setPTs] = useState([]);
  const [availableAt, setAvailableAt] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [timeRange, setTimeRange] = useState("");
  const [sortBy, setSortBy] = useState("best");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [total, setTotal] = useState(0);

  const [showLocationScreen, setShowLocationScreen] = useState(false);
  const [area, setArea] = useState("");
  const [selectedModes, setSelectedModes] = useState([]);
  const [detecting, setDetecting] = useState(false);
  const [detectedInfo, setDetectedInfo] = useState("");
  const [coords, setCoords] = useState("");

  // --- 63 provinces
  const provinces = [
    "An Giang", "Ba Ria - Vung Tau", "Bac Giang", "Bac Kan", "Bac Lieu", "Bac Ninh",
    "Ben Tre", "Binh Dinh", "Binh Duong", "Binh Phuoc", "Binh Thuan", "Ca Mau",
    "Can Tho", "Cao Bang", "Da Nang", "Dak Lak", "Dak Nong", "Dien Bien", "Dong Nai",
    "Dong Thap", "Gia Lai", "Ha Giang", "Ha Nam", "Ha Noi", "Ha Tinh", "Hai Duong",
    "Hai Phong", "Hau Giang", "Hoa Binh", "Hung Yen", "Khanh Hoa", "Kien Giang",
    "Kon Tum", "Lai Chau", "Lam Dong", "Lang Son", "Lao Cai", "Long An", "Nam Dinh",
    "Nghe An", "Ninh Binh", "Ninh Thuan", "Phu Tho", "Phu Yen", "Quang Binh",
    "Quang Nam", "Quang Ngai", "Quang Ninh", "Quang Tri", "Soc Trang", "Son La",
    "Tay Ninh", "Thai Binh", "Thai Nguyen", "Thanh Hoa", "Thua Thien Hue", "Tien Giang",
    "Tra Vinh", "Tuyen Quang", "Vinh Long", "Vinh Phuc", "Yen Bai", "Ho Chi Minh City"
  ];

  // --- Detect GPS location
  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setDetecting(true);
    setDetectedInfo("");

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

  const handleModeChange = (mode) => {
    setSelectedModes((prev) =>
      prev.includes(mode)
        ? prev.filter((m) => m !== mode)
        : [...prev, mode]
    );
  };

  // --- Load saved preferences (fix reload không còn giữ tọa độ khi có city)
  useEffect(() => {
    const savedArea = localStorage.getItem("studentArea");
    const savedModes = JSON.parse(localStorage.getItem("studentModes") || "[]");
    const savedCoords = localStorage.getItem("studentCoords") || "";

    if (savedArea) {
      setArea(savedArea);
      setCoords("");
      localStorage.removeItem("studentCoords"); // xoá luôn tọa độ cũ
    } else if (savedCoords) {
      setCoords(savedCoords);
    }

    if (savedModes.length > 0) setSelectedModes(savedModes);

    if (savedArea || savedCoords) {
      setShowLocationScreen(false);
    } else {
      setShowLocationScreen(true);
    }
  }, []);

  // --- Save to localStorage
  useEffect(() => {
    if (area) localStorage.setItem("studentArea", area);
    if (coords) localStorage.setItem("studentCoords", coords);
    if (selectedModes.length > 0)
      localStorage.setItem("studentModes", JSON.stringify(selectedModes));
  }, [area, coords, selectedModes]);

  // --- Fetch PTs
  const fetchPTs = async () => {
    if (!area && !coords) return;

    try {
      setLoading(true);
      setError("");
      const params = {
        availableAt,
        sortBy,
        specialty,
        packageTime: timeRange,
        page,
        limit,
        modes: selectedModes,
      };

      // ✅ Gửi 1 trong 2: ưu tiên area
      if (area) {
        params.area = area;
      } else if (!area && coords) {
        params.coords = coords;
      }

      const res = await searchPTs(params);
      setPTs(res?.items || []);
      setTotal(res?.total || 0);
    } catch (err) {
      console.error(err);
      setError("Failed to load trainers. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!showLocationScreen && (area || coords) && selectedModes.length > 0) {
      fetchPTs();
    }
  }, [availableAt, sortBy, specialty, timeRange, page, limit, showLocationScreen, area, coords, selectedModes]);

  const handleConfirmArea = () => {
    if ((!area && !coords) || selectedModes.length === 0) {
      alert("Please select a province/city or use your current location, and at least one mode.");
      return;
    }
    setShowLocationScreen(false);
    setPage(1);
    fetchPTs();
  };

  // --- Location setup screen
  if (showLocationScreen) {
    return (
      <div className="min-h-screen bg-slate-900 text-gray-100 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg">
          <h1 className="text-2xl font-bold text-center text-white mb-4">
            Set Your Training Area
          </h1>

          {/* Province */}
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select your province/city:
          </label>
          <select
            value={area}
            onChange={(e) => {
              const val = e.target.value;
              setArea(val);
              if (val) {
                setCoords("");
                localStorage.removeItem("studentCoords");
              }
            }}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-gray-100 mb-3"
          >
            <option value="">-- Choose Province/City --</option>
            {provinces.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          {/* Coordinates */}
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Coordinates (Latitude, Longitude):
          </label>
          <input
            type="text"
            value={coords}
            onChange={(e) => setCoords(e.target.value)}
            placeholder="Not detected yet"
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-gray-100 mb-2"
          />

          <button
            onClick={detectLocation}
            disabled={detecting}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium py-2 rounded-lg mb-2"
          >
            {detecting ? "Detecting..." : "Use My Current Location"}
          </button>

          {/* Save location manually */}
<button
  onClick={() => {
    if (!coords) {
      alert("No coordinates detected yet.");
      return;
    }
    localStorage.setItem("studentCoords", coords);
    alert(`✅ Location saved: ${coords}`);
  }}
  className="w-full bg-green-600 hover:bg-green-500 text-white font-medium py-2 rounded-lg mb-3"
>
  💾 Save Location
</button>

          {detectedInfo && (
            <div className="text-sm text-gray-300 mb-2">{detectedInfo}</div>
          )}

          {/* Modes */}
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Training Mode:
          </label>
          <div className="flex flex-col gap-2 text-gray-200">
            {["atPtGym", "atClient", "atOtherGym"].map((mode) => (
              <label key={mode} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedModes.includes(mode)}
                  onChange={() => handleModeChange(mode)}
                />
                {mode === "atPtGym"
                  ? "At PT's Gym"
                  : mode === "atClient"
                  ? "At Client's Home / Gym"
                  : "At Other Gym"}
              </label>
            ))}
          </div>

          <button
            onClick={handleConfirmArea}
            disabled={(!area && !coords) || selectedModes.length === 0}
            className="w-full mt-6 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-semibold py-2 rounded-lg"
          >
            Confirm Area
          </button>
        </div>
      </div>
    );
  }

  // --- Main display
  return (
    <div className="min-h-screen bg-slate-900 text-gray-100 px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Personal Trainers</h1>
            <p className="text-gray-400 text-sm mt-1">
              Current area: {area || "—"} | Coordinates: {coords || "—"} | Mode:{" "}
              {selectedModes.join(", ") || "—"}
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
            placeholder="Search by specialty..."
            value={specialty}
            onChange={(e) => {
              setSpecialty(e.target.value);
              setPage(1);
            }}
            className="bg-slate-800 border border-slate-700 text-gray-100 rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="datetime-local"
            value={availableAt}
            onChange={(e) => {
              setAvailableAt(e.target.value);
              setPage(1);
            }}
            className="bg-slate-800 border border-slate-700 text-gray-100 rounded-lg px-3 py-2 text-sm"
          />
          <select
            value={timeRange}
            onChange={(e) => {
              setTimeRange(e.target.value);
              setPage(1);
            }}
            className="bg-slate-800 border border-slate-700 text-gray-100 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All durations</option>
            <option value="short">Under 7 days</option>
            <option value="medium">7 - 30 days</option>
            <option value="long">Over 30 days</option>
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
            <p className="text-sm">Try adjusting filters above.</p>
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
  );
}
