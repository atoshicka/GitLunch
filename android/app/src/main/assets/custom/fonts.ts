export const Fonts = {
  robotoRegular: 'Roboto-Regular',
  robotoMedium: 'Roboto-Medium',
  robotoBold: 'Roboto-Bold',
  system: 'System',
  sansSerif: 'sans-serif',
} as const;

export type FontsType = keyof typeof Fonts;

export const Typography = {
  decorativeLarge: {
    fontFamily: Fonts.robotoBold,
    fontSize: 36,
    lineHeight: 44,
  },
  decorativeMedium: {
    fontFamily: Fonts.robotoBold,
    fontSize: 28,
    lineHeight: 36,
  },
  decorativeSmall: {
    fontFamily: Fonts.robotoMedium,
    fontSize: 22,
    lineHeight: 28,
  },
  titleLarge: {
    fontFamily: Fonts.robotoBold,
    fontSize: 32,
    lineHeight: 40,
  },
  titleMedium: {
    fontFamily: Fonts.robotoBold,
    fontSize: 24,
    lineHeight: 32,
  },
  titleSmall: {
    fontFamily: Fonts.robotoMedium,
    fontSize: 20,
    lineHeight: 28,
  },
  bodyLarge: {
    fontFamily: Fonts.robotoRegular,
    fontSize: 18,
    lineHeight: 24,
  },
  bodyRegular: {
    fontFamily: Fonts.robotoRegular,
    fontSize: 16,
    lineHeight: 22,
  },
  bodySmall: {
    fontFamily: Fonts.robotoRegular,
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontFamily: Fonts.robotoRegular,
    fontSize: 12,
    lineHeight: 16,
  },
  buttonLarge: {
    fontFamily: Fonts.robotoMedium,
    fontSize: 18,
    lineHeight: 24,
  },
  buttonRegular: {
    fontFamily: Fonts.robotoMedium,
    fontSize: 16,
    lineHeight: 22,
  },
  buttonSmall: {
    fontFamily: Fonts.robotoMedium,
    fontSize: 14,
    lineHeight: 18,
  },
  label: {
    fontFamily: Fonts.robotoMedium,
    fontSize: 14,
    lineHeight: 20,
  },
} as const;

export type TypographyType = keyof typeof Typography;

export const createTextStyle = (font: FontsType, fontSize: number, lineHeight?: number) => ({
  fontFamily: Fonts[font],
  fontSize,
  lineHeight: lineHeight || fontSize * 1.5,
});
