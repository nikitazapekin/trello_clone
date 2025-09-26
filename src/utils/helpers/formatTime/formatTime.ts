export function formatTime(dateTimeString: string, locale: string = "ru-RU"): string {
  try {
    const date = new Date(dateTimeString);

    if (isNaN(date.getTime())) return "";

    return new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  } catch {
    return "None";
  }
}
