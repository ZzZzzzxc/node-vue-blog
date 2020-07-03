# node-vue-blog
vue+express实现的小博客（原来那个弃坑了~~）

[管理端](https://admin.zhangxc.cn)

```js
cd admin
npm i
npm run serve

cd admin-server
npm i
npm run serve
```

管理系统建议用 [https://github.com/ZzZzzzxc/vue2-admin](https://github.com/ZzZzzzxc/vue2-admin) ，现在这个写的不太行，不好维护。。。

[博客端](https://blog.zhangxc.cn/home)

```js
cd web
npm i
npm run serve

cd web-server
npm i
npm run serve
```

第三方服务需要自行进行配置，修改一下key啊，id啊什么的就好了。
```js
/admin/.env.development 配置github登录重定向地址
/admin/.env.production  配置github登录重定向地址
/server-admin/plugins/githubLogin.js 配置github的id，密钥等
/server-admin/plugins/qiniuConfig.js 配置七牛云的accessKey，secretKey
```

后台管理第一次使用管理员权限需要配置github第三方登录，登录后即可添加账户。

