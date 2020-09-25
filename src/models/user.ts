import { NextFunction } from "express";
import { createSchema, Type, typedModel } from "ts-mongoose";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const userSchema: any = createSchema(
  {
    full_name: Type.string(),

    email: Type.string(),

    password: Type.string(),

    percentage_score: Type.number()
  },
  { timestamps: true }
);

userSchema.pre("save", async function (this: any, next: NextFunction) {
  if (this.isModified("password")) {
    this.password = await this.hashPass(this.password);
  }

  next();
});

userSchema.methods = {
  // Sign user token
  jwtToken: function (): any {
    return jwt.sign(
      {
        userId: this._id
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d"
      }
    );
  },

  // hash password
  hashPass: async function (password: string): Promise<any> {
    return await argon2.hash(password);
  },

  // Verify user password
  verifyPass: async function (password: string): Promise<any> {
    let cp = await argon2.verify(this.password, password);
    return cp;
  }
};

export default typedModel("User", userSchema);
