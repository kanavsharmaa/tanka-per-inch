import { Request, Response } from "express";
import { Category } from "../models/category.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addCategory = asyncHandler(async (req: Request, res: Response) => {
  const { categoryName } = req.body;
  if (!categoryName) throw new Error("Name is required");

  const categoryExists = await Category.findOne({ name: categoryName });
  if (categoryExists) throw new Error("Category already exists");

  const category = await Category.create({ name: categoryName });
  res.status(201).json({
    success: true,
    message: "Category created successfully",
    category,
  });
});

const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const { existingCategoryName, newCategoryName } = req.body;
  if (!(existingCategoryName && newCategoryName))
    throw new Error("Both new & old name fields are required");

  if (existingCategoryName === newCategoryName)
    throw new Error("New name cannot be the same as old name");

  const existingCategory = await Category.findOne({
    name: existingCategoryName,
  });
  if (!existingCategory) throw new Error("Category not found");

  const newCategoryNameExists = await Category.findOne({
    name: newCategoryName,
  });
  if (newCategoryNameExists)
    throw new Error(
      `Category with the name: ${newCategoryName} already exists`
    );

  const category = await Category.findOneAndUpdate(
    { name: existingCategoryName },
    { name: newCategoryName }
  );
  if (!category) throw new Error("Category update failed");

  res.status(201).json({
    success: true,
    message: "Category updated successfully",
    category,
  });
});

export { addCategory, updateCategory };
