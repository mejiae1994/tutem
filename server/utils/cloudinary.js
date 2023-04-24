const cloudinary = require("cloudinary").v2;
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
  secure: true,
});

const deleteCloudinaryAssets = async (publicIds) => {
  try {
    const result = await cloudinary.api.delete_resources(publicIds);
    return result;
  } catch (error) {
    console.error(error);
  }
};

const deleteOldAssets = asyncHandler(async (req, res) => {
  const users = await User.find().select("oldImages");
  let publicIdList = users.flatMap((item) => item.oldImages);

  if (publicIdList.length === 0) return;
  const response = await deleteCloudinaryAssets(publicIdList);
  if (response) {
    await User.updateMany({}, { $set: { oldImages: [] } });
  }
});

module.exports = deleteOldAssets;
