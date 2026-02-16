
import * as XLSX from 'xlsx';
import * as path from 'path';

const filePath = path.join(__dirname, '../uploads/2015n2022_kyokwa_subject.xlsx');
console.log(`Reading file from: ${filePath}`);

try {
    const workbook = XLSX.readFile(filePath);
    const sheetNames = workbook.SheetNames;
    console.log(`Sheet Names: ${sheetNames.join(', ')}`);

    sheetNames.forEach(sheetName => {
        console.log(`\n--- Sheet: ${sheetName} ---`);
        const worksheet = workbook.Sheets[sheetName];
        // Get the range
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        // Read the first row (headers)
        const headers = [];
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellAddress = { c: C, r: range.s.r };
            const cellRef = XLSX.utils.encode_cell(cellAddress);
            const cell = worksheet[cellRef];
            headers.push(cell ? cell.v : 'UNDEFINED');
        }
        console.log('Headers:', headers);

        // Read first row of data to see types
        const firstDataRow = [];
        if (range.e.r > range.s.r) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cellAddress = { c: C, r: range.s.r + 1 };
                const cellRef = XLSX.utils.encode_cell(cellAddress);
                const cell = worksheet[cellRef];
                firstDataRow.push(cell ? cell.v : 'UNDEFINED');
            }
            console.log('First Data Row:', firstDataRow);
        }
    });

} catch (error) {
    console.error('Error reading file:', error);
}
