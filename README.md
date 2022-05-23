
# 介绍

该框架面向未来Web端交互趋势, 提供了常见问题的解决模块, 吸收了DomToWebGL的设计理念, 并结合我们提出的“对空间按需渲染”原则进行渲染, 以此满足大规模3D渲染需要, 达到性能和画面质感的完美平衡.
引入了“按层配置材质”技术, 可以轻松对材质进行配置. 深入材质底层渲染原理, 对材质进行了二次开发,
在材质精细度和材质层的配合上进行了调整, 一切设计均是对未来Web端视觉体验的大胆探索...

# 安装



推荐使用 npm 的方式安装，它能更好地和 webpack 打包工具配合使用。

```
npm i dream-fields --save
```



# 开始
我们可以导入 dream-fields 依赖以完成入门案例, 在这个例子中, 使用了FBO调试器以助于我们对渲染流程中的每个阶段进行观察,
使用了抗锯齿优化方案, 以完成性能与画质的平衡. 
[查看在线演示](https://vticn-almighty.github.io/demo/start/)

```js

import * as THREE from 'three'
import * as DF from 'dream-fields'
import SMAA from 'dream-fields/Utils/SMAA'
import { createMaterialByLayers } from 'dream-fields/core/Tool'

export class APP {

    constructor() {
        this.resources = new DF.Resources()
        this.controller = new DF.Controller({
            canvas: document.querySelector('#canvas'),
            // pixelRatio: window.devicePixelRatio, //todo 常规设置,画质最佳但性能低
            pixelRatio: Math.max(1.0, window.devicePixelRatio * 0.8), //todo 限制像素比以降低计算量,提高性能
            control: true,
            debugFBO: true
        })

        this.controller.work = true; //todo 总渲染许可,通常在资源加载完成后执行以开始渲染

        // todo 初始化高性能抗锯齿, 限制像素比能提高性能但是造成画面锯齿问题, 通过抗锯齿以减轻负面影响
        this.smaa = new SMAA({
            renderer: this.controller.renderer,
        });
        this.smaa.resize(this.controller.resolution);

        // todo 设置后期处理渲染管线, 在这里对最终画面进行抗锯齿处理
        this.controller.postProcessingPipeline = () => {
            this.smaa.render(this.controller.branchRenderingMergeTarget)
        }

        // todo 设置帧缓冲对象调试, 查看渲染每个阶段的输出
        this.controller.setFBODebug(this.controller.branchRenderingMergeTarget, '空间合并')
        this.controller.setFBODebug(this.smaa.renderTargets.rt1, '边缘提取')
        this.controller.setFBODebug(this.smaa.renderTargets.rt2, '边缘权重')

        // todo 初始化渲染空间, 可根据需要选择需要渲染的空间进行渲染, 最终会合并各个空间的渲染结果, 以此避免冗余渲染, 降低GPU计算量
        let space = new DF.Space({
            name: 'space',
            deep: 10
        })

        let geo = new THREE.BoxBufferGeometry(1, 1, 1); // todo 初始化几何体

        let mat = createMaterialByLayers({ // todo 根据层配置初始化材质
            "layers": [
                {
                    "fi": 0,
                    "data": {
                        "category": "phong",
                        "specular": {
                            "r": 0.2,
                            "g": 0.2,
                            "b": 0.2
                        },
                        "shininess": 10,
                        "type": "light",
                        "alpha": 1,
                        "visible": true,
                        "mode": 0
                    },
                    "id": "l1"
                },
                {
                    "fi": 1,
                    "data": {
                        "type": "color",
                        "alpha": 1,
                        "visible": true,
                        "mode": 0,
                        "color": {
                            "r": 0.6789478155339804,
                            "g": 0.9999999999999999,
                            "b": 0.41413834951456313
                        }
                    },
                    "id": "l2"
                }
            ],
            "name": "My Material"
        });

        // todo 将几何体和材质融合, 然后添加到空间
        let box = new THREE.Mesh(geo, mat);
        space.scene.add(box);

        // todo 添加光源
        let al = new THREE.DirectionalLight(0xffffff, .7);
        al.position.set(10, 10, 10)
        space.scene.add(al)
        space.scene.add(new THREE.AmbientLight(0xffffff, .6))

        // todo 设置空间渲染管线, 当空间拥有渲染许可时, 执行该渲染管线
        space.renderSpace = () => {
            this.controller.renderer.render(space.scene, this.controller.cameras.perspective);
        }

        // todo 执行空间中的物体需要的动画
        space.animate = (time) => {
            box.rotateX(Math.sin(time * 0.0001))
            box.rotateZ(Math.sin(time * 0.0001))
        }

        this.controller.allowRender.add('space'); // todo 给空间添加渲染许可
        this.controller.addSpace(space); // todo 将空间添加至全局空间
        this.controller.setFBODebug(space.output, '空间'); // todo 对空间输出的画面进行查看, 由于该渲染阶段没有进行抗锯齿后期处理, 所以物体边缘有锯齿现象

    }

}

window.addEventListener('load', () => {

    let app = new APP();

});
```

## 如何使用DOMMesh创建特效元素
我们需要一个html元素作为特效元素的基础,在这个最简案例中,我们的div提供了基本的位置尺寸信息,随后我们的DOMMesh模块将根据getBoundingClientRect获取这些信息,然后通过顶点着色器将平面几何与该div吻合,随后开发者可以根据需要编写着色器程序,满足各种效果需求.
[查看在线演示](https://vticn-almighty.github.io/demo/DOMMeshStart/)

让我们写一点简单的html:
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DOMMesh测试</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body,
        html {
            width: 100%;
            height: 100%;
        }

        #canvas {
            top: 0;
            z-index: -1;
            position: fixed;
            width: 100%;
            height: 100%;
            overflow: hidden;
            touch-action: none;
        }

        .item {
            width: 200px;
            height: 200px;
        }

        #meshElement1{
            position: absolute;
            margin: auto;
            left: -25%;
            right: -25%;
            top: -25%;
            bottom: -25%;
        }
    </style>
