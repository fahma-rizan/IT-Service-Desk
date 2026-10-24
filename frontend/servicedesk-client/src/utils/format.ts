// "InProgress" -> "In Progress", "ServiceRequest" -> "Service Request"
export function labelize(value: string): string {
  return value.replace(/([a-z])([A-Z])/g, '$1 $2')
}

// The API sends UTC times; add a "Z" if the server left it off so the browser
// converts them to your local time correctly.
export function formatDate(iso: string): string {
  const hasZone = /Z$|[+-]\d{2}:\d{2}$/.test(iso)
  return new Date(hasZone ? iso : `${iso}Z`).toLocaleString()
}