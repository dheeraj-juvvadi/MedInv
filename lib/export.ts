export function exportRowsToCsv<T extends object>(
  filename: string,
  rows: T[],
  columns?: Array<{ key: keyof T; label: string }>
) {
  if (!rows.length) return false;

  const selectedColumns = columns ?? Object.keys(rows[0]).map((key) => ({ key: key as keyof T, label: key }));
  const escapeCell = (value: unknown) => {
    if (value === null || value === undefined) return '';
    const cell = String(value).replace(/"/g, '""');
    return /[",\n]/.test(cell) ? `"${cell}"` : cell;
  };
  const csv = [
    selectedColumns.map(({ label }) => escapeCell(label)).join(','),
    ...rows.map((row) => selectedColumns.map(({ key }) => escapeCell(row[key])).join(',')),
  ].join('\n');

  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
  return true;
}
