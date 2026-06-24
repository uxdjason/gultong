import { describe, it, expect } from 'vitest';
import { calculateWritability, calculateTotalScore, assignBadge } from './scorer';

describe('Keyword Scorer', () => {
  it('calculateWritability: sweet spot search volume', () => {
    // 20000 -> 40 points
    // 낮음 -> 30 points
    // 상승 -> 15 points
    // transactional -> 15 points
    // Total = 100
    const score = calculateWritability({
      searchVolume: 20000,
      competition: '낮음',
      trendDirection: '상승',
      trendScore: 80,
      intent: 'transactional'
    });
    expect(score).toBe(100);
  });

  it('calculateWritability: low search volume, high competition', () => {
    // 500 -> 0 points
    // 높음 -> 5 points
    // 하락 -> 0 points
    // info -> 6 points
    // Total = 11
    const score = calculateWritability({
      searchVolume: 500,
      competition: '높음',
      trendDirection: '하락',
      trendScore: 20,
      intent: 'info'
    });
    expect(score).toBe(11);
  });

  it('calculateTotalScore: weighting', () => {
    // w: 80, t: 80, c: 50
    // 80*0.6 + 80*0.25 + (100-50)*0.15 = 48 + 20 + 7.5 = 75.5 -> 76
    const score = calculateTotalScore(80, 80, 50);
    expect(score).toBe(76);
  });

  it('assignBadge: Blue Ocean priority', () => {
    const badge = assignBadge({
      searchVolume: 6000,
      competition: '낮음',
      trendDirection: '상승',
      trendScore: 90,
      isSeasonal: true
    });
    expect(badge).toBe('블루오션'); // 낮음 + >=5000
  });

  it('assignBadge: Rising', () => {
    const badge = assignBadge({
      searchVolume: 4000,
      competition: '보통',
      trendDirection: '상승',
      trendScore: 85
    });
    expect(badge).toBe('급상승');
  });

  it('assignBadge: Seasonal', () => {
    const badge = assignBadge({
      searchVolume: 4000,
      competition: '보통',
      trendDirection: '하락',
      trendScore: 65,
      isSeasonal: true
    });
    expect(badge).toBe('계절성');
  });
});
