import * as React from "react";
import { TaskStatus, Priority } from "@prisma/client";

export function StatusIcon({
  status,
  className = "w-4 h-4",
}: {
  status: TaskStatus;
  className?: string;
}) {
  switch (status) {
    case "BACKLOG":
      return (
        <svg
          className={`${className} text-neutral-500`}
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="2 2"
        >
          <circle cx="8" cy="8" r="6" />
        </svg>
      );
    case "TODO":
      return (
        <svg
          className={`${className} text-neutral-400`}
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="8" cy="8" r="6" />
        </svg>
      );
    case "IN_PROGRESS":
      return (
        <svg
          className={`${className} text-amber-400`}
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="8" cy="8" r="6" />
          <path
            d="M8 2 A6 6 0 0 1 8 14 Z"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      );
    case "IN_REVIEW":
      return (
        <svg
          className={`${className} text-indigo-400`}
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="8" cy="8" r="6" />
          <path
            d="M8 2 A6 6 0 1 1 2 8 L8 8 Z"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      );
    case "DONE":
      return (
        <svg
          className={`${className} text-emerald-400`}
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm3.354-9.646a.5.5 0 0 0-.708 0L7 8.94 5.354 7.293a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l4-4a.5.5 0 0 0 0-.708z"
          />
        </svg>
      );
    default:
      return null;
  }
}

export function PriorityIcon({
  priority,
  className = "w-4 h-4",
}: {
  priority: Priority;
  className?: string;
}) {
  switch (priority) {
    case "URGENT":
      return (
        <svg
          className={`${className} text-rose-500`}
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <rect x="2" y="2" width="12" height="12" rx="2" fill="currentColor" fillOpacity="0.15" />
          <path d="M8 4.5v4M8 10.5h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "HIGH":
      return (
        <svg
          className={`${className} text-amber-400`}
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <rect x="2" y="9" width="3" height="5" rx="0.5" />
          <rect x="6.5" y="6" width="3" height="8" rx="0.5" />
          <rect x="11" y="3" width="3" height="11" rx="0.5" />
        </svg>
      );
    case "MEDIUM":
      return (
        <svg
          className={`${className} text-indigo-400`}
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <rect x="2" y="9" width="3" height="5" rx="0.5" />
          <rect x="6.5" y="6" width="3" height="8" rx="0.5" />
          <rect x="11" y="3" width="3" height="11" rx="0.5" fillOpacity="0.2" />
        </svg>
      );
    case "LOW":
      return (
        <svg
          className={`${className} text-neutral-400`}
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <rect x="2" y="9" width="3" height="5" rx="0.5" />
          <rect x="6.5" y="6" width="3" height="8" rx="0.5" fillOpacity="0.2" />
          <rect x="11" y="3" width="3" height="11" rx="0.5" fillOpacity="0.2" />
        </svg>
      );
    default:
      return null;
  }
}
