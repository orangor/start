import path from 'path'
import dotenv from 'dotenv'
import db from '../../config/database'
import logger from '../../utils/logger'

// 确保加载环境变量
dotenv.config({ path: path.join(__dirname, '../../../.env') })

const executeMigration = async (): Promise<void> => {
  try {
    logger.info('Starting migration...')

    // 先检查列是否存在
    const [columns] = await db.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'users' 
      AND TABLE_SCHEMA = '${process.env.DB_NAME}'
    `)

    const existingColumns = new Set((columns as any[]).map((col) => col.COLUMN_NAME))

    // 需要添加的列
    const columnsToAdd = []

    if (!existingColumns.has('email_verified')) {
      columnsToAdd.push('ADD COLUMN email_verified BOOLEAN DEFAULT FALSE')
    }
    if (!existingColumns.has('verification_token')) {
      columnsToAdd.push('ADD COLUMN verification_token VARCHAR(255)')
    }
    if (!existingColumns.has('reset_token')) {
      columnsToAdd.push('ADD COLUMN reset_token VARCHAR(255)')
    }
    if (!existingColumns.has('reset_token_expires')) {
      columnsToAdd.push('ADD COLUMN reset_token_expires TIMESTAMP NULL')
    }

    if (columnsToAdd.length > 0) {
      await db.execute(`
        ALTER TABLE users
        ${columnsToAdd.join(', ')}
      `)
    }

    logger.info('Migration executed successfully')
    process.exit(0)
  } catch (error) {
    logger.error('Migration failed:', error)
    process.exit(1)
  }
}

executeMigration()
