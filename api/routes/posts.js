const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const isAuthenticated = require("../middlewares/isAuthenticated");

const prisma = new PrismaClient();

//つぶやき投稿用API
router.post("/post", isAuthenticated, async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: "投稿内容を入力してください。" });
  }

  try {
    const newPost = await prisma.post.create({
      data: {
        content,
        authorId: req.userId,
      },
      include: {
        author: {
          include: {
            profile: true,
          },
        },
      },
    });
    res.status(201).json(newPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "サーバーエラーです。" });
  }
});

//最新つぶやき取得用API
router.get("/get_latest_post", async (req, res) => {
  try {
    const latestPosts = await prisma.post.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          include: {
            profile: true,
          },
        },
      },
    });
    return res.status(200).json(latestPosts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "サーバーエラーです。" });
  }
});

//プロフィールページに該当ユーザの投稿内容だけを取得
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const userPosts = await prisma.post.findMany({
      where: {
        authorId: parseInt(id),
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: true,
      },
    });
    return res.status(200).json(userPosts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "サーバーエラーです。" });
  }
});

module.exports = router;
