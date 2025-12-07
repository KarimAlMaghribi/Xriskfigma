import React, { PropsWithChildren, createContext, useContext, forwardRef } from 'react';
import createCache from '@emotion/cache';

// Minimal cache context to satisfy MUI's runtime requirements
const EmotionCacheContext = createContext(createCache({ key: 'css' }));
export const CacheProvider = ({ value, children }: PropsWithChildren<{ value?: ReturnType<typeof createCache> }>) => {
  const cache = value || createCache({ key: 'css' });
  return <EmotionCacheContext.Provider value={cache}>{children}</EmotionCacheContext.Provider>;
};

export const ThemeContext = createContext<any>({});
export const ThemeProvider = ({ theme, children }: PropsWithChildren<{ theme: any }>) => (
  <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
);
export const useTheme = () => useContext(ThemeContext);

export const withEmotionCache = <P extends object>(
  Component: React.ComponentType<P & { cache: ReturnType<typeof createCache> }>,
) =>
  forwardRef<any, P>((props, ref) => {
    const cache = useContext(EmotionCacheContext);
    return <Component {...props} cache={cache} ref={ref} />;
  });

export const Fragment = React.Fragment;
export const jsx = (type: any, props: any, key?: any) => React.createElement(type, { ...props, key });
export const jsxs = jsx;
export const jsxDEV = jsx;
export const createElement = React.createElement;

export const css = (...args: any[]) => args;
export const keyframes = (...args: any[]) => args;
export const Global = (_props: { styles: any }) => null;
export const ClassNames = ({
  children,
}: {
  children: (helpers: { css: typeof css; cx: (...values: any[]) => string; theme: any }) => React.ReactNode;
}) => children({
  css,
  cx: (...values: any[]) => values.filter(Boolean).join(' '),
  theme: useTheme(),
});
