import type { ReactNode } from "react";
import { Icon } from "./icons";

export function ProfileBar({ title, onBack, right }: { title: string; onBack?: () => void; right?: ReactNode }) {
  return (
    <div className="profile-bar">
      {onBack && <button onClick={onBack} aria-label="Back"><Icon.Back size={30} /></button>}
      <h2 className="profile-bar-title">{title}</h2>
      <span className="profile-bar-right">{right}</span>
    </div>
  );
}

export function CountRow({ icon, label, count, onClick }: { icon: ReactNode; label: string; count: number | string; onClick?: () => void }) {
  return (
    <button className="count-row" onClick={onClick}>
      <span className="count-row-icon">{icon}</span>
      <span className="grow">{label}</span>
      <strong>{count}</strong>
      <span className="muted"><Icon.Chevron /></span>
    </button>
  );
}

export function StatCard({ icon, label, value }: { icon: ReactNode; label: string; value: ReactNode }) {
  return (
    <div className="stat-card">
      <span className="stat-card-icon">{icon}</span>
      <span>
        <span className="muted block">{label}</span>
        <strong className="stat-card-value">{value}</strong>
      </span>
    </div>
  );
}

export function ProfileTabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: { id: T; label: string; icon: ReactNode }[];
  value: T;
  onChange: (t: T) => void;
}) {
  return (
    <div className="profile-tabs" role="tablist">
      {tabs.map((t) => (
        <button key={t.id} role="tab" aria-selected={value === t.id} className={value === t.id ? "on" : ""} onClick={() => onChange(t.id)}>
          {t.icon}
          {t.label}
        </button>
      ))}
    </div>
  );
}
