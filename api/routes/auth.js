const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();


//新規ユーザ登録API
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data:{
      username,
      email,
      password: hashedPassword,
    }
  });
  return res.json({ user })
});

//ユーザログインAPI
router.post("/login", async(req, res) => {
  const {email, password} = req.body;

  const user = await prisma.user.findUnique({ where: {email} });

  if(!user){
    return res
      .status(401).json({ error: "該当ユーザが存在しません。" });
  }
  const isPasswordVaild = await bcrypt.compare(password, user.password);

  if(!isPasswordVaild){
    return res.status(401).json({error: 'メールアドレス、またはパスワードが間違っています。'});
  }
  const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });

  return res.json({ token });
})

module.exports = router;