export type Colors = {
  primary: string;
  secondary: string;
  tertiary: string;
};

const COLORS_LIGHT: Colors = {
  secondary: '#131313',
  primary: '#F5F5F5',
  tertiary: '#343434',
};

const COLORS_DARK: Colors = {
  secondary: '#F5F5F5',
  primary: '#212427',
  tertiary: '#E8E8E8',
};

enum COLOR_SCHEME {
  LIGHT = 'light',
  DARK = 'dark',
}

export const COLORS = {
  [COLOR_SCHEME.LIGHT]: COLORS_LIGHT,
  [COLOR_SCHEME.DARK]: COLORS_DARK,
};
