const INDIA_TIME_ZONE = "Asia/Kolkata";

type DateInput = Date | string | number;

const adminDateTimeFormatter = new Intl.DateTimeFormat("en-IN", {
  timeZone: INDIA_TIME_ZONE,
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
  timeZoneName: "short",
});

const adminDateFormatter = new Intl.DateTimeFormat("en-IN", {
  timeZone: INDIA_TIME_ZONE,
  dateStyle: "medium",
});

const adminShortDateTimeFormatter = new Intl.DateTimeFormat("en-IN", {
  timeZone: INDIA_TIME_ZONE,
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

export function formatAdminDateTime(value: DateInput): string {
  return adminDateTimeFormatter.format(new Date(value));
}

export function formatAdminDate(value: DateInput): string {
  return adminDateFormatter.format(new Date(value));
}

export function formatAdminShortDateTime(value: DateInput): string {
  return adminShortDateTimeFormatter.format(new Date(value));
}
