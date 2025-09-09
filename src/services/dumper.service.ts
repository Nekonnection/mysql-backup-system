import { exec } from "child_process";
import path from "path";
import fs from "fs";
import { config } from "../config.js";

/**
 * データベースのダンプをするクラス
 */
export class MySqlDumper {
	public async dump(): Promise<string> {
		const { host, user, password, name } = config.db;
		const tmpDir = path.join(__dirname, "..", "..", "tmp");
		if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir); // tmpディレクトリ作成

		const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
		const fileName = `backup-${timestamp}.sql`;
		const filePath = path.join(tmpDir, fileName);
		const dumpCommand = `mysqldump -h ${host} -u ${user} -p"${password}" ${name} > ${filePath}`;

		return new Promise((resolve, reject) => {
			exec(dumpCommand, (error) => {
				if (error) return reject(new Error(`mysqldump failed: ${error.message}`));
				console.log(`✅ Database dump successful: ${filePath}`);
				resolve(filePath);
			});
		});
	}
}
