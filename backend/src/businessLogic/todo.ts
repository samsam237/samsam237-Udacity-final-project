import { TodosAccess } from '../dataLayer/todosAccess'
import { AttachmentUtils } from '../helpers/attachmentUtils'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
//import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
//import * as createError from 'http-errors'

// TODO: Implement businessLogic
const logger = createLogger('TodosAcces')
const attachmentUtils = new AttachmentUtils()
const todosAcces = new TodosAccess()

// write todo functions
export async function createTodo (
	newTodo: CreateTodoRequest,
	userId: string
): Promise<TodoItem> {
	logger.info('Create todo function called')

	const todoId = uuid.v4()
	const createdAt = new Date().toISOString()
	const s3AttachementUrl = attachmentUtils.getAttachmentUrl(todoId)
	const newItem = {
		userId,
		todoId,
		createdAt,
		done:false,
		attachmentUrl: s3AttachementUrl,
		...newTodo
	}

	return await todosAcces.createTodoItem(newItem)
}