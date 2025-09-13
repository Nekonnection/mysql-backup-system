import cron from "node-cron";
import { BackupService } from "./services/backup.service.js";
import { config } from "./config.js";
/**
 * バックアップのスケジューリングを管理するクラス
 */
export class BackupScheduler {
    private readonly job;

    constructor(private readonly backupService: BackupService) {
		this.job = cron.schedule(
			config.cron.schedule,
			() => this._runJob(),
			{
				timezone: config.cron.timezone,
			}
		);
		this.job.stop();
	}
    /**
     * スケジューラを起動します。
     */
    public start(): void {
        this.job.start();
        console.log(`バックアップスケジューラを起動しました。実行スケジュール: ${config.cron.schedule}`);
    }

    /**
     * スケジュールされたバックアップ処理を実行します。
     */
    private async _runJob(): Promise<void> {
        await this.backupService.run();
    }
}