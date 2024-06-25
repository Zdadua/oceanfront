## build后dist文件中的index.html为空白

- 没有在vite.config.js中设置base；
```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: './', // 设置资源引用路径
})
```

- 如果不希望在服务器端配置路由，需要将history改为createWebHashHistory()；
```js
const router = createRouter({
    history: createWebHashHistory(),
    routes,
})
```
## 内容为空的标签渲染后不见了
- 为该标签加上v-if="true"即可；

## 多组件之间复杂的通信
使用Vuex解决的问题，我们可以使用Vuex自定义状态仓库，用于存储不同部分的状态，目录结构可以如下：
```
├── store
      └ index.js // createStore在此处
      └ modules // 此处存放各个模块的state、mutations、actions等
           └ moduleA.js
           └ moduleB.js
           ......
```