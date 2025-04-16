
import { VersionWithField } from '../types/version-types';

export const formatDate = (date: Date) => {
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDayHeader = (day: Date) => {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (
    day.getDate() === now.getDate() &&
    day.getMonth() === now.getMonth() &&
    day.getFullYear() === now.getFullYear()
  ) {
    return 'Today';
  } else if (
    day.getDate() === yesterday.getDate() &&
    day.getMonth() === yesterday.getMonth() &&
    day.getFullYear() === yesterday.getFullYear()
  ) {
    return 'Yesterday';
  } else {
    return day.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: now.getFullYear() !== day.getFullYear() ? 'numeric' : undefined
    });
  }
};

export const groupVersionsByDay = (allVersions: VersionWithField[]) => {
  const grouped = new Map<string, typeof allVersions>();
  
  allVersions.forEach(item => {
    const date = item.version.timestamp;
    const dayKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    
    if (!grouped.has(dayKey)) {
      grouped.set(dayKey, []);
    }
    
    grouped.get(dayKey)?.push(item);
  });
  
  // Sort each day's versions by timestamp (newest first)
  grouped.forEach((versions, day) => {
    versions.sort((a, b) => 
      b.version.timestamp.getTime() - a.version.timestamp.getTime()
    );
  });
  
  // Convert the map to an array of [day, versions] pairs, sorted by day (newest first)
  return Array.from(grouped.entries())
    .sort((a, b) => {
      const dayA = a[0].split('-').map(Number);
      const dayB = b[0].split('-').map(Number);
      
      // Compare years
      if (dayB[0] !== dayA[0]) return dayB[0] - dayA[0];
      // Compare months
      if (dayB[1] !== dayA[1]) return dayB[1] - dayA[1];
      // Compare days
      return dayB[2] - dayA[2];
    })
    .map(([day, versions]) => {
      // Get a proper date object for display
      const [year, month, dayOfMonth] = day.split('-').map(Number);
      const dateObj = new Date(year, month, dayOfMonth);
      
      return {
        day: dateObj,
        versions
      };
    });
};

