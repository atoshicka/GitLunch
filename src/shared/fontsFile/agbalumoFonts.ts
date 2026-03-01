export const AgbalumoFonts = {
  agbalumoRegular: 'Agbalumo-Regular',
} as const;

export const AgbalumoTypography = {
  agbalumoLarge: {
    fontFamily: AgbalumoFonts.agbalumoRegular,
    fontSize: 48,
    lineHeight: 56,
  },
  agbalumoMedium: {
    fontFamily: AgbalumoFonts.agbalumoRegular,
    fontSize: 36,
    lineHeight: 44,
  },
  agbalumoSmall: {
    fontFamily: AgbalumoFonts.agbalumoRegular,
    fontSize: 24,
    lineHeight: 32,
  },
} as const;
