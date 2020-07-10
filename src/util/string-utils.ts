import { logger } from './logger';

export function includesIgnoreCase(str: string, search_str: string): boolean {
    const result = str.search(new RegExp(search_str, 'i'));
    return result > 0;
}

export function sortIgnoreCase(str1: string, str2: string): number {
    return str1.localeCompare(str2, undefined, { sensitivity: 'base' });
}

export const reverseString = (): void => {
    logger.info('Please type a string to reverse');
    process.stdin
        .on('data', (data) => {
            const input = data.toString().trim();
            const output = input.split('').reverse().join('');
            process.stdout.write(`${output}\n`);
        });
};

