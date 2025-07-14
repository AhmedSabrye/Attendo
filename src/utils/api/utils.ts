// ==================== UTILITY FUNCTIONS ====================

export const utils = {
  // Calculate attendance status based on duration and minimum
  getAttendanceStatus(durationMinutes: number, minimumDuration: number = 60): "attended" | "partial" | "absent" {
    if (durationMinutes >= minimumDuration) return "attended";
    if (durationMinutes > 0) return "partial";
    return "absent";
  },

  // Format duration for display
  formatDuration(minutes: number): string {
    if (minutes === 0) return "0min";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  },

  // Generate date range
  generateDateRange(startDate: string, endDate: string): string[] {
    const dates: string[] = [];
    const current = new Date(startDate);
    const end = new Date(endDate);

    while (current <= end) {
      dates.push(current.toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    }

    return dates;
  },

  // Get last N days
  getLastNDays(n: number): string[] {
    const dates: string[] = [];
    const today = new Date();

    for (let i = n - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split("T")[0]);
    }

    return dates;
  },
};
