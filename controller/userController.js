const { Users } = require('../MongoDB/models/index')
const { connect, getStatus } = require('../MongoDB/index')


const login = (req, res) => {
  res.send('login')
}

// 用户注册
const register = async (req, res) => {
  console.log(req.body)
  const userModel = new Users(req.body)
  const dbBack = await userModel.save()
  res.status(201).json(dbBack)
}

// 查询所有手机号不为空的用户
const getUsers = async (req, res) => {
  console.log('getUsers', req)
  await connect()
  res.send(req)

  // try {
  //   // 构建查询条件：手机号不为空
  //   const query = {
  //     phone: { $exists: true, $ne: null, $ne: '' },
  //   }

  //   // 执行查询
  //   const users = await Users.find(query)

  //   res.status(200).json(users)
  // } catch (err) {
  //   res.status(500).json({ error: '获取用户列表失败' })
  // }
}

module.exports = {
  login,
  register,
  getUsers
}