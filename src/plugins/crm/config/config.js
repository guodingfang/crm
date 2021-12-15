var ipmURL = window.ipmURL;
var ownpmURL = window.ownpmURL;
var crmURL = window.crmURL;
var projectUrl = window.projectUrl
var uploadURL = window.uploadURL;
var hrURL = window.hrURL;

// OA审批状态
const approveOAlStatus = {
  0: '未提交',
  1: '审批中',
  2: '建议修改',
  3: '驳回',
  4: '审批通过'
}

// xmSelect 对照表
const mapKeyVal = {
  'companyDomName': 'belongCompany',
  'companyDomValue': 'belongCompanyCode',
  'projectDomName': 'belongProjectName',
  'projectDomValue': 'belongProjectCode',
  'usersDomName': 'managerName',
  'usersDomValue': 'managerNameCode',
}

// 客户状态
const  customerStatus = {
  '0': '报备中',
  '1': '有效',
  '2': '报备驳回',
  '3': '未提交',
  '4': '已作废'
}

const customerStatusStyle = {
  '0': '#1890FF',
  '1': '#7CC390',
  '2': '#EC808D',
  '3': '#D7D7D7',
  '4': '#555555'
}

const customerActiveStatus = {
  '': '未知',
  '0': '否',
  '1': '是'
}

// 客户类型
const customerType = {
  'TERMINALUSER': '终端用户',
  'AGENT': '代理商',
  'CRM_ZBS': '总包商'
}

const isMainCustomer = {
  '0': '是',
  '1': '否'
}
