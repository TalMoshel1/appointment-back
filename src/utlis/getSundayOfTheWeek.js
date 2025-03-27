export function getPreviousSunday(dateString) {
    try {
      const date = new Date(dateString);
      const dayOfWeek = date.getDay(); // Sunday is 0, Saturday is 6
      const daysToSubtract = dayOfWeek === 0 ? 7 : dayOfWeek; // If it's Sunday, go back 7 days; otherwise, go back the current day of week
      const sundayDate = new Date(date.getTime() - daysToSubtract * 24 * 60 * 60 * 1000); // Subtract days in milliseconds
      return sundayDate.toISOString().split('T')[0] + 'T00:00:00.000Z';
    } catch (error) {
      return "Invalid date format";
    }
  }