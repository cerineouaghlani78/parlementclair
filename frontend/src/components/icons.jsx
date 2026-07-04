// Icônes SVG reprises du prototype (paths verbatim).
const Svg = ({ size = 16, fill = 'currentColor', children, style }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill={fill} style={style}>
    {children}
  </svg>
)

export const ChatBubbleIcon = (p) => (
  <Svg {...p}>
    <path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-4 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
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

export const TrashIcon = (p) => (
  <Svg {...p}>
    <path d="M9 3h6a1 1 0 0 1 1 1v1h5v2h-1.055l-1.06 13.777A2 2 0 0 1 15.891 22H8.109a2 2 0 0 1-1.994-1.223L5.055 7H4V5h5V4a1 1 0 0 1 1-1zm-1.943 4L8.1 20h7.8l1.043-13H7.057zM10 9h2v9h-2V9zm4 0h2v9h-2V9z" />
  </Svg>
)
