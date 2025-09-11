import { execFile } from "child_process";
import path from "path";
import fs from "fs";
import { config } from "../config.js";
import { fileURLToPath } from "url";

/**
 * データベースのダンプをするクラス
 */
export class MySqlDumper {
    public async dump(): Promise<string> {
        const { host, user, password, name } = config.db;
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        
        const tmpDir = path.join(__dirname, '..', '..', 'tmp');
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const fileName = `backup-${timestamp}.sql`;
        const filePath = path.join(tmpDir, fileName);

        const args = [
            `-h`, host,
            `-u`, user,
            `-p${password}`,
            name,
            `--ssl=0`
        ];

        return new Promise((resolve, reject) => {
            const child = execFile('mysqldump', args, (error) => {
                if (error) {
                    return reject(new Error(`mysqldump failed: ${error.message}`));
                }
                console.log(`✅ Database dump successful: ${filePath}`);
                resolve(filePath);
            });
            
            const stream = fs.createWriteStream(filePath);
            if (child.stdout) {
                child.stdout.pipe(stream);
            } else {
                reject(new Error("mysqldump process has no stdout stream."));
            }
        });
    }
}