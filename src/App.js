import React, { useState, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './App.css';
import AdvancedMergeExample from './AdvancedMergeExample';

// 自定义单元格渲染器，用于合并单元格
const MergedCellRenderer = (props) => {
  const { value, colSpan, style } = props;
  
  // 如果这个单元格应该被隐藏（因为被前面的单元格合并了）
  if (props.data.hiddenCells && props.data.hiddenCells.includes(props.column.colId)) {
    return null;
  }
  
  return (
    <div style={{
      ...style,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      backgroundColor: '#e6f3ff',
      fontWeight: 'bold'
    }}>
      {value}
    </div>
  );
};

function App() {
  // 示例1: 使用colSpan回调函数实现单元格合并
  const [rowData1] = useState([
    { 
      category: '产品信息', 
      detail1: '这是跨越多列的合并单元格内容',
      detail2: '', 
      detail3: '',
      mergeInfo: { detail1: 3 } // 标记detail1需要跨越3列
    },
    { 
      category: '销售数据', 
      detail1: '第一季度', 
      detail2: '第二季度', 
      detail3: '第三季度' 
    },
    { 
      category: '年度总结', 
      detail1: '2024年度总销售额：1000万',
      detail2: '', 
      detail3: '',
      mergeInfo: { detail1: 3 }
    },
  ]);

  // 示例2: 使用自定义渲染器的数据
  const [rowData2] = useState([
    { 
      id: 1,
      name: '张三',
      info: '基本信息合并显示',
      age: '',
      address: '',
      hiddenCells: ['age', 'address'], // 标记需要隐藏的列
      colSpanConfig: { info: 3 }
    },
    { 
      id: 2,
      name: '李四',
      info: '详细信息',
      age: '25',
      address: '北京市'
    },
    { 
      id: 3,
      name: '王五',
      info: '所有联系方式',
      age: '',
      address: '',
      hiddenCells: ['age', 'address'],
      colSpanConfig: { info: 3 }
    },
  ]);

  // 示例3: 动态合并单元格
  const [rowData3] = useState([
    { 
      type: 'header',
      col1: '报表标题 - 跨越所有列',
      col2: '', 
      col3: '', 
      col4: '',
      spanCols: 4
    },
    { 
      type: 'subheader',
      col1: '分组1',
      col2: '',
      col3: '分组2',
      col4: '',
      spanConfig: { col1: 2, col3: 2 }
    },
    { 
      type: 'data',
      col1: '数据1',
      col2: '数据2',
      col3: '数据3',
      col4: '数据4'
    },
  ]);

  // 列定义1 - 使用colSpan回调
  const columnDefs1 = useMemo(() => [
    { 
      field: 'category', 
      headerName: '类别',
      width: 120
    },
    { 
      field: 'detail1', 
      headerName: '详情1',
      width: 200,
      colSpan: (params) => {
        // 根据行数据中的mergeInfo来决定跨越的列数
        if (params.data.mergeInfo && params.data.mergeInfo.detail1) {
          return params.data.mergeInfo.detail1;
        }
        return 1;
      },
      cellStyle: (params) => {
        if (params.data.mergeInfo && params.data.mergeInfo.detail1) {
          return {
            backgroundColor: '#d4edda',
            fontWeight: 'bold',
            textAlign: 'center'
          };
        }
        return null;
      }
    },
    { 
      field: 'detail2', 
      headerName: '详情2',
      width: 200,
      cellStyle: (params) => {
        // 如果前一个单元格合并了这个单元格，隐藏它
        if (params.data.mergeInfo && params.data.mergeInfo.detail1 > 1) {
          return { display: 'none' };
        }
        return null;
      }
    },
    { 
      field: 'detail3', 
      headerName: '详情3',
      width: 200,
      cellStyle: (params) => {
        if (params.data.mergeInfo && params.data.mergeInfo.detail1 > 2) {
          return { display: 'none' };
        }
        return null;
      }
    },
  ], []);

  // 列定义2 - 使用自定义渲染器
  const columnDefs2 = useMemo(() => [
    { 
      field: 'id', 
      headerName: 'ID',
      width: 80
    },
    { 
      field: 'name', 
      headerName: '姓名',
      width: 100
    },
    { 
      field: 'info', 
      headerName: '信息',
      width: 200,
      colSpan: (params) => {
        return params.data.colSpanConfig?.info || 1;
      },
      cellRenderer: MergedCellRenderer,
      cellStyle: (params) => {
        if (params.data.colSpanConfig?.info > 1) {
          return {
            backgroundColor: '#fff3cd',
            fontWeight: 'bold',
            textAlign: 'center'
          };
        }
        return null;
      }
    },
    { 
      field: 'age', 
      headerName: '年龄',
      width: 100,
      cellRenderer: MergedCellRenderer
    },
    { 
      field: 'address', 
      headerName: '地址',
      width: 150,
      cellRenderer: MergedCellRenderer
    },
  ], []);

  // 列定义3 - 动态合并
  const columnDefs3 = useMemo(() => [
    { 
      field: 'col1', 
      headerName: '列1',
      width: 150,
      colSpan: (params) => {
        if (params.data.spanCols) {
          return params.data.spanCols;
        }
        if (params.data.spanConfig?.col1) {
          return params.data.spanConfig.col1;
        }
        return 1;
      },
      cellStyle: (params) => {
        if (params.data.type === 'header') {
          return {
            backgroundColor: '#17a2b8',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '16px',
            textAlign: 'center'
          };
        }
        if (params.data.type === 'subheader') {
          return {
            backgroundColor: '#6c757d',
            color: 'white',
            fontWeight: 'bold',
            textAlign: 'center'
          };
        }
        return null;
      }
    },
    { 
      field: 'col2', 
      headerName: '列2',
      width: 150,
      cellStyle: (params) => {
        if (params.data.spanCols || params.data.spanConfig?.col1 > 1) {
          return { display: 'none' };
        }
        return null;
      }
    },
    { 
      field: 'col3', 
      headerName: '列3',
      width: 150,
      colSpan: (params) => {
        if (params.data.spanConfig?.col3) {
          return params.data.spanConfig.col3;
        }
        return 1;
      },
      cellStyle: (params) => {
        if (params.data.spanCols) {
          return { display: 'none' };
        }
        if (params.data.type === 'subheader') {
          return {
            backgroundColor: '#6c757d',
            color: 'white',
            fontWeight: 'bold',
            textAlign: 'center'
          };
        }
        return null;
      }
    },
    { 
      field: 'col4', 
      headerName: '列4',
      width: 150,
      cellStyle: (params) => {
        if (params.data.spanCols || params.data.spanConfig?.col3 > 1) {
          return { display: 'none' };
        }
        return null;
      }
    },
  ], []);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
  }), []);

  return (
    <div className="App">
      <h1>AG-Grid React 单元格合并示例</h1>
      
      <div className="example-section">
        <h2>示例1: 使用 colSpan 回调函数</h2>
        <p>通过colSpan回调函数动态设置单元格跨越的列数</p>
        <div className="ag-theme-alpine" style={{ height: 200, width: '100%' }}>
          <AgGridReact
            rowData={rowData1}
            columnDefs={columnDefs1}
            defaultColDef={defaultColDef}
            suppressRowTransform={true}
          />
        </div>
      </div>

      <div className="example-section">
        <h2>示例2: 使用自定义单元格渲染器</h2>
        <p>结合自定义渲染器实现更复杂的合并效果</p>
        <div className="ag-theme-alpine" style={{ height: 200, width: '100%' }}>
          <AgGridReact
            rowData={rowData2}
            columnDefs={columnDefs2}
            defaultColDef={defaultColDef}
            suppressRowTransform={true}
          />
        </div>
      </div>

      <div className="example-section">
        <h2>示例3: 动态合并不同类型的行</h2>
        <p>根据行类型动态决定合并策略</p>
        <div className="ag-theme-alpine" style={{ height: 200, width: '100%' }}>
          <AgGridReact
            rowData={rowData3}
            columnDefs={columnDefs3}
            defaultColDef={defaultColDef}
            suppressRowTransform={true}
          />
        </div>
      </div>

      <div className="tips-section">
        <h3>实现要点：</h3>
        <ul>
          <li><strong>colSpan 回调：</strong>在列定义中使用 colSpan 函数，根据行数据动态返回跨越的列数</li>
          <li><strong>隐藏被合并的单元格：</strong>使用 cellStyle 或 cellRenderer 来隐藏被合并覆盖的单元格</li>
          <li><strong>suppressRowTransform：</strong>设置为 true 以支持 colSpan 功能</li>
          <li><strong>数据驱动：</strong>在行数据中包含合并信息，使合并逻辑更灵活</li>
          <li><strong>样式定制：</strong>通过 cellStyle 为合并的单元格添加特殊样式</li>
        </ul>
      </div>

      <AdvancedMergeExample />
    </div>
  );
}

export default App;