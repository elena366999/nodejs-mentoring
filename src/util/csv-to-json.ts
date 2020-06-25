import { pipeline } from 'stream';
import csv from 'csvtojson';
import fs from 'fs';
import { logger } from './logger';

const csvFilePath = 'src/csv/example-csv.csv';

export const csvToJson = (): void => {
    fs.createReadStream(csvFilePath)
        .pipe(csv({ checkType: true, trim: true })
            .preFileLine((fileLine, idx) => {
                return idx === 0 ? fileLine.toLowerCase() : fileLine;
            }))
        .on('error', () => logger.error('An error occurred while converting csv to json'))
        .pipe(fs.createWriteStream('result-json.txt'))
        .on('error', () => logger.error('An error occurred while writing json to file'));
};

// Implements the same logic as in csvToJson(), but uses stream.pipeline() instead of pipe()
export function csvToJsonUsingPipeline(): void {
    pipeline(
        fs.createReadStream(csvFilePath),
        csv({ checkType: true, trim: true })
            .preFileLine((fileLine, idx) => {
                return idx === 0 ? fileLine.toLowerCase() : fileLine;
            }),
        fs.createWriteStream('result-json.txt'),
        (err) => {
            if (err) {
                logger.error('Csv to json pipeline failed.', err);
            } else {
                logger.info('Csv to json pipeline succeeded.');
            }
        }
    );
}
