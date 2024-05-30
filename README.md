# KingStudy

This is a personal homepage website system that does not require a server, including a blog system, project display, course display, photo wall display and other functions. The website is built based on <a href="https://www.t1y.net/" target="_blank">T1 Backend Cloud</a> `Serverless` technology and uses Web technologies (Vue3 / Vite5 / TypeScript / MongoDB / Element Plus).

-   <a href="./README-zh-CN.md">中文简体</a>
-   <a href="https://kingstudy.vip/">Preview</a>

![alt Preview](./public/preview.png)

## Use

Before use, you should go to <a href="https://www.t1y.net/" target="_blank">T1 Backend Cloud</a> to register an account and create an application. Then create a `.env` file in the project root directory and replace the following content:

```env
# Your Application ID
VITE_APP_APP_ID = '1001'
# Your API Key
VITE_APP_API_KEY = '***************'
# Your Secret Key
VITE_APP_SECRET_KEY = '***************'
# Your T1 backend cloud domain name (In a production environment, I recommend that you replace the domain name with your own domain name)
VITE_APP_T1Y_API = 'https://api.t1y.net'
```

### share Cloud Function

On the <a href="https://www.t1y.net/" target="_blank">T1 Backend Cloud</a> Cloud Function page, create a cloud function named `share` to verify the post.

```js
function main() {
    ctx.setHeader('Content-Type', 'application/json')
    if (ctx.query('token') != tool.md5('123456')) {
        // Admin password -> 123456
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

### Archives

To publish a post you only need to add the following types of data to the T1 backend cloud `archives` collection (you can also publish by accessing `/archives/add`):

-   title article title
-   preview preview image address
-   tag tag
-   description summary
-   content body content
-   views number of views

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

To publish a project, you only need to add the following types of data to the T1 backend cloud `projects` collection:

-   title project name
-   preview preview image address
-   tag label
-   description introduction
-   url project address

```json
{
    "description": "A simple and powerful web server application written in Go language! This is another JS Runtime project besides Node.js and Deno. ",
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

To publish a photo, you only need to add the following types of data to the T1 backend cloud `photos` collection:

-   location shooting location
-   preview image address
-   title title

```json
{
    "location": "Yunnan",
    "preview": "https://api.t1y.net/storage/1500/photos/camera/sky.jpg",
    "title": "Sky"
}
```

## Run

```bash
npm run dev
```

## Packaging & Building

```bash
npm run build
```

## Buy me a coffee

![alt QR-Code](./src/assets/qr_code.png)
