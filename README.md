# AG-Grid React 单元格合并示例

这个项目演示了如何在 React 的 AG-Grid 表格中实现同一行上的单元格合并功能。

## 功能特性

- ✅ 使用 `colSpan` 回调函数实现动态单元格合并
- ✅ 自定义单元格渲染器处理合并逻辑
- ✅ 数据驱动的合并配置
- ✅ 多种合并场景示例
- ✅ 复杂报表的单元格合并实现

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm start
```

应用将在 [http://localhost:3000](http://localhost:3000) 启动。

## 实现方法

### 1. 基础单元格合并

使用 `colSpan` 回调函数：

```javascript
{
  field: 'detail1',
  colSpan: (params) => {
    // 根据数据动态返回跨越的列数
    if (params.data.mergeInfo && params.data.mergeInfo.detail1) {
      return params.data.mergeInfo.detail1;
    }
    return 1;
  }
}
```

### 2. 隐藏被合并的单元格

使用 `cellStyle` 隐藏被覆盖的单元格：

```javascript
{
  field: 'detail2',
  cellStyle: (params) => {
    if (params.data.mergeInfo && params.data.mergeInfo.detail1 > 1) {
      return { display: 'none' };
    }
    return null;
  }
}
```

### 3. 关键配置

必须在 AgGridReact 组件上设置 `suppressRowTransform={true}`：

```javascript
<AgGridReact
  rowData={rowData}
  columnDefs={columnDefs}
  suppressRowTransform={true}  // 重要！启用 colSpan 功能
/>
```

## 示例说明

### 示例 1: 基础 colSpan 使用
展示了如何通过在数据中定义 `mergeInfo` 来控制单元格合并。

### 示例 2: 自定义渲染器
演示了如何使用自定义单元格渲染器来实现更复杂的合并效果。

### 示例 3: 动态合并策略
根据行类型（header、subheader、data）动态决定合并规则。

### 高级示例: 复杂报表
展示了一个完整的销售报表，包含：
- 跨越所有列的标题行
- 分组表头的合并
- 小计和总计行的特殊合并

## 核心技术点

1. **colSpan 函数**: 在列定义中返回单元格跨越的列数
2. **cellStyle 函数**: 控制单元格的显示/隐藏
3. **suppressRowTransform**: 必须设置为 true
4. **数据驱动**: 在行数据中包含合并配置信息
5. **自定义渲染器**: 实现复杂的单元格内容展示

## 注意事项

- AG-Grid 的单元格合并只支持同一行内的水平合并
- 垂直合并（跨行）需要使用其他技术方案
- 合并单元格时需要处理好被覆盖单元格的隐藏
- 确保 `suppressRowTransform` 设置为 true

## 项目结构

```
src/
├── App.js                    # 主应用组件，包含3个基础示例
├── AdvancedMergeExample.js   # 高级合并示例（复杂报表）
├── App.css                   # 应用样式
├── index.js                  # 应用入口
└── index.css                 # 全局样式
```

## 依赖版本

- React: ^18.2.0
- ag-grid-community: ^31.0.0
- ag-grid-react: ^31.0.0

## License

MIT