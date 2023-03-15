import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
//import { TodoUpdate } from '../models/TodoUpdate';

var AWSXRay = require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic

export class TodosAccess{
	constructor(
		private readonly todosTable = process.env.TODOS_TABLE,
		private readonly s3 = new AWS.S3({ signatureVersion: 'v4' }),
		private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
		private readonly bucketName = process.env.IMAGES_S3_BUCKET,
		private readonly todosIndex = process.env.INDEX_NAME,
		private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION
	){}

	async getAllTodos(userId: string): Promise<TodoItem[]>{
		logger.info('Get all todos function called')

		const result = await this.docClient
		.query({
			TableName: this.todosTable,
			IndexName: this.todosIndex,
			KeyConditionExpression: `userId = :userId`,
			ExpressionAttributeValues: {
	          ':userId': userId
	        },
		}).promise()

		const items = result.Items
		return items as TodoItem[]
	}
  
	async createTodoItem(todoItem: TodoItem): Promise<TodoItem> {
	    logger.info('Create todos item function called')

	    const result = await this.docClient.put({
	      TableName: this.todosTable,
	      Item: todoItem
	    }).promise()

	    logger.info('Todo item created', result)
	    
	    return todoItem as TodoItem
	}

	async getSignedUrl(bucketKey: string): Promise<string> {
		return this.s3.getSignedUrl('putObject', {
		  Bucket: this.bucketName,
		  Key: bucketKey,
		  Expires: this.urlExpiration
		})
	}

	async updateAttachmentUrl(userId: string, todoId: string): Promise<void> {
		await this.docClient.update({
		  TableName: this.todosTable,
		  Key: {
		    "userId": userId,
		    "todoId": todoId
		  },
		  UpdateExpression: "set attachmentUrl=:attachmentUrl",
		  ExpressionAttributeValues:{
		      ":attachmentUrl": `https://${this.bucketName}.s3.amazonaws.com/${todoId}`
		  }
		}).promise()
	}

	async updateTodoItem(updateTodoRequest: UpdateTodoRequest, userId: string, todoId: string): Promise<void> {
		await this.docClient.update({
		  TableName: this.todosTable,
		  Key: {
		    "userId": userId,
		    "todoId": todoId
		  },
		  UpdateExpression: "set #name=:name, dueDate=:dueDate, done=:done",
		  ExpressionAttributeValues:{
		      ":name": updateTodoRequest.name,
		      ":dueDate": updateTodoRequest.dueDate,
		      ":done": updateTodoRequest.done
		  },
		  ExpressionAttributeNames: {
		    "#name": "name"
		  }
		}).promise()
	}

	async deleteTodoItem(userId: string, todoId: string): Promise<void> {
		await this.docClient.delete({
		  TableName: this.todosTable,
		  Key: {
		    "userId": userId,
		    "todoId": todoId
		  }
		}).promise()
	}

	async deleteTodoItemAttachment(bucketKey: string): Promise<void> {
	    await this.s3.deleteObject({
	      Bucket: this.bucketName,
	      Key: bucketKey
	    }).promise()
	  }
}
