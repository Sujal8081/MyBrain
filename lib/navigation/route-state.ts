export type NavigationSection = "home" | "tasks" | "chat" | "notes" | "more";

export function getActiveNavigationSection(
  pathname: string,
): NavigationSection | null {
  if (pathname === "/protected") return "home";
  if (pathname === "/protected/tasks" || pathname.startsWith("/protected/tasks/")) {
    return "tasks";
  }
  if (pathname === "/protected/chat" || pathname.startsWith("/protected/chat/")) {
    return "chat";
  }
  if (
    pathname === "/protected/notes" ||
    pathname.startsWith("/protected/notes/") ||
    pathname === "/protected/documents" ||
    pathname.startsWith("/protected/documents/") ||
    pathname === "/protected/voice-notes" ||
    pathname.startsWith("/protected/voice-notes/")
  ) {
    return "notes";
  }
  if (
    pathname === "/protected/more" ||
    pathname.startsWith("/protected/more/") ||
    pathname === "/protected/reminders" ||
    pathname.startsWith("/protected/reminders/") ||
    pathname === "/protected/account" ||
    pathname.startsWith("/protected/account/")
  ) {
    return "more";
  }

  return null;
}
