/**
 * Astralform Documentation Tools
 *
 * Uses Mintlify-hosted documentation at astralform.mintlify.app
 */
export interface DocSearchResult {
    title: string;
    path: string;
    excerpt: string;
    category: string;
    relevance: number;
}
export interface DocPage {
    path: string;
    title: string;
    content: string;
    category: string;
}
export interface SearchDocsInput {
    query: string;
    category?: string;
    limit?: number;
}
/**
 * Search documentation using simple text matching
 */
export declare function searchDocs(input: SearchDocsInput): Promise<DocSearchResult[]>;
/**
 * Get a specific documentation page
 */
export declare function getDoc(path: string): Promise<DocPage>;
