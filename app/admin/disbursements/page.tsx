"use client"

import { useState, useEffect, useCallback } from "react"
import { getAllDisbursements, updateDisbursementStatus, createDisbursement } from "@/lib/actions/disbursement.actions"
import { toast } from "sonner"
import { format } from "date-fns"
import { id as localeID } from "date-fns/locale"
import {
  Banknote, RefreshCw, CheckCircle2, Clock, XCircle, AlertCircle,
  Loader2, ArrowUpRight, Plus, ChevronDown
} from "lucide-react"

type Disbursement = {
  id: string
  amount: number
  platform_fee: number
  net_amount: number
  status: string
  bank_name: string
  account_number: string
  account_name: string
  reference_number: string | null
  notes: string | null
  disbursed_at: string | null
  created_at: string
  activity: { id: string; title: string } | null
  community: { id: string; name: string; logo_url: string | null } | null
  admin: { id: string; full_name: string } | null
}

const formatRp = (amount: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount)

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  pending:    { label: "Pending",    color: "#d97706", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.3)",  icon: <Clock className="w-3 h-3" /> },
  processing: { label: "Diproses",  color: "#2563eb", bg: "rgba(37,99,235,0.1)",   border: "rgba(37,99,235,0.3)",   icon: <ArrowUpRight className="w-3 h-3" /> },
  completed:  { label: "Selesai",   color: "#059669", bg: "rgba(5,150,105,0.1)",   border: "rgba(5,150,105,0.3)",   icon: <CheckCircle2 className="w-3 h-3" /> },
  failed:     { label: "Gagal",     color: "#dc2626", bg: "rgba(220,38,38,0.1)",   border: "rgba(220,38,38,0.3)",   icon: <XCircle className="w-3 h-3" /> },
}

