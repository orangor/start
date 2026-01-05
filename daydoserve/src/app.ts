import 'reflect-metadata'
import './config/env'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import swaggerUi from 'swagger-ui-express'
import path from 'path'
import cookieParser from 'cookie-parser'
// import { initializeDatabase } from './database/init'
import routes from './routes'
import errorHandler from './middleware/errorHandler'
import logger from './utils/logger'
import { getSpecs, updatePaths } from './config/swagger'
import { DocGenerator } from './utils/docGenerator'
import { RouteScanner } from './utils/routeScanner'
import { RouteRegistrar } from './utils/routeRegistrar' // 新增
import { xssMiddleware } from './middleware/xss.middleware'
import { csrfMiddleware } from './middleware/csrf.middleware'
import { helmetConfig } from './config/helmet.config'
import { corsOptions } from './config/cors.config'
import { swaggerUiOptions } from './config/swagger'

const app = express()

// 安全头部设置
app.use(helmet(helmetConfig))

// 2. CORS 配置（要在 CSRF 之前）
app.use(cors(corsOptions))

// 3. 解析请求体
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser()) // CSRF 需要
app.use(xssMiddleware) // 添加 XSS 中间件

// 4. 速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
})
app.use(limiter)

// 1. 先添加日志中间件
app.use((req, res, next) => {
  next()
})

// 2. 再添加 CSRF 中间件
app.use(csrfMiddleware)

// 6. 传统路由
app.use('/api', routes)

// 7. 装饰器路由（HBSCX等）- 修正：直接注册到根路径
const decoratorRoutes = RouteRegistrar.registerControllers(path.join(__dirname, 'controllers'))
app.use('/', decoratorRoutes)

// 8. 错误处理（始终放在最后）
app.use(errorHandler)

// 1. 扫描路由
RouteScanner.scanControllers(path.join(__dirname, 'controllers'))

// 2. 获取生成的路径
const paths = DocGenerator.getPaths()

// 3. 更新 Swagger 配置
updatePaths(paths)

// 4. 获取完整的 Swagger 规范
const specs = getSpecs()

// 5. 设置 Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerUiOptions))

const PORT = process.env.PORT || 8000

const startServer = async () => {
  try {
    // await initializeDatabase()

    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`)
      logger.info(`API documentation available at http://localhost:${PORT}/api-docs`)
    })
  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()

export default app
