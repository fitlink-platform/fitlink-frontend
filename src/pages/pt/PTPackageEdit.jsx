import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import PTMainLayout from "~/layouts/pt/PTMainLayout";
import { getPackageById, updatePackage } from "~/services/packageService";
import { PackageTagLabels, PackageTags } from "~/domain/enum";

// weekday helpers
const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_IDX = [0, 1, 2, 3, 4, 5, 6];

export default function PTPackageEdit() {
  const { packageId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    totalSessions: 1,
    sessionDurationMin: 60,
    durationDays: 30,
    isActive: true,
    visibility: "private",
    tags: [], // ALWAYS array
    supports: { atPtGym: false, atClient: false, atOtherGym: false },
    travelOn: false,
    travelPricing: { enabled: false, freeRadiusKm: 0, maxTravelKm: 0, feePerKm: 0 },
    daysGroup: [] // single group [1,3,5] (controller sẽ normalize)
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const res = await getPackageById(packageId);
        const p = res?.data;

        const supports = p?.supports ?? { atPtGym: false, atClient: false, atOtherGym: false };
        const travel = p?.travelPricing ?? { enabled: false, freeRadiusKm: 0, maxTravelKm: 0, feePerKm: 0 };
        const daysGroup =
          Array.isArray(p?.recurrence?.daysOfWeek) && p.recurrence.daysOfWeek[0]
            ? p.recurrence.daysOfWeek[0]
            : [];

        setForm({
          name: p?.name ?? "",
          description: p?.description ?? "",
          price: Number(p?.price ?? 0),
          totalSessions: Number(p?.totalSessions ?? 1),
          sessionDurationMin: Number(p?.sessionDurationMin ?? 60),
          durationDays: Number(p?.durationDays ?? 30),
          isActive: !!p?.isActive,
          visibility: p?.visibility || "private",
          tags: Array.isArray(p?.tags) ? p.tags : [], // <- array
          supports,
          travelOn: !!travel.enabled,
          travelPricing: {
            enabled: !!travel.enabled,
            freeRadiusKm: Number(travel.freeRadiusKm ?? 0),
            maxTravelKm: Number(travel.maxTravelKm ?? 0),
            feePerKm: Number(travel.feePerKm ?? 0)
          },
          daysGroup
        });
      } catch (e) {
        const msg = e?.message || "Không tải được dữ liệu.";
        setErrorMsg(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, [packageId]);

  const disabled = loading || saving;
  const onChange = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");

    const payload = {
      name: form.name.trim(),
      description: form.description ?? "",
      price: Math.max(0, Math.round(Number(form.price || 0))),
      totalSessions: Number(form.totalSessions),
      sessionDurationMin: Number(form.sessionDurationMin),
      durationDays: Number(form.durationDays),
      isActive: !!form.isActive,
      visibility: form.visibility,
      tags: form.tags, // send array as-is
      supports: form.supports,
      travelPricing: {
        enabled: !!form.travelOn,
        freeRadiusKm: Number(form.travelPricing.freeRadiusKm || 0),
        maxTravelKm: Number(form.travelPricing.maxTravelKm || 0),
        feePerKm: Number(form.travelPricing.feePerKm || 0)
      },
      recurrence: {
        // controller normalize được [1,3,5] hoặc [[...]]
        daysOfWeek: Array.isArray(form.daysGroup) && form.daysGroup.length ? form.daysGroup : []
      }
    };

    try {
      await updatePackage(packageId, payload);
      toast.success("Saved successfully.");
      navigate(`/pt/packages/${packageId}`);
    } catch (e) {
      const msg = e?.message || "Cập nhật thất bại.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PTMainLayout>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-gray-300">Loading…</div>
      </PTMainLayout>
    );
  }

  return (
    <PTMainLayout>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <div className="mb-1 text-xs text-gray-400">
            <Link to="/pt/packages" className="hover:underline">
              Packages
            </Link>
            <span className="mx-2 opacity-60">/</span>
            <Link to={`/pt/packages/${packageId}`} className="hover:underline">
              Detail
            </Link>
            <span className="mx-2 opacity-60">/</span>
            <span className="text-gray-300">Edit</span>
          </div>
          <h1 className="text-2xl font-semibold text-white">Edit Package</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/pt/packages/${packageId}`}
            className="rounded-xl border border-white/10 px-3 py-2 text-xs text-gray-300 hover:bg-white/10"
          >
            Cancel
          </Link>
          <button
            form="pkg-edit"
            type="submit"
            disabled={disabled}
            className="rounded-xl bg-orange-500 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      {errorMsg ? (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {errorMsg}
        </div>
      ) : null}

      <form id="pkg-edit" onSubmit={onSubmit} className="grid gap-5 lg:grid-cols-3">
        {/* left: basics */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 lg:col-span-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <div className="mb-1 text-xs text-gray-400">Name *</div>
              <input
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
                value={form.name}
                onChange={(e) => onChange("name", e.target.value)}
                required
                disabled={disabled}
              />
            </label>

            <label className="block">
              <div className="mb-1 text-xs text-gray-400">Visibility</div>
              <select
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                value={form.visibility}
                onChange={(e) => onChange("visibility", e.target.value)}
                disabled={disabled}
              >
                <option value="private">private</option>
                <option value="public">public</option>
              </select>
            </label>

            <label className="block sm:col-span-2">
              <div className="mb-1 text-xs text-gray-400">Description</div>
              <textarea
                rows={5}
                className="w-full resize-y rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                value={form.description}
                onChange={(e) => onChange("description", e.target.value)}
                disabled={disabled}
              />
            </label>

            <label className="block">
              <div className="mb-1 text-xs text-gray-400">Total sessions *</div>
              <input
                type="number"
                min={1}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                value={form.totalSessions}
                onChange={(e) => onChange("totalSessions", e.target.value)}
                required
                disabled={disabled}
              />
            </label>

            <label className="block">
              <div className="mb-1 text-xs text-gray-400">Session duration (min) *</div>
              <input
                type="number"
                min={15}
                step={5}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                value={form.sessionDurationMin}
                onChange={(e) => onChange("sessionDurationMin", e.target.value)}
                required
                disabled={disabled}
              />
            </label>

            <label className="block">
              <div className="mb-1 text-xs text-gray-400">Duration (days) *</div>
              <input
                type="number"
                min={1}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                value={form.durationDays}
                onChange={(e) => onChange("durationDays", e.target.value)}
                required
                disabled={disabled}
              />
            </label>

            <label className="block">
              <div className="mb-1 text-xs text-gray-400">Price (₫ / session)</div>
              <input
                type="number"
                min={0}
                step={1000}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                value={form.price}
                onChange={(e) => onChange("price", e.target.value)}
                disabled={disabled}
              />
            </label>

            <div className="flex items-center gap-2">
              <input
                id="isActive"
                type="checkbox"
                className="h-4 w-4 rounded border-white/20 bg-white/5"
                checked={form.isActive}
                onChange={(e) => onChange("isActive", e.target.checked)}
                disabled={disabled}
              />
              <label htmlFor="isActive" className="text-sm text-gray-300">
                Active
              </label>
            </div>

            {/* Tags */}
            <div className="sm:col-span-2">
              <div className="mb-2 text-xs text-gray-400">Tags</div>
              <div className="flex flex-wrap gap-2">
                {Object.values(PackageTags).map((key) => {
                  const checked = form.tags.includes(key);
                  return (
                    <label
                      key={key}
                      className={`cursor-pointer select-none rounded-full border px-3 py-1 text-xs ${
                        checked
                          ? "border-blue-400/30 bg-blue-500/15 text-blue-200"
                          : "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"
                      }`}
                      title={key}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={checked}
                        onChange={(e) =>
                          setForm((s) => ({
                            ...s,
                            tags: e.target.checked ? [...s.tags, key] : s.tags.filter((t) => t !== key)
                          }))
                        }
                        disabled={disabled}
                      />
                      {PackageTagLabels[key] || key}
                    </label>
                  );
                })}
              </div>
              <div className="mt-2 text-xs text-gray-500">Chọn nhiều tag nếu cần.</div>
            </div>
          </div>
        </div>

        {/* right: advanced */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-3 text-sm font-semibold text-white">Supports</div>
            {["atPtGym", "atClient", "atOtherGym"].map((k) => (
              <label key={k} className="mb-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/20 bg-white/5"
                  checked={!!form.supports?.[k]}
                  onChange={(e) => onChange("supports", { ...form.supports, [k]: e.target.checked })}
                  disabled={disabled}
                />
                <span className="text-sm text-gray-300">
                  {k === "atPtGym" ? "@PT Gym" : k === "atClient" ? "@Client" : "@Other Gym"}
                </span>
              </label>
            ))}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold text-white">Travel pricing</div>
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/20 bg-white/5"
                  checked={form.travelOn}
                  onChange={(e) => onChange("travelOn", e.target.checked)}
                  disabled={disabled}
                />
                Enable
              </label>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <label className="block">
                <div className="mb-1 text-xs text-gray-400">Free radius (km)</div>
                <input
                  type="number"
                  min={0}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                  value={form.travelPricing.freeRadiusKm}
                  onChange={(e) =>
                    onChange("travelPricing", { ...form.travelPricing, freeRadiusKm: e.target.value })
                  }
                  disabled={disabled || !form.travelOn}
                />
              </label>
              <label className="block">
                <div className="mb-1 text-xs text-gray-400">Max travel (km)</div>
                <input
                  type="number"
                  min={0}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                  value={form.travelPricing.maxTravelKm}
                  onChange={(e) =>
                    onChange("travelPricing", { ...form.travelPricing, maxTravelKm: e.target.value })
                  }
                  disabled={disabled || !form.travelOn}
                />
              </label>
              <label className="block">
                <div className="mb-1 text-xs text-gray-400">Fee per km (₫)</div>
                <input
                  type="number"
                  min={0}
                  step={1000}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                  value={form.travelPricing.feePerKm}
                  onChange={(e) =>
                    onChange("travelPricing", { ...form.travelPricing, feePerKm: e.target.value })
                  }
                  disabled={disabled || !form.travelOn}
                />
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-2 text-sm font-semibold text-white">Recurrence (days of week)</div>
            <div className="grid grid-cols-4 gap-2">
              {DAY_IDX.map((d) => (
                <label key={d} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-white/20 bg-white/5"
                    checked={form.daysGroup.includes(d)}
                    onChange={(e) =>
                      onChange(
                        "daysGroup",
                        e.target.checked
                          ? Array.from(new Set([...form.daysGroup, d])).sort((a, b) => a - b)
                          : form.daysGroup.filter((x) => x !== d)
                      )
                    }
                    disabled={disabled}
                  />
                  <span className="text-sm text-gray-300">{WD[d]}</span>
                </label>
              ))}
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Lưu ý: bạn đang chọn <b>1 nhóm</b> ngày lặp (ví dụ Mon,Wed,Fri). BE sẽ tự normalize.
            </div>
          </div>
        </div>
      </form>
    </PTMainLayout>
  );
}
