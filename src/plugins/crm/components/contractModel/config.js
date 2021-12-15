const tableCols = {
  'returned-price': [
    {field:'id', width:60,align:'center', title: '序号', type: 'numbers'}
    ,{field:'name', width:150, title: '合同编号', templet: ({ id, name }) => {
        return `<span class="cell-btn-item-line" data-type="look" data-id="${id}">${name}</span>`
      }}
    ,{field:'mainContact', width:90, align: 'center', title: '回款里程碑' }
    ,{field:'mainContact', width:90, align: 'center', title: '状态' }
    ,{field:'job', width:150, align: 'center', title: '基准回款时间' }
    ,{field:'customerName', minWidth: 250, title: '预计回款时间' }
    ,{field:'character', width:120, align: 'center', title: '预计结算金额（元）'}
    ,{field:'managerName', width:160, align: 'center', title: '已回款金额（元）'}
    ,{field:'character', width:120, align: 'center', title: '实际回款金额(元)'}
    ,{field:'character', width:120, align: 'center', title: '未回款金额(元)'}
    ,{field:'managerName', width:160, align: 'center', title: '备注'}
    ,{field:'character', width:120, align: 'center', title: '附件'}
    ,{field: 'operation', width:280, title: '操作', align: 'center', fixed: 'right', toolbar: `#returned-price-table-operation`}
  ],
  'open-records': [
    {field:'id', width:80, align:'center', title: '序号', type: 'numbers'}
    ,{field:'projectCode', width:150, title: '日期'}
    ,{field:'projectName', width:200, title: '开票金额（元）'}
    ,{field:'manage', width:150, title: '申请人'}
    ,{field:'manage2', width:150, title: '开票人'}
    ,{field:'dep', width:120, align: 'center', title: '税率'}
    ,{field:'province', width:250, title: '备注'}
    ,{title: '操作', width: 120, align: 'center', fixed: 'right', toolbar: `#open-records-table-operation`}
  ],
}
