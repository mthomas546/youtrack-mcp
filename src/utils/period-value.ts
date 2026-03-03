/**
 * Period Value Utility
 * Handles conversion of various time duration formats to YouTrack's PeriodValue format.
 * 
 * YouTrack API expects: { minutes: N }
 * 
 * Supported input formats:
 * - Minutes as integer: 240
 * - Hours string: "4h" or "4 hours"
 * - Days string: "2d" or "2 days"
 * - Weeks string: "1w" or "1 week"
 * - Minutes string: "30m" or "30 minutes"
 * - ISO 8601 duration: "PT4H", "PT4H30M", "P1D"
 * - Object: { minutes: 240 }
 */

export interface PeriodValue {
  minutes: number;
}

/**
 * Parse ISO 8601 duration format (e.g., "PT4H", "PT4H30M", "P1DT2H")
 */
function parseISO8601Duration(value: string): number | null {
  // Match ISO 8601 duration pattern
  const match = value.match(/^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/i);
  
  if (!match) {
    return null;
  }
  
  const days = parseInt(match[1] || '0', 10);
  const hours = parseInt(match[2] || '0', 10);
  const minutes = parseInt(match[3] || '0', 10);
  // Seconds are ignored for YouTrack (minutes is the minimum unit)
  
  return (days * 24 * 60) + (hours * 60) + minutes;
}

/**
 * Parse human-readable duration string (e.g., "4h", "2 days", "30m")
 */
function parseHumanReadableDuration(value: string): number | null {
  const normalizedValue = value.toLowerCase().trim();
  
  // Combined pattern for various formats
  const patterns: Array<{ regex: RegExp; multiplier: number }> = [
    { regex: /^(\d+(?:\.\d+)?)\s*w(?:eeks?)?$/i, multiplier: 5 * 8 * 60 }, // 1 week = 5 work days = 40 hours
    { regex: /^(\d+(?:\.\d+)?)\s*d(?:ays?)?$/i, multiplier: 8 * 60 },      // 1 day = 8 hours
    { regex: /^(\d+(?:\.\d+)?)\s*h(?:ours?)?$/i, multiplier: 60 },          // 1 hour = 60 minutes
    { regex: /^(\d+(?:\.\d+)?)\s*m(?:in(?:utes?)?)?$/i, multiplier: 1 },    // minutes
  ];
  
  for (const { regex, multiplier } of patterns) {
    const match = normalizedValue.match(regex);
    if (match) {
      const numValue = parseFloat(match[1]);
      return Math.round(numValue * multiplier);
    }
  }
  
  return null;
}

/**
 * Convert any supported duration format to YouTrack PeriodValue format.
 * 
 * @param value - Duration in any supported format
 * @returns PeriodValue object with minutes, or null if parsing fails
 * 
 * @example
 * convertToPeriodValue(240)           // { minutes: 240 }
 * convertToPeriodValue("4h")          // { minutes: 240 }
 * convertToPeriodValue("PT4H")        // { minutes: 240 }
 * convertToPeriodValue({ minutes: 240 }) // { minutes: 240 }
 */
export function convertToPeriodValue(value: any): PeriodValue | null {
  // Already in correct format
  if (value && typeof value === 'object' && typeof value.minutes === 'number') {
    return { minutes: value.minutes };
  }
  
  // Number: treat as minutes
  if (typeof value === 'number') {
    if (value < 0) return null;
    return { minutes: Math.round(value) };
  }
  
  // String: try various formats
  if (typeof value === 'string') {
    const trimmedValue = value.trim();
    
    // Try ISO 8601 duration first
    const isoMinutes = parseISO8601Duration(trimmedValue);
    if (isoMinutes !== null) {
      return { minutes: isoMinutes };
    }
    
    // Try human-readable format
    const humanMinutes = parseHumanReadableDuration(trimmedValue);
    if (humanMinutes !== null) {
      return { minutes: humanMinutes };
    }
    
    // Try plain number string
    const plainNumber = parseFloat(trimmedValue);
    if (!isNaN(plainNumber) && plainNumber >= 0) {
      return { minutes: Math.round(plainNumber) };
    }
  }
  
  return null;
}

/**
 * Check if a field is a Period type field based on its name or type.
 * 
 * @param fieldName - Name of the field
 * @param fieldType - Optional field type info from YouTrack
 */
export function isPeriodField(fieldName: string, fieldType?: string | { $type?: string; id?: string }): boolean {
  // Check by field type
  if (fieldType) {
    const typeStr = typeof fieldType === 'string' ? fieldType : (fieldType.$type || fieldType.id || '');
    if (typeStr.toLowerCase().includes('period')) {
      return true;
    }
  }
  
  // Check by common period field names
  const periodFieldNames = [
    'estimation',
    'spent time',
    'remaining time',
    'time spent',
    'time remaining',
    'estimated time',
    'duration',
    'effort',
  ];
  
  const normalizedName = fieldName.toLowerCase();
  return periodFieldNames.some(name => normalizedName.includes(name));
}

/**
 * Format minutes back to human-readable string
 * 
 * @param minutes - Duration in minutes
 * @returns Human-readable string (e.g., "4h 30m")
 */
export function formatPeriodValue(minutes: number): string {
  if (minutes < 0) return '0m';
  
  const weeks = Math.floor(minutes / (5 * 8 * 60));
  const remainingAfterWeeks = minutes % (5 * 8 * 60);
  const days = Math.floor(remainingAfterWeeks / (8 * 60));
  const remainingAfterDays = remainingAfterWeeks % (8 * 60);
  const hours = Math.floor(remainingAfterDays / 60);
  const mins = remainingAfterDays % 60;
  
  const parts: string[] = [];
  if (weeks > 0) parts.push(`${weeks}w`);
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (mins > 0 || parts.length === 0) parts.push(`${mins}m`);
  
  return parts.join(' ');
}
