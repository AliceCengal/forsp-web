export function renderDate(isoDate: any) {
  return new Date(Date.parse(isoDate as string)).toLocaleDateString();
}

export function nows36(): string {
  return Date.now().toString(36);
}

export function parse_s36_date(s: string) {
  return new Date(Number.parseInt(s, 36));
}