export default function AdminDisbursementsPage() {
  const [disbursements, setDisbursements] = useState<Disbursement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState("all")
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [refInput, setRefInput] = useState<Record<string, string>>({})
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    const result = await getAllDisbursements()
    if (result.success) setDisbursements(result.data as Disbursement[])
    else toast.error("Gagal memuat data pencairan")
    setIsLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const handleUpdateStatus = async (id: string, status: "processing" | "completed" | "failed") => {
    const ref = refInput[id]?.trim()
    if (status === "completed" && !ref) {
      toast.error("Nomor referensi wajib diisi saat menandai Selesai.")
      return
    }
    setActionLoading(id + "_" + status)
    const result = await updateDisbursementStatus(id, status, ref || undefined)
    if (result.success) {
      toast.success(`Status pencairan berhasil diubah ke "${statusConfig[status].label}"`)
      setDisbursements(prev => prev.map(d =>
        d.id === id ? { ...d, status, reference_number: ref || d.reference_number, disbursed_at: status === "completed" ? new Date().toISOString() : d.disbursed_at } : d
      ))
    } else {
      toast.error(result.error ?? "Gagal mengubah status.")
    }
    setActionLoading(null)
  }

  const filtered = disbursements.filter(d => filterStatus === "all" || d.status === filterStatus)

  const summary = {
    total: disbursements.reduce((s, d) => s + (d.amount ?? 0), 0),
    completed: disbursements.filter(d => d.status === "completed").reduce((s, d) => s + (d.net_amount ?? 0), 0),
    pending: disbursements.filter(d => d.status === "pending").reduce((s, d) => s + (d.amount ?? 0), 0),
  }

  return (
    <div className="flex-1 bg-slate-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
              <Banknote className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Kelola Pencairan Dana</h1>
              <p className="text-sm text-slate-500">Proses dan pantau disbursement ke rekening komunitas</p>
            </div>
          </div>
          <button onClick={fetchData} className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-teal-600 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors">
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Pencairan", value: formatRp(summary.total), color: "text-slate-800", bg: "bg-white" },
            { label: "Selesai Dicairkan", value: formatRp(summary.completed), color: "text-emerald-700", bg: "bg-emerald-50" },
            { label: "Menunggu Proses", value: formatRp(summary.pending), color: "text-amber-700", bg: "bg-amber-50" },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-2xl border border-slate-100 p-5 shadow-sm`}>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{s.label}</p>
              <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {(["all", "pending", "processing", "completed", "failed"] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                filterStatus === s ? "bg-teal-600 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}>
              {s === "all" ? `Semua (${disbursements.length})` : `${statusConfig[s]?.label} (${disbursements.filter(d => d.status === s).length})`}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <AlertCircle className="h-10 w-10 mx-auto mb-3 text-slate-300" />
              <p className="font-semibold text-slate-500">Tidak ada data pencairan</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {filtered.map(d => {
                const cfg = statusConfig[d.status] ?? statusConfig.pending
                const isExpanded = expandedId === d.id
                const isActing = actionLoading?.startsWith(d.id)
                return (
                  <div key={d.id}>
                    {/* Row */}
                    <div className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/60 transition-colors cursor-pointer"
                      onClick={() => setExpandedId(isExpanded ? null : d.id)}>

                      {/* Status badge */}
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shrink-0"
                        style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                        {cfg.icon} {cfg.label}
                      </span>

                      {/* Community & Activity */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 truncate">{d.community?.name ?? "—"}</p>
                        <p className="text-xs text-slate-400 truncate">{d.activity?.title ?? "—"}</p>
                      </div>

                      {/* Amount */}
                      <div className="text-right shrink-0">
                        <p className="font-black text-slate-800">{formatRp(d.amount)}</p>
                        {d.platform_fee > 0 && (
                          <p className="text-xs text-slate-400">Fee: {formatRp(d.platform_fee)} | Nett: {formatRp(d.net_amount)}</p>
                        )}
                      </div>

                      {/* Date */}
                      <p className="text-xs text-slate-400 shrink-0 w-24 text-right">
                        {format(new Date(d.created_at), "dd MMM yyyy", { locale: localeID })}
                      </p>

                      <ChevronDown className={`h-4 w-4 text-slate-400 shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </div>

                    {/* Expanded detail */}
                    {isExpanded && (
                      <div className="px-5 pb-5 bg-slate-50/50 border-t border-slate-100 space-y-4">
                        {/* Bank info */}
                        <div className="grid sm:grid-cols-3 gap-3 mt-3">
                          {[
                            { label: "Bank", value: d.bank_name },
                            { label: "No. Rekening", value: d.account_number },
                            { label: "Atas Nama", value: d.account_name },
                          ].map(item => (
                            <div key={item.label} className="bg-white rounded-xl p-3 border border-slate-100">
                              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">{item.label}</p>
                              <p className="text-sm font-semibold text-slate-700">{item.value || "—"}</p>
                            </div>
                          ))}
                        </div>

                        {/* Reference & notes */}
                        {(d.reference_number || d.notes || d.disbursed_at) && (
                          <div className="grid sm:grid-cols-3 gap-3">
                            {d.reference_number && (
                              <div className="bg-white rounded-xl p-3 border border-slate-100">
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">No. Referensi</p>
                                <p className="text-sm font-semibold text-slate-700 font-mono">{d.reference_number}</p>
                              </div>
                            )}
                            {d.disbursed_at && (
                              <div className="bg-white rounded-xl p-3 border border-slate-100">
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">Tanggal Cair</p>
                                <p className="text-sm font-semibold text-slate-700">{format(new Date(d.disbursed_at), "dd MMM yyyy HH:mm", { locale: localeID })}</p>
                              </div>
                            )}
                            {d.notes && (
                              <div className="bg-white rounded-xl p-3 border border-slate-100">
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">Catatan</p>
                                <p className="text-sm text-slate-600">{d.notes}</p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Actions */}
                        {d.status !== "completed" && d.status !== "failed" && (
                          <div className="flex flex-wrap items-center gap-3 pt-1">
                            <input
                              type="text"
                              placeholder="No. referensi transfer bank (wajib untuk Selesai)"
                              value={refInput[d.id] ?? ""}
                              onChange={e => setRefInput(prev => ({ ...prev, [d.id]: e.target.value }))}
                              onClick={e => e.stopPropagation()}
                              className="flex-1 min-w-[200px] text-sm px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                            />
                            {d.status === "pending" && (
                              <button onClick={e => { e.stopPropagation(); handleUpdateStatus(d.id, "processing") }}
                                disabled={isActing}
                                className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 disabled:opacity-50 transition-colors">
                                {actionLoading === d.id + "_processing" ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUpRight className="w-4 h-4" />}
                                Tandai Diproses
                              </button>
                            )}
                            <button onClick={e => { e.stopPropagation(); handleUpdateStatus(d.id, "completed") }}
                              disabled={isActing}
                              className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 disabled:opacity-50 transition-colors">
                              {actionLoading === d.id + "_completed" ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                              Selesai
                            </button>
                            <button onClick={e => { e.stopPropagation(); handleUpdateStatus(d.id, "failed") }}
                              disabled={isActing}
                              className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 disabled:opacity-50 transition-colors">
                              {actionLoading === d.id + "_failed" ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                              Gagal
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
