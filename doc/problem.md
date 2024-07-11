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

## 预热常用资源
为了防止因为中间文件的转换导致的瀑布，可以先预热常用的文件；
```js
// vite.config.js
export default defineConfig({
    server: {
        warmup: {
            clientFiles: [
                './src/components/aboutUs/TextCube.vue',
                //...
            ],
        }
    }
})
```

## 如何防止在dom元素未渲染时获取属性错误
1. 在nextTick(() => {}) 在这里编写逻辑；
2. 使用ref获取元素，并且使用if(domElement.value)进行判断

## 亟需解决的需求
1. 地区名称标注
2. 时间轴制作(以天为准)
3. aboutus页面下方的文本部分编写我们的升值部分
4. 日历外观完善
5. 需要展示什么升值信息？ 将预测经度加到标签中
6. 隐藏控件按钮

## 关于侧栏显示内容
1. 表格: 整年该点海表温度；历年同一天该点温度
   1. 
2. 捕鱼等信息
3. 对比