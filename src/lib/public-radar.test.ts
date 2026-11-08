import { describe, expect, it } from 'vitest';
import { countInRange, entropyBits, exposureLevel, parseXonBreaches, splitHash } from './public-radar';

describe('Rastro Vazado', () => {
  it('sends only the first five SHA-1 characters to the range endpoint', () => {
    expect(splitHash('5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8')).toEqual({
      prefix: '5BAA6',
      suffix: '1E4C9B93F3F0682250B6CF8331B7EE68FD8',
    });
  });

  it('matches a suffix and reads the exposure count', () => {
    const body = 'AAA:3\r\n1E4C9B93F3F0682250B6CF8331B7EE68FD8:9545824';
    expect(countInRange(body, '1e4c9b93f3f0682250b6cf8331b7ee68fd8')).toBe(9545824);
    expect(countInRange(body, 'BBBB')).toBe(0);
  });

  it('classifies exposure bands and estimates entropy', () => {
    expect(exposureLevel(0)).toBe('limpa');
    expect(exposureLevel(5)).toBe('baixa');
    expect(exposureLevel(100)).toBe('alta');
    expect(exposureLevel(1000)).toBe('critica');
    expect(entropyBits('abc')).toBeGreaterThan(0);
  });

  it('normalizes breach data and sorts newest first', () => {
    const data = parseXonBreaches({ ExposedBreaches: { breaches_details: [
      { breach: 'Older', xposed_date: '2019', xposed_data: 'Email addresses;Passwords' },
      { breach: 'Newer', xposed_date: '2021' },
    ] } });
    expect(data.map(item => item.name)).toEqual(['Newer', 'Older']);
    expect(data[1].data).toEqual(['Email addresses', 'Passwords']);
    expect(parseXonBreaches({ Error: 'Not found' })).toEqual([]);
  });
});