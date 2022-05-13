const { profile, user } = require("../../models");
const cloudinary = require("../utils/cloudynary");
const { addProduct } = require("./product");

// ============ ADD PROFILE ===============
exports.addProfile = async (req, res) => {
  try {
    let data = req.body;
    const addProfile = await profile.create({
      ...data,
      idUser: req.user.id,
    });

    console.log(addProfile);

    res.status(200).send({
      status: "Success",
      message: "Add profile success",
      data: addProfile,
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      status: "Failed",
      message: "Server Error",
    });
  }
};

// ============ UPDATE PROFILE ===============
exports.updateProfile = async (req, res) => {
  try {
    // Update for table users
    let dataUser = {
      name: req?.body?.name,
    };

    dataUser = JSON.parse(JSON.stringify(dataUser));

    const updateName = await user.update(
      {
        name: dataUser.name,
      },
      {
        where: {
          id: req.user.id,
        },
      }
    );

    // Update for table profile database

    // let profileUser = JSON.parse(JSON.stringify(req.body));
    // console.log("get data profile: ", profileUser);

    const getProfile = await profile.findOne({
      where: {
        idUser: req.user.id,
      },
    });
    console.log("ISI GET PROFILE: ", getProfile);

    let result = {};
    // check condition for upload image if image is null/undefine
    if (req.file?.path && getProfile.image) {
      // delete image
      console.log("PROSES DELETE JALAN");
      await cloudinary.uploader.destroy(getProfile?.image, (error, result) => {
        console.log("result : ", result);
        console.log("error : ", error);
      });
      // upload image
      console.log("PROSES UPDATE JALAN");
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: "dumbmerch_file",
        use_filename: true,
        unique_filename: false,
      });
    } else if(req.file?.path) {
      console.log("PROSES UPLOAD JALAN");
      result = await cloudinary.uploader.upload(req.file?.path, {
        folder: "dumbmerch_file",
        use_filename: true,
        unique_filename: false,
      });
    }

    const data = {
      ...req.body,
      image: result?.public_id,
    };

    const updateProfile = await profile.update(data, {
      where: {
        idUser: req.user.id,
      },
    });

    res.status(200).send({
      status: "Success",
      data: {
        nameUpdate: updateName,
        profileUpdate: updateProfile,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      status: "Failed",
      message: "Server Error",
    });
  }
};
