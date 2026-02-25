import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  :root {
    --color-primary: #2d4a2d;
    --color-primary-dark: #1a2e1a;
    --color-primary-light: rgba(45, 74, 45, 0.08);
    --color-accent: #2d4a2d;
    --color-accent-dark: #1a2e1a;
    --color-accent-light: rgba(45, 74, 45, 0.08);
    --color-gold: #c9a84c;

    --color-bg: #f5f0e8;
    --color-bg-secondary: #ede8dc;
    --color-surface: #f5f0e8;
    --color-border: #d4c9b0;
    --color-border-dark: #c4b89a;

    --color-text: #1a2e1a;
    --color-text-muted: #5a6b4a;
    --color-text-light: #8a9a7a;

    --color-success: #2d6a2d;
    --color-danger: #8b2020;
    --color-warning: #a07020;

    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
    --spacing-2xl: 3rem;
    --spacing-3xl: 5rem;

    --radius-sm: 2px;
    --radius-md: 4px;
    --radius-lg: 8px;
    --radius-full: 999px;

    --shadow-sm: 0 1px 3px rgba(45,74,45,0.1);
    --shadow-md: 0 4px 20px rgba(45,74,45,0.12);
    --shadow-lg: 0 8px 40px rgba(45,74,45,0.16);

    --font-family: 'Inter', sans-serif;
    --font-size-xs: 0.7rem;
    --font-size-sm: 0.8rem;
    --font-size-md: 0.95rem;
    --font-size-lg: 1.1rem;
    --font-size-xl: 1.25rem;
    --font-size-2xl: 1.6rem;
    --font-size-3xl: 2.2rem;
    --font-size-4xl: 3rem;

    --transition: all 0.2s ease;
    --navbar-height: 82px;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body {
    font-family: var(--font-family);
    background-color: var(--color-bg);
    color: var(--color-text);
    line-height: 1.6;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }
  a { text-decoration: none; color: inherit; }
  img { max-width: 100%; display: block; }
  button { cursor: pointer; font-family: var(--font-family); border: none; background: none; }
  input, textarea, select { font-family: var(--font-family); }
  ul, ol { list-style: none; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #ede8dc; }
  ::-webkit-scrollbar-thumb { background: #c4b89a; border-radius: 999px; }
`;

export default GlobalStyles;