</head>

<body>
    <canvas id="canvas"></canvas>
    <div id="meshElement1" class="item">
        <div class="item-inner"></div>
    </div>
    <script src="./index.js" type="module"></script>
</body>

</html>
```

然后写一点脚本程序:
```js
import * as DF from 'dream-fields'
import { DOMMesh } from 'dream-fields/core/DOMMesh'
export class APP {

    constructor() {

        this.domMesh = []; //? 存储DOMMesh的数组, 渲染时需要刷新其中的每个数组
        this.uniforms = {  //? 片段着色器的扩展属性(框架中自带了基本属性)
            time: {
                value: 0   //? 我们只需要“时间”属性来参与图形计算
            }
        };

        this.controller = new DF.Controller({
            canvas: document.querySelector('#canvas'),
            pixelRatio: Math.max(1.0, window.devicePixelRatio * 0.8), //todo 限制像素比以降低计算量,提高性能
            control: true,
            debugFBO: true
        })

        this.controller.work = true;
        let space = new DF.Space({
            name: 'space',
            deep: 10
        })

        space.renderSpace = () => {
            this.controller.renderer.render(space.scene, this.controller.cameras.perspective);
        }

        space.animate = (time) => {
            // todo 刷新DOMMesh着色器的时间属性
            this.uniforms.time.value = space.time * 0.001;
            for (let i = 0; i < this.domMesh.length; i++) {
                this.domMesh[i].update();// todo 刷新DOMMesh着色器的基本属性
            }
        }

        this.controller.allowRender.add('space');
        this.controller.addSpace(space);

        let dom1 = document.querySelector('#meshElement1')
        if (dom1) {

            this.domMesh.push(
                new DOMMesh(dom1, {
                    // todo 编写片段着色器
                    fragmentShader: /*glsl*/`
                    uniform float time;
                    varying vec2 vUv;
                    void main( void ) {
                        vec3 c;
                        float l,z=time;
                        for(int i=0;i<3;i++) {
                            vec2 uv,p=vUv;
                            uv=p;
                            p-=.5;
                            z+=.07;
                            l=length(p);
                            uv+=p/l*(sin(z)+1.)*abs(sin(l*9.-z-z));
                            c[i]=.01/length(mod(uv,1.)-.5);
                        }
                        gl_FragColor=vec4(c/l,time);
                    }
                    `,
                    // todo 添加关于这个着色器的属性
                    uniforms: this.uniforms,
                })
            );
        }
        // todo 向空间依次添加 DOMMesh
        for (let i = 0; i < this.domMesh.length; i++) {
            space.scene.add(this.domMesh[i]);
        }
    }
}

window.addEventListener('load', () => {

    let app = new APP();

});

```


# 案例(点击图片查看)
[
![案例1](https://images.gitee.com/uploads/images/2022/0424/115633_b5ba99ef_5351174.jpeg "1a.jpg")
](https://vticn-almighty.github.io/demo/demo1)

[
![案例2](https://images.gitee.com/uploads/images/2022/0424/115825_dc09d9aa_5351174.jpeg "2a.jpg")
](https://vticn-almighty.github.io/demo/demo2)


# 高阶案例(点击图片查看)
### 1.极地列车
使用点云冲击波 + DOMMesh + 故障后处理 + 追踪鼠标轨迹产生色散扭曲的方案制作的全特效单页面,点云素材来自sketchfab, 技术参考了[短论文](https://medium.com/epicagency/behind-the-scenes-of-we-cargo-3999f5f559c).需要注意,由于本案例使用的点云文件较大,所以请耐心等待加载,此外可以在该网页地址栏后输入 #debug 来开启debug测试模式.你可以拖动和缩放点云观察其细节.



[![输入图片说明](preview/polar_train.png)](https://vticn-almighty.github.io/demo/polar_train)


