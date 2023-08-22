import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();
import bcrypt from "bcryptjs";
import config from "../../../config/index.js";
import { BadRequestException } from "../../../exceptions/bad-request.exception.js";
import crypto from "crypto";
import { ethers } from "ethers";
import { NotAuthorizeRequestException } from "../../../exceptions/not-authorize-request.exception.js";

export const singup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const eUser = await prisma.user.findFirst({
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
        // email: result.email,
        role: result.role,
        is_banned: result.is_banned,
      },
      config.jwtSecretKey
    );

    req.session = {
      jwt: userJwt,
    };
    const { password: _, ...newObj } = result;
    res.status(201).json({});
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const googleAuth = async (req, res, next) => {
  try {
    const { id, emails, photos, displayName } = req.user;

    const existingAccount = await prisma.user.findFirst({
      where: { google_id: id },
    });
    if (!existingAccount && emails && emails.length > 0) {
      const existingEmail = await prisma.user.findFirst({
        where: { email: emails[0].value },
      });
      if (existingEmail) {
        console.log("error case");
        res.redirect(
          `http://localhost:3000/signin?error=${encodeURIComponent(
            "Incorrect_Email"
          )}`
        );
        return;
      } else {
        const created = await prisma.user.create({
          data: {
            username: displayName,
            email: emails[0].value,
            google_id: id,
          },
        });
        const userJwt = jwt.sign(
          {
            id: created.id,
            // email: created.email,
            role: created.role,
            is_banned: created.is_banned,
          },
          config.jwtSecretKey
        );

        req.session = {
          jwt: userJwt,
        };
        res.redirect(`http://localhost:3000/users`);
        //save and create account
        return;
      }
    }

    if (existingAccount) {
      const userJwt = jwt.sign(
        {
          id: existingAccount.id,
          // email: existingAccount.email,
          role: existingAccount.role,
          is_banned: existingAccount.is_banned,
        },
        config.jwtSecretKey
      );

      req.session = {
        jwt: userJwt,
      };

      if (existingAccount.is_banned) {
        return res.redirect("http://localhost:3000/suspended");
      }

      if (existingAccount.role === 1) {
        res.redirect(`http://localhost:3000/admin`);
      } else {
        res.redirect(`http://localhost:3000/users`);
      }
      return;
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const metamaskAuth = async (req, res, next) => {
  try {
    const { signedMessage, message, address } = req.body;
    let user = await this.usersRepository.findOne({ address });
    const recoveredAddress = ethers.verifyMessage(message, signedMessage);
    console.log(recoveredAddress);
    if (recoveredAddress !== address) {
      throw new NotAuthorizeRequestException();
    }
    if (!user) {
      user = await prisma.user.create({
        address,
      });
    }

    const userJwt = jwt.sign(
      {
        id: user.id,
        role: user.role,
        is_banned: user.is_banned,
      },
      config.jwtSecretKey
    );

    req.session = {
      jwt: userJwt,
    };

    res.status(200).json({ message: "success" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const getNonce = async (req, res, next) => {
  try {
    const nonce = crypto.randomBytes(32).toString("hex");
    // Return the nonce value as a JSON object in the response body
    res.json({ nonce });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const eUser = await prisma.user.findFirst({
      where: { email: email },
    });

    if (!eUser) {
      throw new BadRequestException("Invalid credentials");
    }

    const match = bcrypt.compareSync(password, eUser.password);
    if (!match) {
      throw new BadRequestException("Invalid Credentials");
    }

    const userJwt = jwt.sign(
      {
        id: eUser.id,
        email: eUser.email,
        role: eUser.role,
        is_banned: eUser.is_banned,
      },
      config.jwtSecretKey
    );

    req.session = {
      jwt: userJwt,
    };

    const { password: _, ...newObj } = eUser;
    res.status(200).json({ message: "success" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const signout = async (req, res, next) => {
  try {
    req.session = null;
    res.json({});
  } catch (error) {
    console.log(error);
    next(error);
  }
};
