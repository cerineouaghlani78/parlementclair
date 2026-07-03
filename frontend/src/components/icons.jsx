// Icônes SVG reprises du prototype (paths verbatim).
const Svg = ({ size = 16, fill = 'currentColor', children, style }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill={fill} style={style}>
    {children}
  </svg>
)

export const StarIcon = (p) => (
  <Svg {...p}>
    <path d="M12 1l2.928 6.32L22 9.113l-5.5 4.677L18.32 21 12 17.5 5.68 21l1.82-7.21L2 9.112l7.072-1.792z" />
  </Svg>
)

export const PlusIcon = (p) => (
  <Svg {...p}>
    <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z" />
  </Svg>
)

export const SearchIcon = (p) => (
  <Svg {...p}>
    <path d="M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z" />
  </Svg>
)

export const ExternalIcon = (p) => (
  <Svg {...p}>
    <path d="M10 6v2H5v11h11v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6zm11-3v8h-2V6.413l-7.793 7.794-1.414-1.414L17.585 5H13V3h8z" />
  </Svg>
)

export const DocLinkIcon = (p) => (
  <Svg {...p}>
    <path d="M10 3v2H5v14h14v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h6zm7.586 2H14V3h7v7h-2V6.414l-7.793 7.793-1.414-1.414L17.586 5z" />
  </Svg>
)

export const CheckIcon = (p) => (
  <Svg {...p}>
    <path d="M9.998 15.171l7.071-7.07 1.414 1.414-8.485 8.485L4.646 12.66l1.415-1.414z" />
  </Svg>
)

export const GlobeIcon = (p) => (
  <Svg {...p}>
    <path d="M12 3c5.392 0 9.878 3.88 10.819 9-.94 5.12-5.427 9-10.819 9-5.392 0-9.878-3.88-10.819-9C2.121 6.88 6.608 3 12 3zm0 16a9.005 9.005 0 0 0 8.777-7 9.005 9.005 0 0 0-17.554 0A9.005 9.005 0 0 0 12 19zm0-2.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9zm0-2a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
  </Svg>
)

export const SendIcon = (p) => (
  <Svg {...p}>
    <path d="M13 7.828V20h-2V7.828l-5.364 5.364-1.414-1.414L12 4l7.778 7.778-1.414 1.414z" />
  </Svg>
)

export const StopIcon = (p) => (
  <Svg {...p}>
    <rect x="6" y="6" width="12" height="12" rx="2" />
  </Svg>
)

export const ChevronDownIcon = (p) => (
  <Svg {...p}>
    <path d="M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z" />
  </Svg>
)

export const DocIcon = (p) => (
  <Svg {...p}>
    <path d="M20 22H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1zm-1-2V4H5v16h14zM8 7h8v2H8V7zm0 4h8v2H8v-2zm0 4h5v2H8v-2z" />
  </Svg>
)
