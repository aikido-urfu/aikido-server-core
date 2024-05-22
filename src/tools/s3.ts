import { S3Client } from '@aws-sdk/client-s3';
// Установка региона Object Storage
const REGION = 'ru-central1';
// Установка эндпоинта Object Storage
const ENDPOINT = 'https://storage.yandexcloud.net';
// Создание клиента для Object Storage
const s3Client = new S3Client({ region: REGION, endpoint: ENDPOINT });
export { s3Client };
