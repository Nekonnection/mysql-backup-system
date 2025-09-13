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
	/**
	 * バックアップ処理を実行する
	 */
	public async run(): Promise<void> {
		console.log("バックアップ処理を開始します...");
		let dumpFilePath: string | null = null;
		try {
			dumpFilePath = await this.dumper.dump();
			await this.uploader.upload(dumpFilePath);
			console.log("バックアップ処理が正常に完了しました。");
		} catch (error) {
			console.error("バックアップ処理中にエラーが発生しました:", error);
		} finally {
			if (dumpFilePath) {
				await this.uploader.cleanup(dumpFilePath);
			}
		}
	}
}
