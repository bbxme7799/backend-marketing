import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
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
    res.status(200).json(posts);
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
    // Check if user's role is 1
    if (req.currentUser.role !== 1) {
      return res.status(403).json({ error: "Permission denied." });
    }

    const { title, content, imageUrl, authorId } = req.body;

    const createdPost = await prisma.post.create({
      data: {
        title,
        content,
        imageUrl,
        authorId: req.currentUser.id,
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
