type CsvValue = string | number | boolean | null | undefined;

type CsvRow = Record<string, CsvValue>;

function escapeCsvCell(value: CsvValue): string {
  const raw = value == null ? "" : String(value);
  if (/[",\n\r]/.test(raw)) {
    return `"${raw.replace(/"/g, '""')}"`;
  }
  return raw;
}

export function buildCsv(rows: CsvRow[], headers?: string[]): string {
  const csvHeaders = headers ?? (rows[0] ? Object.keys(rows[0]) : []);
  const headerLine = csvHeaders.join(",");
  const lines = rows.map((row) =>
    csvHeaders.map((header) => escapeCsvCell(row[header])).join(","),
  );
  return [headerLine, ...lines].join("\n");
}

export function downloadCsv(csv: string, fileName: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}
