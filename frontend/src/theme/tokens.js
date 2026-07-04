// DSFR (gouv.fr) design tokens extracted from the ParlementClair hi-fi prototype.
export const dsfr = {
  // Bleu France + variants
  primary: '#000091',
  primaryHover: '#1212ff',
  primaryDisabled: '#c5c5f0',
  // Rouge Marianne
  error: '#ce0500',
  errorBg: '#fdeceb',
  errorBorder: '#f3c4c0',
  // Success (green)
  success: '#18753c',
  successBg: '#eafaef',
  successBorder: '#b8e6c6',
  // Text
  text: '#161616',
  textStrong: '#161616',
  textSecondary: '#3a3a3a',
  textMuted: '#666',
  grey: '#929292',
  // Surfaces
  white: '#fff',
  sidebar: '#f6f6f6',
  tool: '#f6f6f6',
  userBubble: '#f0f0f7',
  // Accents (mauve)
  accentBg: '#e3e3fd',
  accentHover: '#f5f5fe',
  accentHover2: '#ececf6',
  accentActive: '#e6e6f5',
  // Borders
  border: '#e5e5e5',
  borderLight: '#eaeaea',
  borderLighter: '#eee',
  borderInput: '#d5d5d5',
  // Neutral (abstention)
  neutralBg: '#f2f2f2',
  neutralBorder: '#ddd',
}

export const fontFamily = 'Marianne, Arial, sans-serif'

// Ant Design theme mapped onto DSFR tokens.
export const antdTheme = {
  token: {
    colorPrimary: dsfr.primary,
    colorError: dsfr.error,
    colorSuccess: dsfr.success,
    colorText: dsfr.text,
    colorLink: dsfr.primary,
    fontFamily,
    borderRadius: 8,
    colorBorder: dsfr.border,
  },
  components: {
    Button: {
      primaryColor: '#fff',
      colorPrimaryHover: dsfr.primaryHover,
      borderRadius: 8,
      fontWeight: 500,
    },
    Layout: {
      siderBg: dsfr.sidebar,
      headerBg: dsfr.white,
      bodyBg: dsfr.white,
    },
    Tag: {
      borderRadiusSM: 4,
    },
  },
}
