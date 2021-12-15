const tableCols = {
  'potential-order': [
    {field:'id', width:80, align:'center', title: '序号', type: 'numbers'}
    ,{field:'projectCode', width:150, title: '项目编号'}
    ,{field:'projectName', width:200, title: '项目名称'}
    ,{field:'manage', width:150, title: '客户经理'}
    ,{field:'dep', width:120, align: 'center', title: '业务部门'}
    ,{field:'province', width:120, title: '省份'}
    ,{field:'city', width: 130, title: '城市'}
    ,{field:'createDate', width: 130, title: '立项时间',align: 'hav-order'}
    ,{field:'status', width: 130, title: '订单状态',align: 'right'}
    ,{field:'price1', width: 130, title: '预计签单金额',align: 'right'}
    ,{field:'price2', width: 130, title: '立项金额',align: 'right'}
    ,{field:'prob', width: 130, title: '赢率'}
    ,{field:'predictDate', width: 130, title: '预计签单日期',align: 'center'}
    ,{field:'mode', width: 130, title: '项目模式'}
    ,{field:'duration', width: 130, title: '服务时长/月'}
    ,{field:'content', width: 130, title: '建设内容'}
    ,{field:'progress', width: 130, title: '项目进展'}
    ,{title: '操作', minWidth: 150, align: 'center', fixed: 'right', toolbar: `#potential-order-table-operation`}
  ],
  'hav-order': [
    {field:'id', width:80, align:'center', title: '序号', type: 'numbers'}
    ,{field:'projectCode', width:150, title: '项目编号'}
    ,{field:'projectName', width:200, title: '项目名称'}
    ,{field:'manage', width:150, title: '客户经理'}
    ,{field:'manage2', width:150, title: '项目经理'}
    ,{field:'dep', width:120, align: 'center', title: '业务部门'}
    ,{field:'province', width:120, title: '省份'}
    ,{field:'city', width: 130, title: '城市'}
    ,{field:'createDate', width: 130, title: '立项时间',align: 'center'}
    ,{field:'status', width: 130, title: '订单状态',align: 'right'}
    ,{field:'price1', width: 130, title: '立项金额',align: 'right'}
    ,{field:'predictDate', width: 130, title: '签单日期',align: 'center'}
    ,{field:'price2', width: 130, title: '合同金额'}
    ,{field:'mode', width: 130, title: '项目模式'}
    ,{field:'content', width: 130, title: '建设内容'}
    ,{title: '操作', minWidth: 150, align: 'center', fixed: 'right', toolbar: `#hav-order-table-operation`}
  ],
  'competitor': [
    {field:'id', width:80, align:'center', title: '序号', type: 'numbers'}
    ,{field:'projectCode', width:150, title: '对手名称'}
    ,{field:'province', width:120, title: '省份'}
    ,{field:'city', width: 130, title: '城市'}
    ,{field:'projectName', width:200, title: '区域'}
    ,{field:'manage', width:150, title: '员工规模'}
    ,{field:'manage2', width:150, title: '竞争产品'}
    ,{field:'dep', width:120, align: 'center', title: '备注说明'}
    ,{field:'city', width: 130, title: '状态'}
    ,{title: '操作', minWidth: 150, align: 'center', fixed: 'right', toolbar: `#competitor-table-operation`}
  ],
  'service-request': [
    {field:'id', width:80, align:'center', title: '序号', type: 'numbers'}
    ,{field:'projectCode', width:150, title: '请求描述'}
    ,{field:'province', width:120, title: '请求类型'}
    ,{field:'city', width: 130, title: '子类型'}
    ,{field:'projectName', width:200, title: '状态'}
    ,{field:'manage', width:150, title: '联系人'}
    ,{field:'manage2', width:150, title: '联系电话'}
    ,{field:'dep', width:120, align: 'center', title: '接单人'}
    ,{field:'city', width: 130, title: '接单部门'}
    ,{field:'status', width: 130, title: '接单时间',align: 'right'}
    ,{field:'price1', width: 130, title: '当前进展',align: 'right'}
    ,{field:'predictDate', width: 130, title: '跟踪记录',align: 'center'}
    ,{field:'price2', width: 130, title: '附件'}
    ,{title: '操作', minWidth: 150, align: 'center', fixed: 'right', toolbar: `#competitor-table-operation`}
  ],
  'satisfy-survey': [
    {field:'id', width:80, align:'center', title: '序号', type: 'numbers'}
    ,{field:'projectCode', width:150, title: '编号'}
    ,{field:'province', width:120, title: '客户名称'}
    ,{field:'city', width: 130, title: '回访日期'}
    ,{field:'projectName', width:200, title: '被访人'}
    ,{field:'manage', width:150, title: '被访人电话'}
    ,{field:'manage2', width:150, title: '总得分 '}
    ,{field:'dep', width:120, align: 'center', title: '客户建议'}
    ,{title: '操作', minWidth: 150, align: 'center', fixed: 'right', toolbar: `#satisfy-survey-table-operation`}
  ],
  'billing-info': [
    {field:'id', width:60, fixed: 'left', align:'center', title: '序号', type: 'numbers'}
    ,{field:'ticketName', width:150, title: '开票名称'}
    ,{field:'taxNo', width:200, title: '纳税人识别号'}
    ,{field:'address', width:150, title: '地址'}
    ,{field:'phone', width:150, title: '电话'}
    ,{field:'bank', width:120, align: 'center', title: '开户行'}
    ,{field:'account', width:120, title: '账号'}
    ,{field:'status', width: 130, title: '状态', templet: ({ status }) => {
        return status === '0' ? '有效' : status === '1' ? '失效' : '未知'
      }}
    ,{title: '操作', minWidth: 120, align: 'center', fixed: 'right', toolbar: `#billing-info-table-operation`}
  ]
}
