import { BackupScheduler } from "./scheduler.js";
import { BackupService } from "./services/backup.service.js";
import { MySqlDumper } from "./services/dumper.service.js";
import { S3Uploader } from "./services/uploader.service.js";

(async (): Promise<void> => {
	const dumper = new MySqlDumper();
	const uploader = new S3Uploader();
	const backupService = new BackupService(dumper, uploader);
	const scheduler = new BackupScheduler(backupService);

	scheduler.start();
})();
