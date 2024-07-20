const fs = require('fs');
const archiver = require('archiver');
const { openDatabase, closeDatabase } = require("./levelDB")
require("dotenv").config()

const dbPath = process.env.DB_ADDRESS || './DataBase'; // Adjust based on LevelDB location

async function createBackup(onProgress = () => { }, backupPath = `${process.env.DB_ADDRESS}/backupDB/`) {
    await closeDatabase();
    return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(`${backupPath}/backup_${Date.now()}.zip`);
        const archive = archiver('zip', { zlib: { level: 9 } });

        let totalBytes = 0;
        let processedBytes = 0;

        output.on('close', async () => {
            await openDatabase(); // Reopen the database
            onProgress(100); // Ensure we end with 100% progress
            resolve(`${backupPath}/backup_${Date.now()}.zip`);
        });

        archive.on('data', chunk => {
            processedBytes += chunk.length;
            const progress = Math.floor((processedBytes / totalBytes) * 100);
            onProgress(progress);
        });

        archive.on('error', async (err) => {
            await openDatabase(); // Ensure to reopen the database even if there's an error
            reject(err);
        });

        archive.on('entry', entry => {
            totalBytes += entry.stats.size;
        });

        archive.pipe(output);
        archive.directory(dbPath, false);
        archive.finalize();
    });
}

module.exports = { createBackup };
