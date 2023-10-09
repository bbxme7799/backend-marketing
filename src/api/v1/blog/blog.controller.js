import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/posts
export const getAllPosts = async (req, res) => {
  try {
    const { keyword, page, perPage } = req.query;

    const pageNumber = parseInt(page) || 1;
    const itemsPerPage = parseInt(perPage) || 10;

    const skip = (pageNumber - 1) * itemsPerPage;

    let where = {};

    if (keyword) {
      where = {
        OR: [
          {
            title: {
              contains: keyword,
            },
          },
          {
            content: {
              contains: keyword,
            },
          },
        ],
      };
    }

    const posts = await prisma.post.findMany({
      where,
      select: {
        id: true,
        title: true,
        content: true,
        imageUrl: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      skip,
      take: itemsPerPage,
    });

    const total = await prisma.post.count({ where });

    const totalPage = Math.ceil(total / itemsPerPage);

    res.status(200).json({
      data: posts,
      page: pageNumber,
      per_page: itemsPerPage,
      total_page: totalPage,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "An error occurred while fetching posts." });
  }
};

// GET /api/posts
export const getPostById = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id),
      },
      // include: {
      //   author: true,
      // },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "An error occurred while fetching post." });
  }
};

export const createPost = async (req, res) => {
  try {
    const user = req.currentUser.id;
    const { title, content, imageUrl } = req.body;

    const createdPost = await prisma.post.create({
      data: {
        title,
        content,
        imageUrl,
        authorId: user,
      },
      select: {
        id: true,
        title: true,
        content: true,
        imageUrl: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    res.status(201).json(createdPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the post." });
  }
};

export const editPost = async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);

    // Check if the post exists
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return res.status(404).json({ error: "Post not found." });
    }

    // Check if the user has permission to edit the post
    if (req.currentUser.role !== 1) {
      return res.status(403).json({ error: "Permission denied." });
    }

    const { title, content, imageUrl } = req.body;

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        content,
        imageUrl,
      },
      select: {
        id: true,
        title: true,
        content: true,
        imageUrl: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error editing post:", error);
    res
      .status(500)
      .json({ error: "An error occurred while editing the post." });
  }
};

export const deletePost = async (req, res) => {
  const { postId } = req.params;

  // ตรวจสอบว่า postId ถูกส่งมาหรือไม่
  if (!postId) {
    return res.status(400).json({ error: "Missing postId parameter" });
  }

  try {
    // แปลง postId เป็นตัวเลขฐาน 10
    const postIdAsInt = parseInt(postId, 10);

    // ตรวจสอบว่าโพสต์ที่ต้องการลบมีอยู่หรือไม่
    const existingPost = await prisma.post.findUnique({
      where: {
        id: postIdAsInt,
      },
    });

    if (!existingPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    // ลบโพสต์
    await prisma.post.delete({
      where: {
        id: postIdAsInt,
      },
    });

    res.status(204).send(); // ส่งสถานะการลบสำเร็จ (No Content)
  } catch (error) {
    console.error("Error deleting post:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the post" });
  }
};
