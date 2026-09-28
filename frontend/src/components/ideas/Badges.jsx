import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { PRIORITY_META, STATUS_META } from "../../models/idea";

export function StatusBadge({ status }) {
  return (
    <span className={`badge badge--status badge--${status}`}>
      <span className="badge__dot" aria-hidden />
      {STATUS_META[status].label}
    </span>
  );
}

const PLATFORM_CLASS = { TikTok: "tiktok", Instagram: "instagram", YouTube: "youtube", LinkedIn: "linkedin" };

export function PlatformBadge({ platform }) {
  return (
    <span className="platform">
      <span className={`platform__dot platform__dot--${PLATFORM_CLASS[platform] ?? "other"}`} aria-hidden />
      {platform}
    </span>
  );
}

const PRIORITY_ICON = { low: ArrowDown, medium: Minus, high: ArrowUp };

export function PriorityBadge({ priority }) {
  const Icon = PRIORITY_ICON[priority];
  return (
    <span className={`priority priority--${priority}`}>
      <Icon size={13} aria-hidden />
      {PRIORITY_META[priority].label}
    </span>
  );
}
