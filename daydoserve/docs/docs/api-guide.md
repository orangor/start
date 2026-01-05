## API 开发指南

---

### 1. 项目结构

项目结构清晰地分层，便于维护和扩展。

复制

```
src/
├── controllers/
│   ├── auth.controller.ts    // 认证相关
│   ├── user.controller.ts    // 用户相关
│   ├── task.controller.ts    // 任务相关
│   └── your-new.controller.ts  // 新功能的控制器
├── models/
│   ├── user.model.ts
│   ├── task.model.ts
│   └── your-new.model.ts  // 新的数据模型
├── services/
│   ├── auth.service.ts
│   ├── email.service.ts
│   └── your-new.service.ts  // 新的服务逻辑
└── types/
    ├── index.ts
    └── your-new.types.ts  // 新的类型定义
```

### 2. 接口开发流程

#### 2.1 接口设计

- **路径设计** ：`/api/{module}/{resource}`
- **HTTP 方法** ：
- GET：查询数据
- POST：创建数据
- PUT：更新数据
- DELETE：删除数据

#### 2.2 代码实现

1. **创建控制器**
   typescript

   复制

   ```
   @Post('/api/module/resource')
   static async createResource() {
     // 实现逻辑
   }
   ```

2. **添加 Swagger 文档**
   typescript

   复制

   ```
   @Post('/api/module/resource', '创建资源', '详细描述...')
   ```

3. **添加请求验证**
   typescript

   复制

   ```
   requestBody: {
     required: true,
     content: {
       'application/json': {
         schema: {
           type: 'object',
           properties: {
             // 属性定义
           }
         }
       }
     }
   }
   ```

#### 2.3 安全考虑

- 添加认证中间件
- 添加参数验证
- 处理错误情况
- 添加日志记录

#### 2.4 测试验证

1. **Curl 测试**
   bash

   复制

   ```
   curl -X POST "http://localhost:8000/api/module/resource" \
   -H "Authorization: Bearer token" \
   -H "Content-Type: application/json" \
   -d '{"key": "value"}'
   ```

2. **Swagger UI 测试**

   - 访问 `/api-docs`
   - 使用 Authorize 按钮添加 token
   - 测试接口

### 3. 代码规范

#### 3.1 命名规范

- **文件名** ：`{module}.controller.ts`
- **类名** ：`PascalCase`
- **方法名** ：`camelCase`
- **路由路径** ：`kebab-case`

#### 3.2 注释规范

typescript

复制

```
/**
 * 创建新资源
 * @param req 请求对象
 * @param res 响应对象
 * @returns Promise<void>
 */
```

### 4. 错误处理

typescript

复制

```
try {
  // 业务逻辑
} catch (error) {
  next(error)
}
```

### 5. 响应格式

typescript

复制

```
{
  success: boolean,
  message: string,
  data?: any
}
```

### 6. 检查清单

- 路由定义完整
- Swagger 文档完整
- 参数验证完整
- 错误处理完整
- 测试用例完整
- 跨域配置正确
- 认证逻辑正确
