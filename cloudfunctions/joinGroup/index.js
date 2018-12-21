// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const containGroup = await db.collection('user-group').where({
    userId: wxContext.OPENID
  })
  .get()
  console.log("查询包含组", containGroup)
  let alreadyInGroup = false
  containGroup.data.forEach(item => {
    if (item.groupId === event.groupId) {
      alreadyInGroup = true
    }
  })
  if (alreadyInGroup) {
    return {
      msg: '你已在该组内',
      code: 0
    }
  } else {
    await db.collection('user-group').add({
      data: {
        userId: wxContext.OPENID,
        groupId: event.groupId
      }
    })
    return {
      msg: '加入成功',
      code: 1
    }
  }
}