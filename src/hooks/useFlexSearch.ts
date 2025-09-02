import { Document, DocumentData } from 'flexsearch';
import { useMemo } from 'react';

export function useDocumentSearch<T extends DocumentData>(
  query: string,
  index: Document<T>,
) {
  return useMemo(() => index.search(query, { enrich: true }), [query, index]);
}
