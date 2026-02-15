const fs = require('fs');
const path = require('path');

const downloadsDir = 'C:\\Users\\User\\Downloads';
const outputFile = path.join(__dirname, 'recent_downloads.txt');

try {
    const files = fs.readdirSync(downloadsDir);

    const recentFiles = files
        .map(file => {
            try {
                const fullPath = path.join(downloadsDir, file);
                const stats = fs.statSync(fullPath);
                return {
                    name: file,
                    time: stats.mtime,
                    isImage: /\.(png|jpg|jpeg|webp)$/i.test(file)
                };
            } catch (e) {
                return null;
            }
        })
        .filter(f => f && f.isImage)
        .sort((a, b) => b.time - a.time)
        .slice(0, 10);

    const output = recentFiles.map(f => `${f.name} | ${f.time.toISOString()}`).join('\n');
    fs.writeFileSync(outputFile, output, 'utf8');
    console.log('Done writing to ' + outputFile);

} catch (err) {
    console.error('Error:', err.message);
}
