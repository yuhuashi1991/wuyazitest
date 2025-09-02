import React, { useState, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

// 高级合并单元格示例
const AdvancedMergeExample = () => {
  // 复杂表格数据 - 模拟报表
  const [reportData] = useState([
    {
      rowType: 'title',
      col1: '2024年度销售报表',
      spanAll: true, // 跨越所有列
    },
    {
      rowType: 'header',
      col1: '产品类别',
      col2: '第一季度',
      col3: '',
      col4: '第二季度',
      col5: '',
      mergeConfig: { col2: 2, col4: 2 }
    },
    {
      rowType: 'subheader',
      col1: '',
      col2: '1月-2月',
      col3: '3月',
      col4: '4月-5月',
      col5: '6月',
    },
    {
      rowType: 'data',
      col1: '电子产品',
      col2: '100万',
      col3: '50万',
      col4: '120万',
      col5: '60万',
    },
    {
      rowType: 'data',
      col1: '家居用品',
      col2: '80万',
      col3: '40万',
      col4: '90万',
      col5: '45万',
    },
    {
      rowType: 'summary',
      col1: '季度小计',
      col2: '330万',
      col3: '',
      col4: '315万',
      col5: '',
      mergeConfig: { col2: 2, col4: 2 }
    },
    {
      rowType: 'total',
      col1: '总计',
      col2: '645万',
      spanRest: true, // 从col2开始跨越剩余所有列
    }
  ]);

  // 动态列定义生成
  const columnDefs = useMemo(() => {
    const cols = ['col1', 'col2', 'col3', 'col4', 'col5'];
    const headers = ['', '销售额', '', '销售额', ''];
    
    return cols.map((col, index) => ({
      field: col,
      headerName: headers[index],
      width: index === 0 ? 150 : 120,
      colSpan: (params) => {
        const data = params.data;
        
        // 标题行跨越所有列
        if (data.spanAll && col === 'col1') {
          return 5;
        }
        
        // 总计行从col2开始跨越
        if (data.spanRest && col === 'col2') {
          return 4;
        }
        
        // 根据mergeConfig配置合并
        if (data.mergeConfig && data.mergeConfig[col]) {
          return data.mergeConfig[col];
        }
        
        return 1;
      },
      cellStyle: (params) => {
        const data = params.data;
        
        // 隐藏被合并的单元格
        if (data.spanAll && col !== 'col1') {
          return { display: 'none' };
        }
        
        if (data.spanRest && col !== 'col1' && col !== 'col2') {
          return { display: 'none' };
        }
        
        // 根据mergeConfig隐藏被合并的单元格
        if (data.mergeConfig) {
          if ((col === 'col3' && data.mergeConfig.col2 > 1) ||
              (col === 'col5' && data.mergeConfig.col4 > 1)) {
            return { display: 'none' };
          }
        }
        
        // 根据行类型设置样式
        const styles = {};
        
        switch(data.rowType) {
          case 'title':
            return {
              backgroundColor: '#2c3e50',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '18px',
              textAlign: 'center',
              padding: '10px'
            };
          case 'header':
            return {
              backgroundColor: '#3498db',
              color: 'white',
              fontWeight: 'bold',
              textAlign: 'center'
            };
          case 'subheader':
            return {
              backgroundColor: '#5dade2',
              color: 'white',
              textAlign: 'center'
            };
          case 'summary':
            return {
              backgroundColor: '#f39c12',
              color: 'white',
              fontWeight: 'bold',
              textAlign: col === 'col1' ? 'left' : 'center'
            };
          case 'total':
            return {
              backgroundColor: '#e74c3c',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '16px',
              textAlign: col === 'col1' ? 'left' : 'center'
            };
          default:
            if (col === 'col1') {
              styles.fontWeight = 'bold';
              styles.backgroundColor = '#ecf0f1';
            }
            return styles;
        }
      },
      cellRenderer: (params) => {
        const data = params.data;
        
        // 自定义渲染标题行
        if (data.rowType === 'title' && col === 'col1') {
          return `<div style="display: flex; align-items: center; justify-content: center; height: 100%;">
            <span>${params.value}</span>
          </div>`;
        }
        
        return params.value;
      }
    }));
  }, []);

  const defaultColDef = useMemo(() => ({
    resizable: true,
  }), []);

  // 设置行高
  const getRowHeight = (params) => {
    if (params.data.rowType === 'title') {
      return 50;
    }
    return 35;
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>高级单元格合并示例 - 复杂报表</h2>
      <div className="ag-theme-alpine" style={{ height: 350, width: '100%' }}>
        <AgGridReact
          rowData={reportData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          suppressRowTransform={true}
          getRowHeight={getRowHeight}
          headerHeight={40}
        />
      </div>
      
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
        <h4>关键实现技术：</h4>
        <ol>
          <li><strong>colSpan 函数：</strong>动态返回每个单元格应该跨越的列数</li>
          <li><strong>cellStyle 函数：</strong>隐藏被合并覆盖的单元格（display: none）</li>
          <li><strong>数据驱动：</strong>在数据中定义合并规则（spanAll, spanRest, mergeConfig）</li>
          <li><strong>行类型区分：</strong>根据 rowType 应用不同的样式和合并规则</li>
          <li><strong>suppressRowTransform：</strong>必须设置为 true 才能使 colSpan 生效</li>
        </ol>
      </div>
    </div>
  );
};

export default AdvancedMergeExample;