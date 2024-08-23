import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

import { AWS_ACCESS_KEY_ID, AWS_BUCKET_NAME, AWS_REGION, AWS_SECRET_KEY_ID } from "../lib/config";

class S3Service {
  private s3 = new S3Client({
    region: AWS_REGION!,
    credentials: { accessKeyId: AWS_ACCESS_KEY_ID!, secretAccessKey: AWS_SECRET_KEY_ID! },
  });

  public uploadToS3 = async (Key: string, Body: Buffer, ContentType: string) => {
    try {
      const command = new PutObjectCommand({ Bucket: AWS_BUCKET_NAME, Key, Body, ContentType });
      await this.s3.send(command);
    } catch (error) {
      console.error(error);
      throw new Error("Error in uploading file");
    }
  };

  public deleteFromS3 = async (Key: string) => {
    try {
      const command = new DeleteObjectCommand({ Bucket: AWS_BUCKET_NAME, Key });
      await this.s3.send(command);
    } catch (error) {
      console.error(error);
      throw new Error("Error in deleting file");
    }
  };
}

export default S3Service;
