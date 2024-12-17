# KingStudy

这是一个无需服务器的个人主页网站系统，包含博客系统、项目展示、课程展示、照片墙展示等等功能。该网站基于 <a href="https://www.t1y.net/" target="_blank">T1 后端云</a> `Serverless` 技术构建采用 Web 技术有（<a href="https://vuejs.org/" target="_blank">Vue3</a> / <a href="https://vitejs.dev/" target="_blank">Vite5</a> / <a href="https://www.typescriptlang.org/" target="_blank">TypeScript</a> / <a href="https://www.mongodb.com/" target="_blank">MongoDB</a> / <a href="https://element-plus.org/" target="_blank">Element Plus</a>）.

-   <a href="./README.md">English</a>
-   <a href="https://kingstudy.vip/">预览</a>

![alt Preview](./public/preview.png)

## 使用

```bash
cd kingstudy && npm install
```

在使用前，您应当前往 <a href="https://www.t1y.net/" target="_blank">T1 后端云</a> 注册一个账号并创建一个应用。然后在项目根目录下创建一个 `.env` 文件，并替换以下内容：

```env
# Web 服务端口
VITE_APP_PORT = 5173
# 反向代理路径
VITE_APP_BASE_API = '/api'
# 您的 Application ID
VITE_APP_APP_ID = '1001'
# 您的 API Key
VITE_APP_API_KEY = '***************'
# 您的 Secret Key
VITE_APP_SECRET_KEY = '***************'
# 您的T1后端云域名（生产环境下，我建议你将域名替换为你自己的域名）
VITE_APP_T1_CLOUD_SERVICE_DOMAIN = 'https://api.t1y.net'
```

### 运行

```bash
npm run dev
```

### 打包&构建

```bash
npm run build
```

### Nginx 伪静态

```nginx
location / {
	try_files $uri $uri/ /index.html;
}
```

### music 云函数

在 <a href="https://www.t1y.net/" target="_blank">T1 后端云</a> 云函数页面新建一个名为 `music` 的云函数，用于返回随机网易云音乐。

```json
{
    "link": 493276208,
    "name": "Simple Song"
}
```

```js
function main() {
    if (!ctx.sign()) {
        return JSON.stringify({
            code: 400,
            message: 'Signature verification failed',
            data: null,
        })
    }
    const result = db.collection('musics').aggregate([{ $sample: { size: 1 } }])
    if (result == null) {
        return JSON.stringify({
            code: 500,
            message: 'Internal server error',
            data: null,
        })
    }
    return JSON.stringify({ code: 200, message: 'ok', data: result[0] })
}
```

### share 云函数

在 <a href="https://www.t1y.net/" target="_blank">T1 后端云</a> 云函数页面新建一个名为 `share` 的云函数，用于验证发布帖子。

```js
function main() {
    ctx.setHeader('Content-Type', 'application/json')
    if (!ctx.sign()) {
        return JSON.stringify({
            code: 400,
            message: 'Signature verification failed',
            data: null,
        })
    }
    if (ctx.query('token') != tool.md5('123456')) {
        // 管理员密码123456
        return JSON.stringify({
            code: 400,
            message: 'Invalid password',
            data: null,
        })
    }
    let objectId = db
        .collection('archives')
        .createOne(JSON.parse(ctx.getBody()))
    if (objectId == null) {
        return JSON.stringify({
            code: 500,
            message: 'Internal server error',
            data: null,
        })
    }
    return JSON.stringify({ code: 200, message: 'Share Success', data: null })
}
```

### edit 云函数

在 <a href="https://www.t1y.net/" target="_blank">T1 后端云</a> 云函数页面新建一个名为 `edit` 的云函数，用于编辑已发布的帖子。

```js
function main() {
    ctx.setHeader('Content-Type', 'application/json')
    if (!ctx.sign()) {
        return JSON.stringify({
            code: 400,
            message: 'Signature verification failed',
            data: null,
        })
    }
    if (ctx.query('token') != tool.md5('123456')) {
        // 管理员密码123456
        return JSON.stringify({
            code: 400,
            message: 'Invalid password',
            data: null,
        })
    }
    let objectId = db
        .collection('archives')
        .updateOne(
            { _id: db.toObjectID(ctx.query('id')) },
            { $set: JSON.parse(ctx.getBody()) },
        )
    if (objectId == null) {
        return JSON.stringify({
            code: 500,
            message: 'Internal server error',
            data: null,
        })
    }
    return JSON.stringify({
        code: 200,
        message: 'Successfully modified',
        data: null,
    })
}
```

