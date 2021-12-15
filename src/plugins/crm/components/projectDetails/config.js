const tableCols = {
  'contract-manage': [
    {field:'id', width:80, align:'center', title: '序号', type: 'numbers'}
    ,{field:'conNum', width:150, title: '合同编号', templet: ({ id, conNum }) => {
        return `<span class="cell-btn-item-line" data-type="look" data-id="${id}">${conNum}</span>`
      }}
    ,{field:'conName', width:120, title: '合同名称'}
    ,{field:'conStatus', width: 130, title: '合同状态', templet: ({ conStatus }) => {
        return conStatus.dicName
      }}
    ,{field:'conMoney', width:200, title: '合同金额（元）'}
    ,{field:'settleMoney', width:150, title: '结算金额(元)'}
    ,{field:'payMoney', width:150, title: '已回款金额(元)'}
    ,{field:'dep', width:120, align: 'center', title: '已回款比例'}
    ,{field:'conDate', width:120, title: '签单日期'}
    ,{field:'employeeName', width: 130, title: '签单人', templet: ({ conPeople }) => {
        return conPeople.employeeName
      }}
    ,{field:'orgName', width:200, title: '归属部门', templet: ({ conPeople }) => {
        return conPeople.org.orgName
      }}
    ,{field:'jdDate', width:150, title: '交档日期'}
    ,{field:'employeeName', width:150, title: '交档人', templet: ({ jdMan }) => {
        return jdMan.employeeName
      }}
    ,{field:'dep', width:120, align: 'center', title: '回款条件'}
    ,{field:'remark', width:120, align: 'center', title: '备注'}
    ,{field:'attachPath', width:120, align: 'center', title: '合同附件', templet: ({ attachPath }) => {
        return JSON.parse(attachPath).length
      }}
    ,{title: '操作', minWidth: 150, align: 'center', fixed: 'right', toolbar: `#contract-manage-table-operation`}
  ],
}
