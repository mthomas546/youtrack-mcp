/**
 * Period Value Utility Tests
 * 
 * Tests for converting various time duration formats to YouTrack's PeriodValue format.
 */

import { 
  convertToPeriodValue, 
  isPeriodField, 
  formatPeriodValue 
} from '../../utils/period-value.js';

describe('Period Value Utility', () => {
  describe('convertToPeriodValue', () => {
    describe('minutes as integer', () => {
      it('should accept plain integer minutes', () => {
        expect(convertToPeriodValue(240)).toEqual({ minutes: 240 });
      });
      
      it('should accept zero minutes', () => {
        expect(convertToPeriodValue(0)).toEqual({ minutes: 0 });
      });
      
      it('should round decimal minutes', () => {
        expect(convertToPeriodValue(240.6)).toEqual({ minutes: 241 });
      });
      
      it('should reject negative minutes', () => {
        expect(convertToPeriodValue(-60)).toBeNull();
      });
    });
    
    describe('hours string formats', () => {
      it('should parse "4h" format', () => {
        expect(convertToPeriodValue('4h')).toEqual({ minutes: 240 });
      });
      
      it('should parse "4 hours" format', () => {
        expect(convertToPeriodValue('4 hours')).toEqual({ minutes: 240 });
      });
      
      it('should parse "4hour" format', () => {
        expect(convertToPeriodValue('4hour')).toEqual({ minutes: 240 });
      });
      
      it('should parse "4H" (case insensitive)', () => {
        expect(convertToPeriodValue('4H')).toEqual({ minutes: 240 });
      });
      
      it('should handle decimal hours', () => {
        expect(convertToPeriodValue('1.5h')).toEqual({ minutes: 90 });
      });
    });
    
    describe('days string formats', () => {
      it('should parse "2d" format (1 day = 8 hours)', () => {
        expect(convertToPeriodValue('2d')).toEqual({ minutes: 960 });
      });
      
      it('should parse "2 days" format', () => {
        expect(convertToPeriodValue('2 days')).toEqual({ minutes: 960 });
      });
      
      it('should parse "1day" format', () => {
        expect(convertToPeriodValue('1day')).toEqual({ minutes: 480 });
      });
    });
    
    describe('weeks string formats', () => {
      it('should parse "1w" format (1 week = 5 days = 40 hours)', () => {
        expect(convertToPeriodValue('1w')).toEqual({ minutes: 2400 });
      });
      
      it('should parse "1 week" format', () => {
        expect(convertToPeriodValue('1 week')).toEqual({ minutes: 2400 });
      });
    });
    
    describe('minutes string formats', () => {
      it('should parse "30m" format', () => {
        expect(convertToPeriodValue('30m')).toEqual({ minutes: 30 });
      });
      
      it('should parse "30 minutes" format', () => {
        expect(convertToPeriodValue('30 minutes')).toEqual({ minutes: 30 });
      });
      
      it('should parse "45min" format', () => {
        expect(convertToPeriodValue('45min')).toEqual({ minutes: 45 });
      });
    });
    
    describe('ISO 8601 duration formats', () => {
      it('should parse "PT4H" format', () => {
        expect(convertToPeriodValue('PT4H')).toEqual({ minutes: 240 });
      });
      
      it('should parse "PT4H30M" format', () => {
        expect(convertToPeriodValue('PT4H30M')).toEqual({ minutes: 270 });
      });
      
      it('should parse "PT30M" format', () => {
        expect(convertToPeriodValue('PT30M')).toEqual({ minutes: 30 });
      });
      
      it('should parse "P1D" format', () => {
        expect(convertToPeriodValue('P1D')).toEqual({ minutes: 1440 });
      });
      
      it('should parse "P1DT2H" format', () => {
        expect(convertToPeriodValue('P1DT2H')).toEqual({ minutes: 1560 });
      });
      
      it('should be case insensitive', () => {
        expect(convertToPeriodValue('pt4h')).toEqual({ minutes: 240 });
      });
    });
    
    describe('object format', () => {
      it('should accept { minutes: 240 } format', () => {
        expect(convertToPeriodValue({ minutes: 240 })).toEqual({ minutes: 240 });
      });
      
      it('should extract minutes from complex objects', () => {
        expect(convertToPeriodValue({ minutes: 120, other: 'data' })).toEqual({ minutes: 120 });
      });
    });
    
    describe('plain number strings', () => {
      it('should parse "240" as minutes', () => {
        expect(convertToPeriodValue('240')).toEqual({ minutes: 240 });
      });
    });
    
    describe('invalid inputs', () => {
      it('should return null for empty string', () => {
        expect(convertToPeriodValue('')).toBeNull();
      });
      
      it('should return null for random text', () => {
        expect(convertToPeriodValue('invalid')).toBeNull();
      });
      
      it('should return null for null', () => {
        expect(convertToPeriodValue(null)).toBeNull();
      });
      
      it('should return null for undefined', () => {
        expect(convertToPeriodValue(undefined)).toBeNull();
      });
      
      it('should return null for empty object', () => {
        expect(convertToPeriodValue({})).toBeNull();
      });
    });
    
    describe('edge cases', () => {
      it('should handle whitespace', () => {
        expect(convertToPeriodValue('  4h  ')).toEqual({ minutes: 240 });
      });
      
      it('should handle 45 hours (multi-day estimation)', () => {
        expect(convertToPeriodValue('45h')).toEqual({ minutes: 2700 });
      });
    });
  });
  
  describe('isPeriodField', () => {
    describe('by field type', () => {
      it('should detect PeriodIssueCustomField type', () => {
        expect(isPeriodField('Any Name', 'PeriodIssueCustomField')).toBe(true);
      });
      
      it('should detect period in $type object', () => {
        expect(isPeriodField('Any Name', { $type: 'PeriodIssueCustomField' })).toBe(true);
      });
      
      it('should detect period in id object', () => {
        expect(isPeriodField('Any Name', { id: 'period' })).toBe(true);
      });
    });
    
    describe('by field name', () => {
      it('should detect "Estimation" field', () => {
        expect(isPeriodField('Estimation')).toBe(true);
      });
      
      it('should detect "Spent time" field', () => {
        expect(isPeriodField('Spent time')).toBe(true);
      });
      
      it('should detect "Remaining time" field', () => {
        expect(isPeriodField('Remaining time')).toBe(true);
      });
      
      it('should detect "Time Spent" field (case variations)', () => {
        expect(isPeriodField('Time Spent')).toBe(true);
      });
      
      it('should detect "Estimated Time" field', () => {
        expect(isPeriodField('Estimated Time')).toBe(true);
      });
      
      it('should not detect unrelated fields', () => {
        expect(isPeriodField('Priority')).toBe(false);
        expect(isPeriodField('State')).toBe(false);
        expect(isPeriodField('Summary')).toBe(false);
      });
    });
  });
  
  describe('formatPeriodValue', () => {
    it('should format minutes only', () => {
      expect(formatPeriodValue(30)).toBe('30m');
    });
    
    it('should format hours and minutes', () => {
      expect(formatPeriodValue(90)).toBe('1h 30m');
    });
    
    it('should format hours only', () => {
      expect(formatPeriodValue(120)).toBe('2h');
    });
    
    it('should format days, hours, minutes', () => {
      expect(formatPeriodValue(570)).toBe('1d 1h 30m');
    });
    
    it('should format weeks', () => {
      expect(formatPeriodValue(2400)).toBe('1w');
    });
    
    it('should handle zero', () => {
      expect(formatPeriodValue(0)).toBe('0m');
    });
    
    it('should handle negative (return 0m)', () => {
      expect(formatPeriodValue(-60)).toBe('0m');
    });
    
    it('should format 45 hours correctly', () => {
      // 45 hours = 2700 minutes = 1 week + 1 day + 5 hours
      expect(formatPeriodValue(2700)).toBe('1w 5h');
    });
  });
});
