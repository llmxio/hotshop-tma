import { AppRoot } from "@telegram-apps/telegram-ui";

export default function Layout({ children }: { children: React.ReactNode }) {
  const isDark = false;
  return (
    <AppRoot appearance={isDark ? "dark" : "light"} platform="base">
      {children}
    </AppRoot>
  );
}
