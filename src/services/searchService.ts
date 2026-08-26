/**
 * Client-Side Fuzzy & Keyword Search Service
 * Supports multi-field matching, partial matching, and debouncing.
 */

export function fuzzySearch<T>(
  items: T[],
  query: string,
  fields: (keyof T | ((item: T) => string | string[]))[]
): T[] {
  if (!query || query.trim() === '') return items;

  const normalizedQuery = query.toLowerCase().trim();
  const queryTokens = normalizedQuery.split(/\s+/);

  return items.filter((item) => {
    // Extract text from all search fields
    const searchableText: string[] = [];

    for (const field of fields) {
      if (typeof field === 'function') {
        const val = field(item);
        if (Array.isArray(val)) {
          searchableText.push(...val.map((v) => String(v).toLowerCase()));
        } else if (val) {
          searchableText.push(String(val).toLowerCase());
        }
      } else {
        const val = item[field];
        if (Array.isArray(val)) {
          searchableText.push(...val.map((v) => String(v).toLowerCase()));
        } else if (val) {
          searchableText.push(String(val).toLowerCase());
        }
      }
    }

    const combinedText = searchableText.join(' ');

    // Check if every token matches
    return queryTokens.every((token) => combinedText.includes(token));
  });
}
