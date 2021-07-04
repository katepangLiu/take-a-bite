# Bump Mapping & Dispacement Mapping

texture mapping ，表示将 texture 应用到物体的表面，表面上的每个点，都有一个对于 texture[u, v] 值
u,v 都处于 [0, 1] 之间
texure 表示物体的属性，除了最常见的表示颜色属性之外，还可以有其他的应用，比如这里的Bump 和  Dispacement,可以用 texture 来定义物体的表面高度变化，在不增加几何点的情况下，创造出新的几何特性。

- Bump 对每个点应用高度偏移，改变每个像素点的法线
- Dispacement  对每个点应用高度偏移，改变每个像素点的法线和位置

实现的关键在于，如何求原始点衍生出来的点

- 构建切线空间
  - 切线空间是一个三维空间，原点是每一个像素点
    - z轴为像素点的法线 Normal
    - x-y 平面为像素点的 切面，包含 Tangent， Bitangent 
- 在切线空间中，表示 应用 高度偏移之后的点的新法线
- 切线变换变换矩阵(TBN), 将 新法线 转换成 三维空间表示