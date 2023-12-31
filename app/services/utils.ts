export const formateDate = (date: Date) =>
  date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

export const formateDateWithoutHour = (date: Date) =>
  date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

export function formatInstant(created_at: string) {
  const date = new Date(created_at);
  const now = new Date();
  const diff = (now.getTime() - date.getTime()) / 1000;

  if (diff < 60) {
    return 'maintenant';
  } else if (diff < 3600) {
    const minutes = Math.floor(diff / 60);
    return `${minutes}m`;
  } else if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return `${hours}h`;
  } else {
    const day = date.getDate();
    const month = date.toLocaleString('fr-FR', { month: 'short' });
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  }
}
