/**
 * Helper to ensure dates and birthdates strictly follow dd/mm/yyyy format (e.g. 15/05/2012, 19/05/1890)
 */
export const formatToDdMmYyyy = (d?: string | null | Date): string => {
  if (!d) return '';
  if (d instanceof Date) {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear());
    return `${day}/${month}/${year}`;
  }

  const str = String(d).trim();

  // Already dd/mm/yyyy
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
    return str;
  }

  // dd/mm/yy (2-digit year like 15/05/12 or 19/05/90)
  const dmy2 = str.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2})$/);
  if (dmy2) {
    const day = dmy2[1].padStart(2, '0');
    const month = dmy2[2].padStart(2, '0');
    const yy = parseInt(dmy2[3], 10);
    const fullYear = yy <= 40 ? `20${dmy2[3]}` : `19${dmy2[3]}`;
    return `${day}/${month}/${fullYear}`;
  }

  // dd/mm/yyyy or d/m/yyyy
  const dmy4 = str.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/);
  if (dmy4) {
    return `${dmy4[1].padStart(2, '0')}/${dmy4[2].padStart(2, '0')}/${dmy4[3]}`;
  }

  // yyyy-mm-dd (ISO date format from input or database)
  const ymd = str.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
  if (ymd) {
    return `${ymd[3].padStart(2, '0')}/${ymd[2].padStart(2, '0')}/${ymd[1]}`;
  }

  return str;
};

// Backwards-compatible alias ensuring dd/mm/yyyy format is strictly used
export const formatToDdMmYy = formatToDdMmYyyy;
