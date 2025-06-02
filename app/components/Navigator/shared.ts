// Centralized navigation logic for tabbed navigation and swipe gestures

export const tabRoutes = ["/", "/jam", "/bands", "/profile"];

export function getActiveTab(pathname: string): number {
  if (pathname === "/" || pathname.startsWith("/radio")) return 0;
  if (pathname.startsWith("/jam")) return 1;
  if (pathname.startsWith("/bands")) return 2;
  if (pathname.startsWith("/profile")) return 3;
  return -1;
}

export function getNextTab(currentTab: number): number {
  return currentTab < tabRoutes.length - 1 ? currentTab + 1 : currentTab;
}

export function getPrevTab(currentTab: number): number {
  return currentTab > 0 ? currentTab - 1 : currentTab;
}

export function getTabRoute(tabIndex: number): string {
  return tabRoutes[tabIndex] || "/";
}
