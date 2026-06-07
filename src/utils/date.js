export function formatDatePtBR(date) {
  return new Date(date).toLocaleDateString('pt-BR');
}

export function formatTimePtBR(date) {
  return new Date(date).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function toStartOfDay(value) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function parseWorkoutDate(registro) {
  if (registro?.dataIso) {
    const isoDate = new Date(registro.dataIso);
    if (!Number.isNaN(isoDate.getTime())) return isoDate;
  }

  if (registro?.data) {
    const parts = String(registro.data).split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      const parsed = new Date(`${year}-${month}-${day}T00:00:00`);
      if (!Number.isNaN(parsed.getTime())) return parsed;
    }
  }

  return null;
}
