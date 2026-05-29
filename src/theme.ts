export type Theme = {
  background: string;
  text: string;
  questionText: string;
  accent: string;
  border: string;
  menuItemBackground: string;
};

export const lightTheme: Theme = {
  background: '#FBF9F4',
  text: '#1C1B19',
  questionText: '#6B6456',
  accent: '#8A6D3B',
  border: '#E6E0D4',
  menuItemBackground: '#FFFFFF',
};

export const darkTheme: Theme = {
  background: '#121212',
  text: '#ECE6DA',
  questionText: '#A39B89',
  accent: '#C9A86A',
  border: '#2A2A2A',
  menuItemBackground: '#1C1C1C',
};

export const getTheme = (scheme: string | null | undefined): Theme =>
  scheme === 'dark' ? darkTheme : lightTheme;
