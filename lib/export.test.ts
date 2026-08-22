import { afterEach, describe, expect, it, vi } from 'vitest';
import { exportRowsToCsv } from './export';

class FakeBlob {
  constructor(public content: string[]) {}
}

describe('exportRowsToCsv', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('returns false for empty rows', () => {
    expect(exportRowsToCsv('empty.csv', [])).toBe(false);
  });

  it('escapes delimiters, quotes, and newlines', () => {
    vi.stubGlobal('Blob', FakeBlob);
    const createObjectUrl = vi.fn(() => 'blob:csv');
    URL.createObjectURL = createObjectUrl;
    URL.revokeObjectURL = vi.fn();
    const append = vi.fn();
    const remove = vi.fn();
    const link = { href: '', download: '', click: remove };
    Object.defineProperty(document, 'createElement', {
      value: vi.fn(() => ({ ...link, click: remove })),
      configurable: true,
    });
    document.body.appendChild = append as unknown as typeof document.body.appendChild;

    expect(exportRowsToCsv('items.csv', [{ name: 'Paracetamol', note: 'Keep "cool",\naway' }])).toBe(true);
    expect(createObjectUrl).toHaveBeenCalledTimes(1);
  });
});
