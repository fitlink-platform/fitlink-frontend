import React, { useEffect, useMemo, useState, useCallback } from "react";
import axiosClient from "~/api/axiosClient";

/* ====== UI helpers ====== */
function Badge({ children, className = "" }) {
  return (
    <span className={`inline-block text-[12px] px-2 py-0.5 rounded-md font-medium ${className}`}>
      {children}
    </span>
  );
}

function GenderText({ gender }) {
  if (!gender) return "—";
  const g = String(gender).toUpperCase();
  const map = { MALE: "Male", FEMALE: "Female", OTHER: "Other" };
  return map[g] || gender;
}

/* ====== PT Detail Modal ====== */
function PTDetailModal({ open, onClose, row }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const escHandler = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", escHandler);
    return () => document.removeEventListener("keydown", escHandler);
  }, [open, escHandler]);

  const handleBanToggle = async () => {
    const action = row.isActive ? "block" : "unlock";
    const confirmMsg = row.isActive
      ? "Are you sure you want to ban this PT account?"
      : "Are you sure you want to unban this PT account?";

    if (!window.confirm(confirmMsg)) return;

    try {
      setIsProcessing(true);
      await axiosClient.patch(`/admin/users/${row._id}/${action}`);
      alert(row.isActive ? "PT account has been banned." : "PT account has been unbanned.");
      onClose();
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Operation failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!open || !row) return null;

  const fmt = (d) => (d ? new Date(d).toLocaleString("vi-VN") : "—");

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute inset-0 flex items-start md:items-center justify-center p-4">
        <div className="w-full max-w-3xl bg-slate-800 text-gray-100 rounded-2xl border border-slate-700 shadow-2xl flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
            <h3 className="text-xl font-semibold text-orange-400">PT Details</h3>
            <button onClick={onClose} className="px-2 py-1 rounded hover:bg-slate-700">✕</button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            {/* Basic info */}
            <div className="flex gap-4">
              {row.avatar ? (
                <img
                  src={row.avatar}
                  alt={row.name}
                  className="w-16 h-16 rounded-full object-cover border border-slate-600"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-slate-700 border border-slate-600" />
              )}
              <div className="space-y-1 min-w-0">
                <div className="text-2xl font-semibold truncate">{row.name || "—"}</div>
                <div className="text-sm text-gray-400 break-all">ID: {row._id}</div>
                <div className="text-sm space-y-0.5">
                  <div><b>Email:</b> {row.email || "—"}</div>
                  <div><b>Phone:</b> {row.phone || "—"}</div>
                  <div><b>Gender:</b> <GenderText gender={row.gender} /></div>
                  <div className="flex items-center gap-2">
                    <b>Account Status:</b>
                    <span className={`inline-block w-2 h-2 rounded-full ${row.isActive ? "bg-emerald-400" : "bg-red-500"}`} />
                    <span>{row.isActive ? "Active" : "Banned"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  {row.verified && (
                    <Badge className="bg-emerald-900/40 text-emerald-300 border border-emerald-800">
                      Verified
                    </Badge>
                  )}
                  {row.availableForNewClients != null && (
                    <Badge className="bg-blue-900/40 text-blue-300 border border-blue-800">
                      {row.availableForNewClients ? "Accepting Clients" : "Not Accepting Clients"}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="text-gray-300 space-y-3">
              <p><b>Experience:</b> {row.yearsExperience ?? 0} years</p>
              <p><b>Rating:</b> {(row.ratingAvg ?? 0).toFixed(1)} ({row.ratingCount || 0})</p>
              <p><b>Specialties:</b> {row.specialties?.length ? row.specialties.join(", ") : "—"}</p>

              {/* Gym info */}
              {row.gymName || row.gymAddress ? (
                <div>
                  <p className="font-semibold">🏋️ Gym Information</p>
                  <div className="ml-2 space-y-1">
                    <div><b>Name:</b> {row.gymName || "—"}</div>
                    <div><b>Address:</b> {row.gymAddress || "—"}</div>
                    {row.gymCoordinates && (
                      <div><b>Coordinates:</b> {row.gymCoordinates}</div>
                    )}
                    {row.gymImage && (
                      <div className="pt-2">
                        <p className="text-sm text-gray-400 mb-1">Gym Image:</p>
                        <img
                          src={row.gymImage}
                          alt="Gym"
                          className="rounded-lg border border-slate-600 max-h-48 object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p><b>Gym:</b> —</p>
              )}

              {/* Certificates with link */}
              <div>
                <p className="font-semibold">📜 Certificates:</p>
                {row.certificates?.length ? (
                  <ul className="list-disc ml-6 space-y-1">
                    {row.certificates.map((c, i) => {
                      const name = typeof c === "string" ? c : (c?.name || `Certificate ${i + 1}`);
                      const issuer = typeof c === "object" && c?.issuer ? ` • Issuer: ${c.issuer}` : "";
                      const year = typeof c === "object" && c?.year ? ` • Year: ${c.year}` : "";
                      const hasUrl = typeof c === "object" && c?.url;
                      return (
                        <li key={i} className="leading-snug">
                          <span className="mr-2">{name}{issuer}{year}</span>
                          {hasUrl && (
                            <a
                              href={c.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 underline"
                            >
                              View certificate ↗
                            </a>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="ml-2 text-gray-400">No certificates uploaded.</p>
                )}
              </div>

              {/* System info */}
              <div>
                <p className="font-semibold">🕒 System Info</p>
                <p className="ml-2 text-sm text-gray-400">
                  Created: {fmt(row.createdAt)} <br />
                  Updated: {fmt(row.updatedAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-700 flex justify-between items-center">
            <div className="text-sm text-gray-400">{isProcessing && "Processing..."}</div>
            <div className="flex gap-3">
              <button
                onClick={handleBanToggle}
                disabled={isProcessing}
                className={`px-4 py-2 rounded-md font-medium ${
                  row.isActive ? "bg-red-600 hover:bg-red-500" : "bg-emerald-600 hover:bg-emerald-500"
                } text-white`}
              >
                {row.isActive ? "Ban (Deactivate)" : "Unban (Reactivate)"}
              </button>
              <button
                onClick={onClose}
                disabled={isProcessing}
                className="px-4 py-2 rounded-md border border-slate-700 bg-slate-700 hover:bg-slate-600 text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ====== Main Component ====== */
export default function PTList() {
  const [users, setUsers] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");
  const [filterVerified, setFilterVerified] = useState("all");
  const [filterAvail, setFilterAvail] = useState("all");
  const [sortBy, setSortBy] = useState("none");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const openDetail = (row) => { setSelectedRow(row); setOpenModal(true); };
  const closeDetail = () => { setOpenModal(false); setSelectedRow(null); };

  // === Fetch users & approved PT profiles (GIỮ LOGIC CŨ) ===
  useEffect(() => {
    (async () => {
      try {
        const resUsers = await axiosClient.get("/admin/users");
        const allUsers = resUsers.data || [];
        const ptUsers = allUsers.filter((u) => u.role === "pt" || u.role === "trainer");

        const resOv = await axiosClient.get("/admin/overview");
        const approvedPTs = resOv.data?.approvedPTs || [];

        setUsers(ptUsers);
        setProfiles(approvedPTs);
      } catch (e) {
        console.error(e);
        setErr("Failed to load PT list. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // === Map profile by userId ===
  const profileByUserId = useMemo(() => {
    const m = new Map();
    for (const p of profiles) {
      const uid = typeof p.user === "string" ? p.user : p.user?._id;
      if (uid) m.set(String(uid), p);
    }
    return m;
  }, [profiles]);

  // === Merge user with profile ===
  const data = useMemo(() => {
    return users.map((u) => {
      const prof = profileByUserId.get(String(u._id));
      return {
        _id: u._id,
        name: u.name || "—",
        email: u.email,
        phone: u.phone || "",
        gender: u.gender,
        avatar: u.avatar || "",
        isActive: u.isActive,
        verified: prof?.verified ?? false,
        availableForNewClients: prof?.availableForNewClients ?? null,
        specialties: prof?.specialties || [],
        yearsExperience: prof?.yearsExperience ?? null,
        ratingAvg: prof?.ratingAvg ?? null,
        ratingCount: prof?.ratingCount ?? null,
        certificates: prof?.certificates || [],
        createdAt: prof?.createdAt || null,
        updatedAt: prof?.updatedAt || null,
        gymName: prof?.primaryGym?.name || "",
        gymAddress: prof?.primaryGym?.address || "",
        gymImage: prof?.primaryGym?.image || "",
        gymCoordinates: prof?.primaryGym?.coordinates
        ? `${prof.primaryGym.coordinates.lat}, ${prof.primaryGym.coordinates.lng}`
        : null,
      };
    });
  }, [users, profileByUserId]);

  // === Filter / Sort ===
  const filteredSorted = useMemo(() => {
    let rows = [...data];
    const t = q.trim().toLowerCase();
    if (t) {
      rows = rows.filter(
        (r) =>
          (r.name || "").toLowerCase().includes(t) ||
          (r.email || "").toLowerCase().includes(t) ||
          (r.phone || "").toLowerCase().includes(t)
      );
    }
    if (filterVerified !== "all") {
      const v = filterVerified === "true";
      rows = rows.filter((r) => r.verified === v);
    }
    if (filterAvail !== "all") {
      const v = filterAvail === "true";
      rows = rows.filter((r) => (r.availableForNewClients ?? false) === v);
    }
    if (sortBy === "rating") rows.sort((a, b) => (b.ratingAvg ?? 0) - (a.ratingAvg ?? 0));
    else if (sortBy === "exp") rows.sort((a, b) => (b.yearsExperience ?? 0) - (a.yearsExperience ?? 0));
    return rows;
  }, [data, q, filterVerified, filterAvail, sortBy]);

  useEffect(() => setPage(1), [q, filterVerified, filterAvail, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / pageSize));
  const pageRows = filteredSorted.slice((page - 1) * pageSize, page * pageSize);

  if (loading) return <div className="p-6">Loading...</div>;
  if (err) return <div className="p-6 text-red-500">{err}</div>;

  return (
    <div className="bg-[#0f172a] text-white min-h-screen p-6 -mt-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">PT List</h1>
        <p className="text-gray-400">{filteredSorted.length} results</p>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 rounded-lg overflow-hidden shadow-md mb-4">
        <div className="px-6 py-3 flex flex-wrap gap-3 items-center border-b border-slate-700">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name / email / phone…"
            className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-gray-100 placeholder:text-gray-400 min-w-[240px] focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <select
            value={filterVerified}
            onChange={(e) => setFilterVerified(e.target.value)}
            className="bg-slate-700 border border-slate-600 rounded-lg px-2 py-2 text-gray-100"
          >
            <option value="all">All (verified/unverified)</option>
            <option value="true">Verified</option>
            <option value="false">Unverified</option>
          </select>
          <select
            value={filterAvail}
            onChange={(e) => setFilterAvail(e.target.value)}
            className="bg-slate-700 border border-slate-600 rounded-lg px-2 py-2 text-gray-100"
          >
            <option value="all">All (availability)</option>
            <option value="true">Accepting Clients</option>
            <option value="false">Not Accepting</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-700 border border-slate-600 rounded-lg px-2 py-2 text-gray-100"
          >
            <option value="none">No Sorting</option>
            <option value="rating">Rating (desc)</option>
            <option value="exp">Experience (desc)</option>
          </select>
        </div>

        {/* Table (fix width + no “bành ra”) */}
        <div className="overflow-x-auto">
          <table className="w-full table-fixed text-sm text-gray-300">
            <thead className="bg-slate-700 text-gray-200">
              <tr>
                <th className="w-[10%] px-6 py-3 text-left">Profile</th>
                <th className="w-[18%] px-6 py-3 text-left">PT</th>
                <th className="w-[15%] px-6 py-3 text-left">Contact</th>
                <th className="w-[13%] px-6 py-3 text-left">Specialties</th>
                <th className="w-[8%] px-6 py-3 text-left">Exp</th>
                <th className="w-[8%] px-6 py-3 text-left">Rating</th>
                <th className="w-[10%] px-6 py-3 text-left">Gym</th>
                <th className="w-[8%] px-6 py-3 text-center">Certificates</th>
                <th className="w-[8%] px-6 py-3 text-left">Status</th>
                <th className="w-[8%] px-6 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-6 text-center text-gray-400">
                    No results found.
                  </td>
                </tr>
              ) : (
                pageRows.map((row) => (
                  <tr key={row._id} className="border-b border-slate-700 hover:bg-slate-700/40">
                    {/* Profile status */}
                    <td className="px-6 py-3">
                      <div className="flex flex-col gap-1">
                        {row.verified && (
                          <Badge className="bg-emerald-900/40 text-emerald-300 border border-emerald-800 text-center">
                            Verified
                          </Badge>
                        )}
                        {row.availableForNewClients != null && (
                          <Badge
                            className={`text-center ${
                              row.availableForNewClients
                                ? "bg-blue-900/40 text-blue-300 border border-blue-800"
                                : "bg-slate-800/60 text-slate-400 border border-slate-700"
                            }`}
                          >
                            {row.availableForNewClients ? "Accepting Clients" : "Not Accepting"}
                          </Badge>
                        )}
                        {!row.verified && row.availableForNewClients == null && (
                          <Badge className="text-center bg-slate-700/40 text-gray-400 border border-slate-700">
                            Unverified
                          </Badge>
                        )}
                      </div>
                    </td>

                    {/* PT basic */}
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {row.avatar ? (
                          <img
                            src={row.avatar}
                            alt={row.name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-700"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-slate-700 border border-slate-600" />
                        )}
                        <div className="min-w-0">
                          <div className="font-medium text-gray-100 truncate max-w-[120px]">
                            {row.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            Gender: <GenderText gender={row.gender} />
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-3">
                      <div className="truncate max-w-[170px]">{row.email || "—"}</div>
                      <div className="text-xs text-gray-400">{row.phone || ""}</div>
                    </td>

                    {/* Specialties */}
                    <td className="px-6 py-3">
                      {row.specialties.length ? (
                        <div className="flex flex-wrap gap-1 max-w-[220px]">
                          {row.specialties.map((s, i) => (
                            <Badge
                              key={i}
                              className="bg-indigo-900/40 text-indigo-300 border border-indigo-800"
                            >
                              {s}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>

                    {/* Experience */}
                    <td className="px-6 py-3">{row.yearsExperience != null ? `${row.yearsExperience} yrs` : "—"}</td>

                    {/* Rating */}
                    <td className="px-6 py-3">
                      {row.ratingAvg != null ? (
                        <span className="inline-flex items-center gap-1">
                          <span className="font-semibold">{Number(row.ratingAvg).toFixed(1)}</span>
                          <span className="text-xs text-gray-400">({row.ratingCount || 0})</span>
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>

                    {/* Gym */}
                    <td className="px-6 py-3">
                      {row.gymName || row.gymAddress ? (
                        <div className="space-y-0.5">
                          <div className="font-medium truncate max-w-[180px]">{row.gymName || "—"}</div>
                          <div className="text-xs text-gray-400 max-w-[200px] whitespace-pre-line break-words">
                            {row.gymAddress
                              ? row.gymAddress
                                  .split(",")
                                  .map((part) => part.trim())
                                  .join("\n")
                              : "—"}
                          </div>
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>

                    {/* Certificates (center) */}
                    <td className="px-6 py-3 text-center">
                      {row.certificates.length ? (
                        <span className="text-sm">{row.certificates.length} certificates</span>
                      ) : (
                        "—"
                      )}
                    </td>

                    {/* Account Status */}
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-block w-2 h-2 rounded-full ${
                            row.isActive ? "bg-emerald-400" : "bg-red-500"
                          }`}
                        />
                        <span>{row.isActive ? "Active" : "Banned"}</span>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-3 text-center">
                      <button
                        onClick={() => openDetail(row)}
                        className="inline-flex items-center justify-center bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium px-3 py-1.5 rounded-md shadow-sm"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-700">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="border border-slate-700 bg-slate-700 text-gray-100 hover:bg-slate-600 disabled:opacity-50 rounded-md px-3 py-1"
          >
            Previous
          </button>
          <span className="text-sm text-gray-300">Page {page}/{totalPages}</span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="border border-slate-700 bg-slate-700 text-gray-100 hover:bg-slate-600 disabled:opacity-50 rounded-md px-3 py-1"
          >
            Next
          </button>
        </div>
      </div>

      {/* Detail Modal */}
      <PTDetailModal open={openModal} onClose={closeDetail} row={selectedRow} />
    </div>
  );
}
