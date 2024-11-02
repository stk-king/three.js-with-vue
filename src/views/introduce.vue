<script setup>

</script>

<template>
  <div class="container" style="overflow:auto;">
      <h1 style="text-align: center;font-size: 30px">THREE.JS 实战教程</h1>
      <div style="width: 80%;margin: 0 auto;line-height: 40px">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;无论你是初学者还是有一定经验的开发者，我们的教程都能满足你的需求。从最基础的THREE.JS概念，到高级的3D场景和动画实现，我们的教程内容覆盖全面，帮助你稳步提升自己的3D开发技能。每一课都精心设计，让你在循序渐进的学习过程中不断积累知识和经验。<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;为了让你更好地理解和应用所学知识，我们提供了众多小案例。每一个案例都聚焦于特定的功能或效果，通过实际操作，你可以快速掌握THREE.JS的各种技巧。例如，
          你可以学会如何创建和操作几何体、材质、光源等，如何为3D场景添加动画和交互效果，如何加载和处理复杂的3D模型等。
          除了小案例，我们还设计了多个完整的实战项目。这些项目覆盖了从简单到复杂的各种应用场景，带你体验从零到一构建3D应用的全过程。
          在这些实战项目中，你不仅可以巩固所学知识，还能提升项目管理和问题解决的能力。这些项目将成为你展示自己技能的重要成果，也为你在实际开发中提供宝贵的参考。
          <br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;在我们开始前，让我们试着让你了解一下一个three.js应用的整体结构。一个three.js应用需要创建很多对象，并且将他们关联在一起。下图是一个基础的three.js应用结构。
      </div>
      <div class="box">
          <img src="@/assets/threejs-structure.svg" style="width: 600px">
      </div>
      <div style="width: 80%;margin: 0 auto;line-height: 40px">
          基础步骤
          <ul>
              <li>
                  首先有一个渲染器(Renderer)。这可以说是three.js的主要对象。你传入一个场景(Scene)和一个摄像机(Camera)到渲染器(Renderer)中，然后它会将摄像机视椎体中的三维场景渲染成一个二维图片显示在画布上。
              </li>
              <li>
                  其次有一个场景图 它是一个树状结构，由很多对象组成，比如图中包含了一个场景(Scene)对象 ，多个网格(Mesh)对象，光源(Light)对象，群组(Group)，三维物体(Object3D)，和摄像机(Camera)对象。一个场景(Scene)对象定义了场景图最基本的要素，并包了含背景色和雾等属性。这些对象通过一个层级关系明确的树状结构来展示出各自的位置和方向。子对象的位置和方向总是相对于父对象而言的。比如说汽车的轮子是汽车的子对象，这样移动和定位汽车时就会自动移动轮子。
              </li>
              <li>
                  创建相机，可以一个或多个，在基础案例中会讲到平常几种常用的相机。注意图中摄像机(Camera)是一半在场景图中，一半在场景图外的。这表示在three.js中，摄像机(Camera)和其他对象不同的是，它不一定要在场景图中才能起作用。相同的是，摄像机(Camera)作为其他对象的子对象，同样会继承它父对象的位置和朝向。
              </li>
              <li>
                  光源(Light)对象代表不同种类的光。
              </li>
              <li>
                  网格(Mesh)对象可以理解为用一种特定的材质(Material)来绘制的一个特定的几何体(Geometry)。材质(Material)和几何体(Geometry)可以被多个网格(Mesh)对象使用。比如在不同的位置画两个蓝色立方体，我们会需要两个网格(Mesh)对象来代表每一个立方体的位置和方向。但只需一个几何体(Geometry)来存放立方体的顶点数据，和一种材质(Material)来定义立方体的颜色为蓝色就可以了。两个网格(Mesh)对象都引用了相同的几何体(Geometry)和材质(Material)。
              </li>
              <li>
                  几何体(Geometry)对象顾名思义代表一些几何体，如球体、立方体、平面、狗、猫、人、树、建筑等物体的顶点信息。Three.js内置了许多基本几何体 。你也可以创建自定义几何体或从文件中加载几何体。
              </li>
              <li>
                  材质(Material)对象代表绘制几何体的表面属性，包括使用的颜色，和光亮程度。一个材质(Material)可以引用一个或多个纹理(Texture)，这些纹理可以用来，打个比方，将图像包裹到几何体的表面。
              </li>
              <li>
                  纹理(Texture)对象通常表示一幅要么从文件中加载，要么在画布上生成，要么由另一个场景渲染出的图像。
              </li>
          </ul>
      </div>
      <div style="width: 80%;margin: 0 auto;line-height: 40px">
          持续更新与社区支持<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;我们的网站致力于为你提供最新的3D技术和教程内容。随着THREE.JS和Vue的不断发展，我们的教程也会持续更新，确保你始终掌握最新的开发技巧。
          此外，你还可以加入我们的学习社区，与其他学习者和开发者交流经验，分享成果，获得更多灵感和帮助。在这里，你不再是一个人学习，而是与志同道合的朋友一起探索3D世界的奥秘。
      </div>
  </div>
</template>

<style scoped>
.container{
    background: white;
}
.box{
    display: flex;
    justify-content: center;
}
</style>
