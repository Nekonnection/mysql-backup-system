import dotenv from 'dotenv';
dotenv.config();
/**
 * アプリケーションの設定情報を管理するオブジェクト
 */
export const config = {
    db: {
        host: process.env.DB_HOST!,
        user: process.env.DB_USER!,
        password: process.env.DB_PASSWORD!,
        name: process.env.DB_NAME!,
    },
    aws: {
        s3BucketName: process.env.AWS_S3_BUCKET_NAME!,
        region: process.env.AWS_REGION!,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
    cron: {
        schedule: '0 0 * * *',
        timezone: 'Asia/Tokyo',
    },
};