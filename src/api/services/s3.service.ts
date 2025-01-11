import { ManagedUpload } from 'aws-sdk/clients/s3';
import s3 from '../../config/aws.config';
import { BadRequestError } from '../utils/errorHandler';
import logger from '../../config/Logger';

export const s3Service = {
    /**
     * Uploads an image to S3 bucket.
     * @param file - The file object from multer.
     * @returns Uploaded file data.
     */
    uploadImage: async (
        file: Express.Multer.File,
    ): Promise<ManagedUpload.SendData> => {
        // Validate input file
        if (!file) {
            throw new BadRequestError('File is required for upload');
        }

        // Validate bucket name
        const bucketName = process.env.AWS_BUCKET_NAME;
        if (!bucketName) {
            throw new Error('AWS_BUCKET_NAME environment variable is not set');
        }

        // Set S3 upload parameters
        const params = {
            Bucket: bucketName,
            Key: `uploads/${file.originalname}`, // File name in S3
            Body: file.buffer, // File content
            ContentType: file.mimetype, // Ensure the content type is set
        };

        try {
            logger.info('Uploading file to S3', {
                fileName: file.originalname,
            });

            // Upload file to S3
            const uploadResult = await s3.upload(params).promise();

            logger.info('File uploaded successfully', {
                fileName: file.originalname,
                location: uploadResult.Location,
            });
            return uploadResult;
        } catch (error) {
            logger.error('Error uploading file to S3', {
                error,
                fileName: file.originalname,
            });
            throw new Error('Failed to upload file to S3');
        }
    },
};
