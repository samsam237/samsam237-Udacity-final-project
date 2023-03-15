import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic

const s3BucketName = process.env.ATTACHEMENT_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export class AttachmentUtils{
	constructor(
		private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' }),
		private readonly bucketName = s3BucketName
		/*private readonly todoTable = process.env.TODO_TABLE,
		private readonly docClient = new XAWS.DynamoDB.DocumentClient(),
		private readonly indexName = process.env.INDEX_NAME*/
	){}
	getAttachmentUrl(todoId: string){
		return `https://${this.bucketName}.s3.amazonaws.com/${todoId}`
	}

	getUploader(todoId: string){
		const url = this.s3.getSignedUrl('putObject',{
			Bucket: this.bucketName,
			key: todoId,
			Expires: urlExpiration
		})
		return url as string
	}

}