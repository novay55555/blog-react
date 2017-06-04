# API文档
此文档为`/api/api.js`所编写的所有API的详尽描述, 包括API功能, 所需参数及参数类型, 返回结果包含的`key`键. `/qa/test-api.js`为API单元测试文件, 包含大部分API的单元测试**(后面有些新增的API偷懒没写=. =)**, 此单元测试使用[Chai](http://chaijs.com/)的`tdd`模式. 现针对此文档作如下约定:
- 用`baseUrl`替代`协议名` + `host`, 如`http://example.com`, 测试时候请在`/qa/test-api.js`中根据不同环境设定变量`baseUrl`
- 文档所有API返回值默认均以成功的情况进行说明(大部分`code`为1, 少部分直接跳转), 失败的情况, 请参考**附录**

[TOC]
### 登录
用户登录帐号

方法: `POST`

URL: `baseUrl/api/login`

参数: 

|    参数    |    必选    |    类型    |    说明    |
| :-:       |        :-: |       :-: |        :-:|
|name|yes|String|用户账号名|
|password|yes|String|用户账号密码|

返回值:

```javascript
{ "code": 1 }
```

### 登出
用户退出帐号

方法: `GET`

URL: `baseUrl/api/signup`

参数: 无

返回值:

```javascript
{ "code": 1 }
```

### 注册
用户注册帐号

方法: `POST`

URL: `baseUrl/api/register`

参数:

|    参数    |    必选    |    类型    |    说明    |
| :-:       |        :-: |       :-: |        :-:|
|name|yes|String|用户账号名|
|password|yes|String|用户账号密码|
|email|no|String|用户邮箱|

返回值: 

```javascript
{
    "code": 1,
    userId: user._id  // 用户id
}
```

### 发表文章
发表一篇文章

方法: `POST`

URL: `baseUrl/api/article-publish`

参数:

|    参数    |    必选    |    类型    |    说明    |
| :-:       |        :-: |       :-: |        :-:|
|title|yes|String|文章标题|
|author|yes|String|作者|
|date|yes|Number|时间戳|
|description|yes|String|文章描述|
|articleType|yes|String|文章分类|
|content|yes|String|文章内容|

返回值: 无, 表单跳转路由`/admin/ctrl-article`

### 编辑文章
编辑一篇已发表的文章

方法: `POST`

URL: `baseUrl/api/article-publish/id`

参数:

|    参数    |    必选    |    类型    |    说明    |
| :-:       |        :-: |       :-: |        :-:|
|id|yes|Number|文章的id(注: 这里的id是后台渲染的, 但是写测试的时候, 必须把id加上, api才能响应成功)|
|title|yes|String|文章标题|
|author|yes|String|作者|
|date|yes|Number|时间戳|
|description|yes|String|文章描述|
|articleType|yes|String|文章分类|
|content|yes|String|文章内容|

返回值: 无, 表单跳转路由`/admin/ctrl-article`

### 删除文章
删除一篇已发表的文章

方法: `GET`

URL: `baseUrl/api/article-delete/id`

参数: 

|    参数    |    必选    |    类型    |    说明    |
| :-:       |        :-: |       :-: |        :-:|
|id|yes|Number|文章的id|

返回值:
```javascript
{ "code": 1 }
```

### 编辑用户密码, 邮箱
编辑某个用户的密码和邮箱

方法: `POST`

URL: `baseUrl/api/user-edit`

参数:

|    参数    |    必选    |    类型    |    说明    |
| :-:       |        :-: |       :-: |        :-:|
|id|yes|Number|用户id|
|password|yes|String|用户密码|
|email|yes|String|用户邮箱|

返回值:
```javascript
{ "code": 1 }
```

### 删除用户
删除某个用户

方法: `GET`

url: `api/user-delete/id`

参数:

|    参数    |    必选    |    类型    |    说明    |
| :-:       |        :-: |       :-: |        :-:|
|id|yes|Number|用户id|

返回值:
```javascript
{ "code": 1 }
```


### 加载更多文章(首页)
在首页点击**加载更多**按钮, 显示更多的文章

方法: `GET`

URL: `baseUrl/api/load-more-article/times`

参数:

|    参数    |    必选    |    类型    |    说明    |
| :-:       |        :-: |       :-: |        :-:|
|times|yes|Number|点击加载更多按钮的次数|

返回值:
```javascript
{
  "code": 1,
  "content": [  // 文章数组, 最多有10个元素
    {
      "_id": 35,  // 文章id
      "title": "123",  // 标题
      "author": "admin",  // 作者
      "date": 1460947573693,  // 文章发表或修改后的时间戳
      "description": "测试描述描述",  // 文章描述
      "articleType": "javascript",  // 文章类型
      "content": "测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容",  // 文章内容
      "__v": 0  // mongo存储的键值, 没卵用, 忽略就可以了
    }
  ]
}
```

### 加载更多文章(搜索结果页)
在搜索结果页面点击**加载更多**按钮, 显示更多与搜索结果相关的文章

方法: `GET`

URL: `baseUrl/api/load-more-article/type/typeContent/times`

参数:

|    参数    |    必选    |    类型    |    说明    |
| :-:       |        :-: |       :-: |        :-:|
|type|yes|String|搜索的类型|
|typeContent|yes|String|搜索类型的值|
|times|yes|Number|点击加载更多按钮的次数|

返回值:
```javascript
{
  "code": 1,
  "content": [
    {
      "_id": 35,  // 文章id
      "title": "123",
      "author": "admin",
      "date": 1460947573693,
      "description": "测试描述描述",
      "articleType": "javascript",
      "content": "测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容",
      "__v": 0  // mongo存储的键值, 没卵用, 忽略就可以了
    }
  ]
}
```

### 加载更多用户
在后台用户管理, 点击加载更多按钮, 显示更多的用户

方法: `GET`

URL: `baseUrl/api/load-more-user/times`

参数:

|    参数    |    必选    |    类型    |    说明    |
| :-:       |        :-: |       :-: |        :-:|
|times|yes|Number|点击加载更多按钮的次数|

返回值:
```javascript
{
  "code": 1,
  "content": [  // 用户数组, 最多10个元素
    {
      "_id": 18,  // 用户id
      "name": "user61434",  // 用户名
      "password": "123456",  // 密码
      "email": "",  // 邮箱
      "role": 1,  // 用户类型, 0为管理员, 1为普通用户
      "__v": 0  // mongo存储的键值, 没卵用, 忽略就可以了
    }
  ]
}
```

### 搜索用户
在后台用户管理, 通过输入框输入用户名, 模糊查找带有输入值的用户

方法: `GET`

URL: `baseUrl/api/search-user/name`

参数:

|    参数    |    必选    |    类型    |    说明    |
| :-:       |        :-: |       :-: |        :-:|
|name|yes|String|要搜索的用户名|

返回值:
```javascript
{
  "code": 1,
  "content": [  // 用户数组
    {
      "_id": 18,  // 用户id
      "name": "user61434",  // 用户名
      "password": "123456",  // 密码
      "email": "",  // 邮箱
      "role": 1,  // 用户类型, 0为管理员, 1为普通用户
      "__v": 0  // mongo存储的键值, 没卵用, 忽略就可以了
    }
  ]
}
```

### 搜索文章
在后台文章管理, 通过输入框输入文章标题, 模糊查找带有输入值的文章

方法: `GET`

URL: `baseUrl/api/search-article/name`

参数:

|    参数    |    必选    |    类型    |    说明    |
| :-:       |        :-: |       :-: |        :-:|
|name|yes|String|要搜索的文章标题|

返回值:
```javascript
{
  "code": 1,
  "content": [
    {
      "_id": 35,  // 文章id
      "title": "123",
      "author": "admin",
      "date": 1460947573693,
      "description": "测试描述描述",
      "articleType": "javascript",
      "content": "测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容",
      "__v": 0  // mongo存储的键值, 没卵用, 忽略就可以了
    }
  ]
}
```

### 修改管理员帐号
在博客管理, 修改管理员帐号

方法: `GET`

URL: `/api/change-admin-account/name`

参数:

|    参数    |    必选    |    类型    |    说明    |
| :-:       |        :-: |       :-: |        :-:|
|name|yes|String|新的帐号|

返回值
```javascript
{code: 1}
```

### 修改管理员密码
在博客管理, 修改管理员密码

方法: `POST`

URL: `/api/change-admin-password/`

参数:

|    参数    |    必选    |    类型    |    说明    |
| :-:       |        :-: |       :-: |        :-:|
|password|yes|String|新的密码|

返回值
```javascript
{code: 1}
```

### 新增文章类型
在博客管理, 点击`+`按钮, 输入要新增的文章类型

方法: `GET`

URL: `/api/add-article-type/id/name`

参数:

|    参数    |    必选    |    类型    |    说明    |
| :-:       |        :-: |       :-: |        :-:|
|id|yes|String|保存所有文章类型数据的id|
|name|yes|String|新的帐号|

返回值
```javascript
{
  "code": 1,
  "content": [ // 文章类型
    "javascript",
    "nodejs",
    "css",
    "python"
  ]
}
```

### 删除文章类型
在博客管理, 点击`-`按钮, 输入要删除的文章类型

方法: `GET`

URL: `/api/del-article-type/id/name`

参数:

|    参数    |    必选    |    类型    |    说明    |
| :-:       |        :-: |       :-: |        :-:|
|id|yes|String|保存所有文章类型数据的id|
|name|yes|String|新的帐号|

返回值
```javascript
{
  "code": 1,
  "content": [
    "javascript",
    "nodejs",
    "css"
  ]
}
```

## 附录
若API功能实现不成功, 返回`code`值为0, 格式如下
```javascript
{
    "code": 0,
    "msg": "错误的信息"
}
```