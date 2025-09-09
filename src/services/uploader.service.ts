import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import { config } from "../config.js";

/**
 * S3へのアップロードをするクラス
 */
export class S3Uploader {
	private readonly s3Client: S3Client;

	constructor() {
		this.s3Client = new S3Client({
			region: config.aws.region,
			credentials: {
				accessKeyId: config.aws.accessKeyId,
				secretAccessKey: config.aws.secretAccessKey
			}
		});
	}

	public async upload(filePath: string): Promise<void> {
		const fileName = path.basename(filePath);
		await this.s3Client.send(
			new PutObjectCommand({
				Bucket: config.aws.s3BucketName,
				Key: `backups/${fileName}`,
				Body: fs.createReadStream(filePath)
			})
		);
		console.log(`✅ S3 upload successful: backups/${fileName}`);
	}

	public cleanup(filePath: string): void {
		if (fs.existsSync(filePath)) {
			fs.unlinkSync(filePath);
			console.log(`🗑️ Local file deleted: ${filePath}`);
		}
	}
}
