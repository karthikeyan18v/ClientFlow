export default function StatCard({
  label,
  value,
  icon,
  gradient = "linear-gradient(135deg, #4f46e5, #7c3aed)",
}: {
  label: string;
  value: number | string;
  icon: string;
  gradient?: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: gradient }}>
        {icon}
      </div>
      <div>
        <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-slate-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
}
