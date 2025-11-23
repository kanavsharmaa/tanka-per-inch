import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const addressSchema = new mongoose.Schema({
  flatNumber: {
    type: String,
  },
  flatName: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  country: {
    type: String,
  },
  pincode: {
    type: Number,
  },
});

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{10}$/, "Invalid phone number format"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    address: [addressSchema],
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (newPassword: string) {
  return await bcrypt.compare(newPassword, this.password);
};

const accessSecret: string = process.env.ACCESS_TOKEN_SECRET!;
const refreshSecret: string = process.env.REFRESH_TOKEN_SECRET!;
const accessExpiry: string = process.env.ACCESS_TOKEN_EXPIRY!;
const refreshExpiry: string = process.env.REFRESH_TOKEN_EXPIRY!;

if (!accessSecret || !refreshSecret || !accessExpiry || !refreshExpiry) {
  throw new Error("Environment variables are not defined");
}

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      phoneNumber: this.phoneNumber,
      role: this.role,
    },
    accessSecret,
    {
      expiresIn: accessExpiry,
    } as jwt.SignOptions
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    refreshSecret,
    {
      expiresIn: refreshExpiry,
    } as jwt.SignOptions
  );
};

export const User = mongoose.models.User || mongoose.model("User", userSchema);
