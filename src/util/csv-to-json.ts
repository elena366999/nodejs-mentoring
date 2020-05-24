import { pipeline } from 'stream';
import csv from 'csvtojson';
import fs from 'fs';

const csvFilePath = 'src/csv/example-csv.csv';

export const csvToJson = () => {
    fs.createReadStream(csvFilePath)
        .pipe(csv({ checkType: true, trim: true })
            .preFileLine((fileLine, idx) => {
                return idx === 0 ? fileLine.toLowerCase() : fileLine;
            }))
        .on('error', () => console.log('An error occurred while converting csv to json'))
        .pipe(fs.createWriteStream('result-json.txt'))
        .on('error', () => console.log('An error occurred while writing json to file'));
};

// Implements the same logic as in csvToJson(), but uses stream.pipeline() instead of pipe()
export function csvToJsonUsingPipeline() {
    pipeline(
        fs.createReadStream(csvFilePath),
        csv({ checkType: true, trim: true })
            .preFileLine((fileLine, idx) => {
                return idx === 0 ? fileLine.toLowerCase() : fileLine;
            }),
        fs.createWriteStream('result-json.txt'),
        (err) => {
            if (err) {
                console.error('Csv to json pipeline failed.', err);
            } else {
                console.log('Csv to json pipeline succeeded.');
            }
        }
    );
}
