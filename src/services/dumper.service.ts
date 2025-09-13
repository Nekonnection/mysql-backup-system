import { spawn, type ChildProcess } from "child_process";
import path from "path";
import { promises as fs } from "fs";
import { createWriteStream } from "fs";
import { pipeline } from "stream/promises";
import { fileURLToPath } from "url";
import { config } from "../config.js";
/**
 * MySQLデータベースのダンプを作成するクラス
 */
export class MySqlDumper {
    /**
     * データベースのダンプを作成する。
     */
    public async dump(): Promise<string> {
        const filePath = await this._createDumpFilePath();

        const { host, user, password, name } = config.db;
        const args = [`-h`, host, `-u`, user, name, `--ssl=0`];
        const env = { ...process.env, MYSQL_PWD: password };

        const dumpProcess = spawn('mysqldump', args, { env });

        try {
            await this._streamDumpToFile(dumpProcess, filePath);
            console.log(`データベースのダンプに成功しました: ${filePath}`);
            return filePath;
        } catch (error) {
            await fs.unlink(filePath).catch(() => {});
            console.error(`ダンプに失敗しました:`, error);
            throw error;
        }
    }
    /**
     * ダンプファイルのパスを生成し、tmpディレクトリを作成する
     * @return {Promise<string>} 生成されたダンプファイルのパス
     */
    private async _createDumpFilePath(): Promise<string> {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const tmpDir = path.join(__dirname, '..', '..', 'tmp');
        await fs.mkdir(tmpDir, { recursive: true });

        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const fileName = `backup-${timestamp}.sql`;
        return path.join(tmpDir, fileName);
    }
    /**
     * mysqldumpプロセスの出力をファイルにストリームします。
     * @param process mysqldumpプロセス
     * @param filePath 出力先ファイルのパス
     */
    private async _streamDumpToFile(process: ChildProcess, filePath: string): Promise<void> {
        if (!process.stdout) {
            throw new Error("mysqldumpプロセスの標準出力ストリームがありません。");
        }

        const stderrChunks: Buffer[] = [];
        process.stderr?.on('data', (chunk) => stderrChunks.push(chunk));
        
        const writeStream = createWriteStream(filePath);

        const pipelinePromise = pipeline(process.stdout, writeStream);
        const exitPromise = this._waitForProcessExit(process);
        
        const [, exitCode] = await Promise.all([pipelinePromise, exitPromise]);

        if (exitCode !== 0) {
            const stderr = Buffer.concat(stderrChunks).toString('utf8');
            throw new Error(`mysqldumpがエラーコード${exitCode}で終了しました: ${stderr}`);
        }
    }
    /**
     * プロセスの終了を待機します。
     * @param process mysqldumpプロセス
     * @returns プロセスの終了コード
     */
    private _waitForProcessExit(process: ChildProcess): Promise<number> {
        return new Promise((resolve, reject) => {
            process.on('error', (err) => {
                reject(new Error(`プロセスの起動に失敗しました: ${err.message}`));
            });
            process.on('close', (code) => {
                resolve(code ?? -1);
            });
        });
    }
}