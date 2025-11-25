import { Request, Response } from "express";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateAccessAndRefreshToken = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken };
};

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, phoneNumber, address, role } =
    req.body;

  if (
    [firstName, lastName, email, password, phoneNumber].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new Error("All fields are required");
  }

  const existedUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });

  if (existedUser) throw new Error("User with email or phone number already exists");

  const createdUser = await User.create({
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    address,
    role,
  });

  const user = await User.findById(createdUser._id).select("-password");

  if (!user) throw new Error("Something went wrong while creating the user");

  return res.status(201).json({ user, message: "User created successfully" });
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if ([email, password].some((field) => field?.trim() === "")) {
    throw new Error("All fields are required");
  }

  const user = await User.findOne({ email })?.select("-password");
  if (!user) throw new Error("User not found");

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    email
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({ user, message: "Login successful" });
});

const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  if ([oldPassword, newPassword].some((field) => field?.trim() === "")) {
    throw new Error("All fields are required");
  }

  const user = await User.findById(req.user._id);
  if (!user) throw new Error("User not found");

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) throw new Error("Old password is incorrect");

  if (oldPassword === newPassword) {
    throw new Error("New password cannot be the same as old password");
  }

  user.password = newPassword;
  await user.save();

  const updatedUser = await User.findById(req.user._id).select("-password -refreshToken");

  return res.status(200).json({ user: updatedUser, message: "Password changed successfully" });
});

const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  await User.updateOne({ _id: req.user._id }, { $unset: { refreshToken: 1 } });

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({ message: "Logout successful" });
});

export { registerUser, loginUser, changePassword, logoutUser };
