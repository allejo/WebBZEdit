import { Document } from 'flexsearch';
import { useMemo } from 'react';

export function useDocumentSearch(query: string, index: Document) {
  return useMemo(() => {
    return index.search(query, { enrich: true });
  }, [query, index]);
}
