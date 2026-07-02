export const THEME = {
  colors: {
    background: '#0B0B0C',       // Slate/carbon black
    cardBackground: '#131315',   // Rich dark grey
    cardBackgroundHover: '#18181B',
    border: '#212124',           // Super subtle grey border
    borderMuted: '#1A1A1C',
    textPrimary: '#F4F4F6',      // Off-white / paper white
    textSecondary: '#9A9A9E',    // Soft grey
    textMuted: '#626266',        // Muted grey for sub-details
    accent: '#D4AF37',           // Antique gold highlight
    accentMuted: '#A38A3F',      // Antique gold muted
    accentLight: '#E8D082',      // Bright gold
    success: '#30D5C8',          // Turquoise/teal accent
    error: '#FF453A',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    // Elegant serif styling
    headingSerif: {
      fontFamily: 'System', // Will use standard system font, styled to look premium
      fontWeight: '700' as const,
    },
    // Modern sans-serif
    bodySans: {
      fontFamily: 'System',
      fontWeight: '400' as const,
    },
    boldSans: {
      fontFamily: 'System',
      fontWeight: '600' as const,
    }
  }
};
