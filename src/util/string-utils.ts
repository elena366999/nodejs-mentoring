export function includesIgnoreCase(str: string, search_str: string): boolean {
    const result = str.search(new RegExp(search_str, 'i'));
    return result > 0;
}

export function sortIgnoreCase(str1: any, str2: any): number {
    return str1.localeCompare(str2, undefined, { sensitivity: 'base' });
}
