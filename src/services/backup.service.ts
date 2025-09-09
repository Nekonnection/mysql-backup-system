import { MySqlDumper } from "./dumper.service.js";
import { S3Uploader } from "./uploader.service.js";

/**
 * データベースのダンプとS3へのアップロードを統括するクラス
 */
export class BackupService {
	constructor(
		private readonly dumper: MySqlDumper,
		private readonly uploader: S3Uploader
	) {}

	public async run(): Promise<void> {
		console.log("🚀 Starting backup process...");
		let dumpFilePath: string | null = null;
		try {
			dumpFilePath = await this.dumper.dump();
			await this.uploader.upload(dumpFilePath);
			console.log("🎉 Backup process completed successfully.");
		} catch (error) {
			console.error("💥 An error occurred during the backup process:", error);
		} finally {
			if (dumpFilePath) {
				this.uploader.cleanup(dumpFilePath);
			}
		}
	}
}
