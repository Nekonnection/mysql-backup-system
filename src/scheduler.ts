import cron from "node-cron";
import { BackupService } from "./services/backup.service.js";
import { config } from "./config.js";

/**
 * バックアップのスケジューリングを管理するクラス
 */
export class BackupScheduler {
	constructor(private readonly backupService: BackupService) {}

	public start(): void {
		cron.schedule(
			config.cron.schedule,
			() => {
				console.log(`\n[${new Date().toLocaleString("ja-JP")}] Running scheduled backup...`);
				this.backupService.run();
			},
			{ timezone: config.cron.timezone }
		);
		console.log(`⏰ Backup scheduler started. Will run at: ${config.cron.schedule}`);
	}
}
