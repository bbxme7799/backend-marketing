

export const singup = async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
  
      const eUser = await prisma.user.findUnique({
        where: { email: email },
      });
  
      if (eUser) {
        throw new BadRequestException("Email already used.");
      }
  
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
  
      const result = await prisma.user.create({
        data: {
          username: username,
          email: email,
          password: hash,
        },
      });
  
      const userJwt = jwt.sign(
        {
          id: result.id,
          email: result.email,
          isAdmin: false,
        },
        process.env.JWT_KEY
      );
  
      req.session = {
        jwt: userJwt,
      };
      const { password: _, ...newObj } = result;
      res.status(201);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  