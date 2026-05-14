"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Users,
  Building2,
  FileText,
  Banknote,
  Activity,
  CheckCircle2,
  X,
  TrendingUp,
  Clock,
  UserCheck,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils/helpers";
import { toast } from "sonner";
import {
  getAdminDashboardStats,
  getPendingCommunities,
  getPendingActivities,
  getPendingReports,
  approveCommunityAction,
  rejectCommunityAction,
  approveActivityAction,
  rejectActivityAction,
} from "@/lib/actions/dashboard.actions";
import { getVolunteersPendingVerification } from "@/lib/actions/volunteer-verification.actions";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalCommunities: 0,
    totalUsers: 0,
    totalActivities: 0,
    totalEndowment: 0,
  });
  const [pendingCommunities, setPendingCommunities] = useState<any[]>([]);
  const [pendingActivities, setPendingActivities] = useState<any[]>([]);
  const [pendingReports, setPendingReports] = useState<any[]>([]);
  const [pendingVolunteers, setPendingVolunteers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  async function load() {
    setIsLoading(true);
    const [st, pc, pa, pr, pv] = await Promise.all([
      getAdminDashboardStats(),
      getPendingCommunities(),
      getPendingActivities(),
      getPendingReports(),
      getVolunteersPendingVerification("pending"),
    ]);
    setStats(st);
    setPendingCommunities(pc);
    setPendingActivities(pa);
    setPendingReports(pr);
    setPendingVolunteers(pv.success ? (pv.data as any[]).length : 0);
    setIsLoading(false);
  }

  useEffect(() => { load(); }, []);

  const handleApprove = async (entity: "Komunitas" | "Kegiatan", id: string) => {
    const result = entity === "Komunitas"
      ? await approveCommunityAction(id)
      : await approveActivityAction(id);
    if (result.success) {
      toast.success(`${entity} berhasil disetujui ✅`);
      if (entity === "Komunitas") setPendingCommunities((p) => p.filter((c) => c.id !== id));
      else setPendingActivities((p) => p.filter((a) => a.id !== id));
    } else toast.error(result.error ?? "Gagal.");
  };

  const handleReject = async (entity: "Komunitas" | "Kegiatan", id: string) => {
    const result = entity === "Komunitas"
      ? await rejectCommunityAction(id)
      : await rejectActivityAction(id);
    if (result.success) {
      toast.info(`${entity} ditolak.`);
      if (entity === "Komunitas") setPendingCommunities((p) => p.filter((c) => c.id !== id));
      else setPendingActivities((p) => p.filter((a) => a.id !== id));
    } else toast.error(result.error ?? "Gagal.");
  };

  const statCards = [
    { label: "Total Komunitas",    value: stats.totalCommunities,              icon: Building2, color: "text-teal-600",   bg: "bg-teal-50",   border: "border-teal-100" },
    { label: "Pengguna Aktif",     value: stats.totalUsers,                    icon: Users,     color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-100" },
    { label: "Kegiatan Aktif",     value: stats.totalActivities,               icon: Activity,  color: "text-green-600",  bg: "bg-green-50",  border: "border-green-100" },
    { label: "Total Dana Terkumpul", value: formatCurrency(stats.totalEndowment), icon: Banknote,  color: "text-amber-600",  bg: "bg-amber-50",  border: "border-amber-100" },
  ];

  const alertCards = [
    { label: `${pendingCommunities.length}`, desc: "Komunitas menunggu verifikasi", color: "from-yellow-400 to-orange-400", icon: Building2, href: "/admin/communities" },
    { label: `${pendingActivities.length}`,  desc: "Kegiatan menunggu persetujuan", color: "from-blue-400 to-cyan-400",    icon: Activity,  href: "/admin/activities"  },
    { label: `${pendingReports.length}`,     desc: "Laporan menunggu validasi",     color: "from-green-400 to-teal-400",   icon: FileText,  href: "/admin/reports"     },
    { label: `${pendingVolunteers}`,         desc: "Pengguna menunggu verifikasi",  color: "from-purple-400 to-pink-400",  icon: UserCheck, href: "/admin/users"       },
  ];

  return (
    <>

        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between gap-4">
          <div className="pl-10 md:pl-0">
            <h1 className="text-xl font-black text-slate-800 tracking-tight">Admin Dashboard</h1>
            <p className="text-xs text-slate-400">Ringkasan aktivitas platform SinergiLaut</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={load}
              disabled={isLoading}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-600 transition-colors px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <Link
              href="/"
              className="text-xs font-semibold text-slate-500 hover:text-teal-600 transition-colors px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              Lihat Website →
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 space-y-6">

          {/* ── Stats ── */}
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-28 bg-white rounded-2xl border border-slate-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map((stat) => (
                <div key={stat.label} className={`bg-white rounded-2xl border ${stat.border} p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow`}>
                  <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center shrink-0`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                    <p className="text-2xl font-black text-slate-800 mt-0.5">{stat.value}</p>
                    <p className="text-[10px] text-green-500 font-semibold flex items-center gap-1 mt-0.5">
                      <TrendingUp className="h-2.5 w-2.5" /> Live
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Alert Summary ── */}
          {!isLoading && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {alertCards.map((a) => (
                <Link
                  key={a.href}
                  href={a.href}
                  className="group bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${a.color} flex items-center justify-center shrink-0 shadow-sm`}>
                    <a.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-2xl font-black text-slate-800 leading-none">{a.label}</p>
                    <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{a.desc}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              ))}
            </div>
          )}

          {/* ── Pending Cards ── */}
          {!isLoading && (
            <div className="grid lg:grid-cols-2 gap-6">

              {/* Komunitas Pending */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center">
                      <Clock className="h-4 w-4 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Komunitas Pending</p>
                      <p className="text-xs text-slate-400">Perlu tindakan admin</p>
                    </div>
                  </div>
                  <Link href="/admin/communities" className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1">
                    Lihat Semua <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
                <div className="p-4">
                  {pendingCommunities.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">Tidak ada yang pending</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {pendingCommunities.slice(0, 3).map((c) => (
                        <div key={c.id} className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border-l-4 border-l-yellow-400 hover:bg-slate-100 transition-colors">
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-sm text-slate-800 truncate">{c.name}</p>
                            <p className="text-xs text-slate-400">{formatDate(c.created_at)}</p>
                          </div>
                          <div className="flex gap-1.5 shrink-0">
                            <Button size="sm" className="h-7 px-2.5 bg-green-500 hover:bg-green-600 text-xs rounded-lg" onClick={() => handleApprove("Komunitas", c.id)}>
                              <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Setujui
                            </Button>
                            <Button size="sm" variant="destructive" className="h-7 px-2 text-xs rounded-lg" onClick={() => handleReject("Komunitas", c.id)}>
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Kegiatan Pending */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Activity className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Kegiatan Pending</p>
                      <p className="text-xs text-slate-400">Menunggu moderasi</p>
                    </div>
                  </div>
                  <Link href="/admin/activities" className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1">
                    Lihat Semua <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
                <div className="p-4">
                  {pendingActivities.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">Tidak ada yang pending</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {pendingActivities.slice(0, 3).map((a) => (
                        <div key={a.id} className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border-l-4 border-l-blue-400 hover:bg-slate-100 transition-colors">
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-sm text-slate-800 truncate">{a.title}</p>
                            <p className="text-xs text-slate-400">{a.community?.name} • {formatDate(a.start_date)}</p>
                          </div>
                          <div className="flex gap-1.5 shrink-0">
                            <Button size="sm" variant="outline" className="h-7 px-2 text-xs rounded-lg" asChild>
                              <Link href={`/admin/activities/${a.id}/review`}>Review</Link>
                            </Button>
                            <Button size="sm" className="h-7 px-2 bg-green-500 hover:bg-green-600 text-xs rounded-lg" onClick={() => handleApprove("Kegiatan", a.id)}>
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button size="sm" variant="destructive" className="h-7 px-2 text-xs rounded-lg" onClick={() => handleReject("Kegiatan", a.id)}>
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Laporan Pending */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                      <FileText className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Laporan Pending</p>
                      <p className="text-xs text-slate-400">Menunggu validasi admin</p>
                    </div>
                  </div>
                  <Link href="/admin/reports" className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1">
                    Lihat Semua <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
                <div className="p-4">
                  {pendingReports.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">Tidak ada laporan pending</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {pendingReports.slice(0, 3).map((r) => (
                        <div key={r.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border-l-4 border-l-green-400">
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-sm text-slate-800 truncate">{r.activity?.title || "Kegiatan"}</p>
                            <p className="text-xs text-slate-400">{r.community?.name} • {formatDate(r.created_at)}</p>
                          </div>
                          <Link href="/admin/reports" className="text-xs font-semibold text-teal-600 hover:text-teal-700 shrink-0">
                            Review →
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Verifikasi Pengguna */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                      <UserCheck className="h-4 w-4 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Verifikasi Pengguna</p>
                      <p className="text-xs text-slate-400">Data diri perlu diverifikasi</p>
                    </div>
                  </div>
                  <Link href="/admin/users" className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1">
                    Lihat Semua <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
                <div className="p-4 flex flex-col items-center justify-center py-8">
                  <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-3">
                    <span className="text-3xl font-black text-purple-600">{pendingVolunteers}</span>
                  </div>
                  <p className="text-sm text-slate-500 text-center">pengguna menunggu verifikasi data diri</p>
                  {pendingVolunteers > 0 && (
                    <Link href="/admin/users" className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-colors">
                      Verifikasi Sekarang
                    </Link>
                  )}
                </div>
              </div>

            </div>
          )}
        </main>
    </>
  );
}
