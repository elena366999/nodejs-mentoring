export const reverseString = () => {
    console.log('Please type a string to reverse');
    process.stdin
        .on('data', (data) => {
            const input = data.toString().trim();
            const output = input.split('').reverse().join('');
            process.stdout.write(`${output}\n`);
        });
};
