export const reverseString = () => {
    console.log("Please type a string to reverse")
    process.stdin
        .on('data', (data) => {
            let input = data.toString().trim();
            let output = input.split('').reverse().join('');
            process.stdout.write(output + '\n');
        });
}