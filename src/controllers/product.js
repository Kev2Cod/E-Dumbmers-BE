const { product, user, category, productCategory } = require("../../models");

const cloudinary = require("../utils/cloudynary");

// ============== GET PRODUCTS ===============
exports.getProduct = async (req, res) => {
  try {
    let data = await product.findAll({
      include: [
        {
          model: user,
          as: "seller",
          attributes: {
            exclude: ["password", "createdAt", "updatedAt"],
          },
        },
        {
          model: category,
          as: "categories",
          through: {
            modul: productCategory,
            as: "bridge",
          },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["idUser", "createdAt", "updatedAt"],
      },
    });

    data = JSON.parse(JSON.stringify(data));

    // Map
    data = data.map((item) => {
      return {
        ...item,
        image: process.env.PATH_FILE + item?.image,
      };
    });

    res.status(200).send({
      status: "Success",
      message: "Get data all product success",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      status: "Get data Failed",
      message: "Server Error",
    });
  }
};

// ============== ADD PRODUCTS ===============
exports.addProduct = async (req, res) => {
  try {
    let { categoryId } = req.body;

    if (categoryId) {
      categoryId = categoryId.split(",");
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "dumbmerch_file",
      use_filename: true,
      unique_filename: false,
    });
    console.log("Cloudinary: ", result);

    const data = {
      name: req.body.name,
      desc: req.body.desc,
      price: req.body.price,
      image: result.public_id,
      qty: req.body.qty,
      idUser: req.user.id,
    };

    let newProduct = await product.create(data);

    if (categoryId) {
      const productCategoryData = categoryId.map((item) => {
        return { idProduct: newProduct.id, idCategory: parseInt(item) };
      });

      await productCategory.bulkCreate(productCategoryData);
    }

    let products = await product.findOne({
      where: {
        id: newProduct.id,
      },
      include: [
        {
          model: user,
          as: "seller",
          attributes: {
            exclude: ["password", "createdAt", "updatedAt"],
          },
        },
        {
          model: category,
          as: "categories",
          through: {
            model: productCategory,
            as: "bridge",
          },
          attributes: {
            exclude: ["idUser", "createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["idUser", "createdAt", "updatedAt"],
      },
    });

    products = JSON.parse(JSON.stringify(products));

    res.status(200).send({
      status: "Success",
      message: "Add Product Success",
      data: {
        ...products,
        image: process.env.PATH_FILE + products.image,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Add Product Failed",
      message: "Server Error",
    });
  }
};

// ============ GET DETAIL PRODUCT ========
exports.getDetailProduct = async (req, res) => {
  const { id } = req.params;

  try {
    let data = await product.findOne({
      where: { id },
      include: [
        {
          model: user,
          as: "seller",
          attributes: {
            exclude: ["password", "createdAt", "updatedAt"],
          },
        },
        {
          model: category,
          as: "categories",
          through: {
            model: productCategory,
            as: "bridge",
          },
          attributes: {
            exclude: ["idUser", "createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["idUser", "createdAt", "updatedAt"],
      },
    });

    data = JSON.parse(JSON.stringify(data));

    data = {
      ...data,
      image: process.env.PATH_FILE + data.image,
    };

    res.status(200).send({
      status: "Success",
      message: `Get detail product: ${id} success`,
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      status: "Get detail data failed",
      message: "Server Error",
    });
  }
};

// ============ UPDATED PRODUCT ========
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    let { categoryId } = req.body;

    if (categoryId) {
      categoryId = categoryId.split(",");
    }

    // Get product for delete image at cloudynary
    const getProduct = await product.findOne({
      where: { id },
    });

    console.log("Product: ", getProduct?.image);

    let result = {};
    // check condition for upload image if image is null/undefine
    if (req.file?.path) {
      // delete image
      console.log("PROSES DELETE JALAN");
      await cloudinary.uploader.destroy(getProduct.image, (error, result) => {
        console.log("result : ", result);
        console.log("error : ", error);
      });

      // upload image
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: "dumbmerch_file",
        use_filename: true,
        unique_filename: false,
      });
    }
    console.log("Cloudinary: ", result?.public_id);

    const data = {
      name: req?.body?.name,
      desc: req?.body?.desc,
      price: req?.body?.price,
      image: result?.public_id,
      qty: req?.body?.qty,
      idUser: req?.user?.id,
    };

    await productCategory.destroy({
      where: {
        idProduct: id,
      },
    });

    let productCategoryData = [];
    if (categoryId != 0 && categoryId[0] != "") {
      productCategoryData = categoryId.map((item) => {
        return { idProduct: parseInt(id), idCategory: parseInt(item) };
      });
    }

    if (productCategoryData.length != 0) {
      await productCategory.bulkCreate(productCategoryData);
    }

    await product.update(data, {
      where: {
        id,
      },
    });

    res.status(200).send({
      status: "Success",
      message: `Update product at id: ${id} success`,
      data: {
        id,
        data,
        productCategoryData,
        image: process.env.PATH_FILE + req?.file?.filename,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      status: "Updated product failed",
      message: "Server Error",
    });
  }
};

// ============ DELETE PRODUCT ===========
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    // Get product
    const getProduct = await product.findOne({
      where: { id },
    });

    await cloudinary.uploader.destroy(getProduct.image, (error, result) => {
      console.log("result : ", result);
      console.log("error : ", error);
    });

    // Delete product at database
    const products = await product.destroy({
      where: { id },
    });

    res.status(200).send({
      status: "Success",
      message: `Delete product: ${id} success`,
      data: {
        products: {
          id: { id },
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      status: "Delete product failed",
      message: "Server Error",
    });
  }
};
