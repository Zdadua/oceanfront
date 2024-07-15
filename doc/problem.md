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

## 关于侧栏显示内容
1. 表格: 整年该点海表温度；历年同一天该点温度
   1. 
2. 捕鱼等信息
3. 对比

## 2024-07-12-00:30
1. 侧栏表格部分，对折线运用从左到右画出的过渡动画，跟随鼠标tips的样式修改；
2. Openlayers部分：
   1. 地图左右无限延伸，导致dotFeature在多份地图上都会显示，而overlay只显示一份；
   2. 地图左右无限延伸，导致回到中心点只会回到最中间的那副地图的中心；
   3. 洋流 & 海浪
3. UI部分
   1. 鼠标当前所在位置的坐标显示在左上角；
   2. 标题样式需要修改成较显眼的，缩短标题长度；
   3. 日历组件滚动部分，为上下设置虚化，日历grid部分需要点击两次才能刷新是为什么；
   4. 时间轴；

## 2024-07-14-14:28
1. 侧栏二维表已制作完成；


## 2024-07-15-20:34
1. 系统功能陈述
   1. 展示历年任意时间(到小时)的海温数据
   2. 展示海温预测信息
   3. 根据经纬度获取该点的精确数据

2. 可添加功能
   1. 洋流&风场的展示
   2. 热浪的预测
   3. 对于某确定区域的信息对比和统计


## 需求
1. 风场与海浪的粒子效果
2. 地图选区
3. rightPopup左右点击切换
4. rightPopup历年同点数据表格
5. rightPopup提供对比
6. 时间轴
7. aboutus界面美化
8. 三维?
9. 健全搜索框
10. 二维表对于预测的区别展示