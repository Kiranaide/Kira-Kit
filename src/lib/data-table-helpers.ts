// ============================================
// EXPORT UTILITIES
// ============================================

function formatHeader(key: string): string {
  return key
    .replace(/[_-]/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();
}

/**
 * Export data to CSV format
 */
export function exportToCSV<TData extends Record<string, unknown>>(
  data: TData[],
  columns: string[],
  filename: string = "export.csv",
): void {
  if (data.length === 0) return;

  const headers = columns.map(formatHeader);

  const rows = data.map((row) =>
    columns.map((col) => {
      const value = row[col];

      if (value === null || value === undefined) return "";

      const text = String(value);

      if (/[",\r\n]/.test(text)) {
        return `"${text.replace(/"/g, '""')}"`;
      }

      return text;
    }),
  );

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join(
    "\n",
  );

  downloadFile(csvContent, filename, "text/csv");
}

/**
 * Export data to JSON format
 */
export function exportToJSON<TData>(
  data: TData[],
  filename: string = "export.json",
): void {
  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, filename, "application/json");
}

/**
 * Download a file
 */
function downloadFile(
  content: string,
  filename: string,
  mimeType: string,
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
