import type { ReactNode } from "react";

// Minimal line icons (24px grid, stroke = currentColor), in the style of the app's UI.
function Svg({ size = 24, children, fill = "none" }: { size?: number; children: ReactNode; fill?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  );
}

type P = { size?: number };

export const Icon = {
  Feed: ({ size }: P) => (
    <Svg size={size}>
      <rect x="3" y="4" width="15" height="16" rx="1.5" />
      <path d="M18 8h2.5v10.5A1.5 1.5 0 0 1 19 20h-1" />
      <rect x="6" y="7" width="4" height="4" />
      <path d="M12.5 7.5H15M12.5 10.5H15M6 14h9M6 17h9" />
    </Svg>
  ),
  List: ({ size }: P) => (
    <Svg size={size}>
      <path d="M9 6h12M9 12h12M9 18h12" />
      <circle cx="4.5" cy="6" r="1" /><circle cx="4.5" cy="12" r="1" /><circle cx="4.5" cy="18" r="1" />
    </Svg>
  ),
  Plus: ({ size }: P) => <Svg size={size}><path d="M12 5v14M5 12h14" /></Svg>,
  Trophy: ({ size }: P) => (
    <Svg size={size}>
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
      <path d="M7 6H4.5a2.5 2.5 0 0 0 2.6 3.2M17 6h2.5a2.5 2.5 0 0 1-2.6 3.2M12 14v4M8 21h8M9.5 18h5" />
    </Svg>
  ),
  Search: ({ size }: P) => <Svg size={size}><circle cx="10.5" cy="10.5" r="6.5" /><path d="m20 20-4.8-4.8" /></Svg>,
  Heart: ({ size, filled }: P & { filled?: boolean }) => (
    <Svg size={size} fill={filled ? "currentColor" : "none"}>
      <path d="M12 20s-7.5-4.5-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.5-7.5 10-7.5 10Z" />
    </Svg>
  ),
  Comment: ({ size }: P) => <Svg size={size}><path d="M20 11.5a8 8 0 0 1-11.7 7.1L4 20l1.4-4.1A8 8 0 1 1 20 11.5Z" /></Svg>,
  Send: ({ size }: P) => <Svg size={size}><path d="M21 3 10 14M21 3l-7 18-4-7-7-4 18-7Z" /></Svg>,
  PlusCircle: ({ size }: P) => <Svg size={size}><circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" /></Svg>,
  Bookmark: ({ size, filled }: P & { filled?: boolean }) => (
    <Svg size={size} fill={filled ? "currentColor" : "none"}><path d="M6 3.5h12V21l-6-4.5L6 21V3.5Z" /></Svg>
  ),
  Calendar: ({ size }: P) => (
    <Svg size={size}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
      <path d="M7.5 13h.01M10.5 13h.01M13.5 13h.01M16.5 13h.01M7.5 16.5h.01M10.5 16.5h.01M13.5 16.5h.01" strokeWidth={2.4} />
    </Svg>
  ),
  Bell: ({ size }: P) => <Svg size={size}><path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16ZM10 20.5a2.2 2.2 0 0 0 4 0" /></Svg>,
  Menu: ({ size }: P) => <Svg size={size}><path d="M4 7h16M4 12h16M4 17h16" /></Svg>,
  Check: ({ size }: P) => <Svg size={size}><path d="m5 12.5 4.5 4.5L19 7.5" /></Svg>,
  CheckCircle: ({ size }: P) => <Svg size={size}><circle cx="12" cy="12" r="9" /><path d="m8 12.3 2.8 2.8L16.2 9.5" /></Svg>,
  Fork: ({ size = 14 }: P) => <Svg size={size}><path d="M7 3v7M5 3v5a2 2 0 0 0 4 0V3M7 10v11M17 3c-2 1.5-2.5 4-2.5 7h2.5v11" /></Svg>,
  Repeat: ({ size = 16 }: P) => <Svg size={size}><path d="M17 3l3 3-3 3M4 11V9a3 3 0 0 1 3-3h13M7 21l-3-3 3-3M20 13v2a3 3 0 0 1-3 3H4" /></Svg>,
  Navigate: ({ size = 18 }: P) => <Svg size={size} fill="currentColor"><path d="M21 3 3 10.5l7.5 3 3 7.5L21 3Z" /></Svg>,
  Bag: ({ size = 18 }: P) => <Svg size={size} fill="currentColor"><path d="M5 8h14l-1 13H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" fill="none" /></Svg>,
  Trend: ({ size = 18 }: P) => <Svg size={size}><path d="m3 17 6-6 4 4 8-8M15 7h6v6" /></Svg>,
  Chevron: ({ size = 20 }: P) => <Svg size={size}><path d="m9 5 7 7-7 7" /></Svg>,
  Back: ({ size = 26 }: P) => <Svg size={size}><path d="m15 5-7 7 7 7" /></Svg>,
  Dots: ({ size }: P) => <Svg size={size} fill="currentColor"><circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" /></Svg>,
  Caret: ({ size = 14 }: P) => <Svg size={size} fill="currentColor"><path d="M6 9h12l-6 7-6-7Z" /></Svg>,
  Flame: ({ size = 26 }: P) => <Svg size={size} fill="currentColor"><path d="M12 2.5c1 3.5 5.5 6 5.5 11a5.5 5.5 0 0 1-11 0c0-2.5 1.2-4 2.5-5.3.2 1.8 1 3 2.2 3.3C10.3 8.5 11 5.5 12 2.5Z" /></Svg>,
  Bars: ({ size = 20 }: P) => <Svg size={size}><path d="M5 20V10M10 20V4M15 20v-7M20 20V8" /></Svg>,
  Grid: ({ size = 20 }: P) => <Svg size={size}><rect x="4" y="4" width="7" height="7" rx="1" /><rect x="13" y="4" width="7" height="7" rx="1" /><rect x="4" y="13" width="7" height="7" rx="1" /><rect x="13" y="13" width="7" height="7" rx="1" /></Svg>,
  Sparkle: ({ size = 30 }: P) => <Svg size={size}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" /></Svg>,
  Users: ({ size = 30 }: P) => <Svg size={size}><circle cx="8.5" cy="8" r="3.5" /><circle cx="16.5" cy="8" r="3.5" /><path d="M2.5 20a6 6 0 0 1 12 0M12.5 14.5a6 6 0 0 1 9 5.5" /></Svg>,
  Target: ({ size = 30 }: P) => <Svg size={size}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.2" fill="currentColor" /></Svg>,
  Compass: ({ size = 30 }: P) => <Svg size={size}><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" /></Svg>,
  Info: ({ size = 30 }: P) => <Svg size={size}><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7.5h.01" strokeWidth={2.2} /></Svg>,
};
