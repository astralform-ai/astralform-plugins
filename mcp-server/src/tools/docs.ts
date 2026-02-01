/**
 * Astralform Documentation Tools
 *
 * Uses Mintlify-hosted documentation at astralform.mintlify.app
 */

const MINTLIFY_BASE_URL = "https://astralform.mintlify.app";

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

// Cache for the full docs content
let cachedDocs: string | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch the full documentation from Mintlify's llms-full.txt
 */
async function fetchFullDocs(): Promise<string> {
  const now = Date.now();
  if (cachedDocs && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedDocs;
  }

  const response = await fetch(`${MINTLIFY_BASE_URL}/llms-full.txt`);
  if (!response.ok) {
    throw new Error(`Failed to fetch docs: ${response.status}`);
  }

  cachedDocs = await response.text();
  cacheTimestamp = now;
  return cachedDocs;
}

/**
 * Parse the llms-full.txt format into sections
 */
function parseDocsIntoSections(
  content: string,
): Array<{ path: string; title: string; content: string; category: string }> {
  const sections: Array<{
    path: string;
    title: string;
    content: string;
    category: string;
  }> = [];

  // Mintlify llms-full.txt format typically has sections separated by headers
  // We'll parse based on common patterns
  const lines = content.split("\n");
  let currentSection: {
    path: string;
    title: string;
    content: string;
    category: string;
  } | null = null;

  for (const line of lines) {
    // Look for section headers (typically # Title or ## Title)
    const headerMatch = line.match(/^(#+)\s+(.+)$/);
    if (headerMatch && headerMatch[1].length <= 2) {
      if (currentSection) {
        sections.push(currentSection);
      }

      const title = headerMatch[2];
      // Infer path and category from title
      const category = inferCategory(title);
      const path = inferPath(title, category);

      currentSection = {
        path,
        title,
        content: "",
        category,
      };
    } else if (currentSection) {
      currentSection.content += line + "\n";
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  return sections;
}

function inferCategory(title: string): string {
  const lowerTitle = title.toLowerCase();
  if (
    lowerTitle.includes("ios") ||
    lowerTitle.includes("sdk") ||
    lowerTitle.includes("swift")
  ) {
    return "ios-sdk";
  }
  if (
    lowerTitle.includes("api") ||
    lowerTitle.includes("endpoint") ||
    lowerTitle.includes("stream")
  ) {
    return "backend-api";
  }
  if (
    lowerTitle.includes("dashboard") ||
    lowerTitle.includes("project") ||
    lowerTitle.includes("key")
  ) {
    return "dashboard";
  }
  if (lowerTitle.includes("mcp") || lowerTitle.includes("tool")) {
    return "mcp-config";
  }
  return "guides";
}

function inferPath(title: string, category: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `/${category}/${slug}`;
}

/**
 * Search documentation using simple text matching
 */
export async function searchDocs(
  input: SearchDocsInput,
): Promise<DocSearchResult[]> {
  const fullDocs = await fetchFullDocs();
  const sections = parseDocsIntoSections(fullDocs);

  const query = input.query.toLowerCase();
  const queryTerms = query.split(/\s+/);

  const results: DocSearchResult[] = [];

  for (const section of sections) {
    // Filter by category if specified
    if (input.category && section.category !== input.category) {
      continue;
    }

    const fullText = `${section.title} ${section.content}`.toLowerCase();

    // Calculate relevance based on term matches
    let relevance = 0;
    for (const term of queryTerms) {
      const matches = (fullText.match(new RegExp(term, "g")) || []).length;
      relevance += matches;
      // Boost for title matches
      if (section.title.toLowerCase().includes(term)) {
        relevance += 5;
      }
    }

    if (relevance > 0) {
      // Extract excerpt around first match
      const excerpt = extractExcerpt(section.content, queryTerms[0]);

      results.push({
        title: section.title,
        path: section.path,
        excerpt,
        category: section.category,
        relevance,
      });
    }
  }

  // Sort by relevance
  results.sort((a, b) => b.relevance - a.relevance);

  // Limit results
  const limit = input.limit || 5;
  return results.slice(0, limit);
}

function extractExcerpt(content: string, searchTerm: string): string {
  const lowerContent = content.toLowerCase();
  const index = lowerContent.indexOf(searchTerm.toLowerCase());

  if (index === -1) {
    // Return first 200 chars if term not found
    return content.slice(0, 200).trim() + "...";
  }

  const start = Math.max(0, index - 50);
  const end = Math.min(content.length, index + 150);
  let excerpt = content.slice(start, end).trim();

  if (start > 0) excerpt = "..." + excerpt;
  if (end < content.length) excerpt = excerpt + "...";

  return excerpt;
}

/**
 * Get a specific documentation page
 */
export async function getDoc(path: string): Promise<DocPage> {
  const fullDocs = await fetchFullDocs();
  const sections = parseDocsIntoSections(fullDocs);

  // Normalize path
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  // Try exact match first
  let section = sections.find((s) => s.path === normalizedPath);

  // Try partial match
  if (!section) {
    const pathSlug = normalizedPath.split("/").pop() || "";
    section = sections.find((s) => s.path.includes(pathSlug));
  }

  if (!section) {
    throw new Error(`Documentation page not found: ${path}`);
  }

  return {
    path: section.path,
    title: section.title,
    content: section.content.trim(),
    category: section.category,
  };
}