### ai_write 云函数

在 <a href="https://www.t1y.net/" target="_blank">T1 后端云</a> 云函数页面新建一个名为 `ai_write` 的云函数，用于接入 <a href="https://platform.moonshot.cn/" target="_blank">Moonshot AI（Kimi AI）</a> 开放平台智能写作。

```js
function main() {
    ctx.setHeader('Content-Type', 'application/json')
    if (!ctx.sign()) {
        return JSON.stringify({
            code: 400,
            message: 'Signature verification failed',
            data: null,
        })
    }
    const token = 'sk-xxx' // 你的 Kimi AI 开放平台 token
    const model = 'moonshot-v1-32k' // model（8k-32k-128k）
    const prompt =
        '你是 KingAI，由 KingStudy 提供的人工智能写作助手，你更擅长从第一人称（作者）视角编写中文和英文的文章（Blog）。你会为用户提供安全、详细、有帮助且准确的文章。接下来我会提供文章标题给你，你只需要根据文章标题撰写该文章的内容并返回 Markdown 格式即可。'
    const temperature = 0.3
    const title = JSON.parse(ctx.getBody()).title
    if (title == '') {
        return JSON.stringify({
            code: 400,
            message: 'The title can not be blank',
            data: null,
        })
    }
    let data = {
        model: model,
        messages: [
            { role: 'system', content: prompt },
            { role: 'user', content: title },
        ],
        temperature: 0.3,
    }
    const resp = http.send(
        'POST',
        'https://api.moonshot.cn/v1/chat/completions',
        {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        JSON.stringify(data),
    )
    if (resp == null) {
        return JSON.stringify({
            code: 500,
            message: 'Internal server error',
            data: null,
        })
    }
    if (resp.statusCode != 200) {
        return JSON.stringify({
            code: 500,
            message: 'Internal server error',
            data: null,
        })
    }
    return JSON.stringify({
        code: 200,
        message: 'Writing successfully',
        data: { content: JSON.parse(resp.body).choices[0].message.content },
    })
}
```

### Archives

发布一篇帖子你只需要在 T1 后端云 `archives` 集合中添加以下类型数据即可（也可以通过访问 `/archives/add` 进行发布）：

-   title 文章标题
-   preview 预览图地址
-   tag 标签
-   description 摘要
-   content 正文内容
-   views 浏览次数

```json
{
    "content": "Welcome to KingStudy! This is your very first post. Check documentation to learn how to use.",
    "description": "Welcome to KingStudy! This is your very first post. Check documentation to learn how to use.",
    "preview": "https://api.t1y.net/storage/1500/photos/archives/hello-world.png",
    "tag": ["Web", "Server", "Developer"],
    "title": "Hello, World!",
    "views": 73
}
```

### Projects

发布一个项目你只需要在 T1 后端云 `projects` 集合中添加以下类型数据即可：

-   title 项目名称
-   preview 预览图地址
-   tag 标签
-   description 简介
-   url 项目地址

```json
{
    "description": "采用 Go 语言编写的简易且强大的 Web 服务器应用！这是介于 Node.js、Deno 之外的又一个 JS Runtime 项目。",
    "preview": "https://api.t1y.net/storage/1500/photos/screenshot/jsxpress.png",
    "tag": ["Web", "Server", "Developer"],
    "title": "JSXpress",
    "url": "/pages/jsxpress"
}
```

### Courses

```typescript
interface Course {
    preview: string
    title: string
    tag: string[]
    url: string
    description: string
}
```

### Photos

发布一张照片你只需要在 T1 后端云 `photos` 集合中添加以下类型数据即可：

-   location 拍摄地点
-   preview 图片地址
-   title 标题

```json
{
    "location": "Yunnan",
    "preview": "https://api.t1y.net/storage/1500/photos/camera/sky.jpg",
    "title": "Sky"
}
```

## 请我喝杯咖啡

![alt QR-Code](./src/assets/qr_code.png)
