import { RequestHandler } from "express";
import * as Store from "../services/store";
import * as Auth from "../services/auth";
import { ApiErrorValidationFields } from "../utils/ApiError";
import { z } from "zod";
import { BillboardRequestFile } from "../types/Billboard";
import { S3Client, S3, DeleteObjectCommandInput } from "@aws-sdk/client-s3";

export const getFirstStoreByUserId: RequestHandler = async (req, res) => {
  const store = await Store.getFirstStoreByUserId(req.user as string);

  res.json(store);
};
export const getStoreByStoreId: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const store = await Store.getStoreByStoreId(id);

  res.json(store);
};

export const getAllStores: RequestHandler = async (req, res) => {
  const stores = await Store.getAllStores(req.user as string);

  res.json(stores);
};

export const createStore: RequestHandler = async (req, res) => {
  const createStoreSchema = z.object({
    name: z.string().min(4, "Nome deve ter pelo menos 4 caracteres"),
  });

  const data = createStoreSchema.safeParse(req.body);

  if (!data.success) {
    throw new ApiErrorValidationFields("Dados inválidos", 200);
  }

  const user = await Auth.getUserById(req.user as string);

  if (!user) {
    throw new ApiErrorValidationFields("Não autorizado", 400);
  }

  const store = await Store.createStore({
    name: data.data.name,
    userId: user.id,
  });

  if (!store) {
    throw new ApiErrorValidationFields("Erro interno ao criar store", 400);
  }

  res.json(store);
};
export const deleteStore: RequestHandler = async (req, res) => {
  const { id } = req.params;

  const deleteStore = await Store.deleteStore(id);

  if (!deleteStore) {
    throw new ApiErrorValidationFields("Erro interno ao deletar loja", 400);
  }

  res.json(deleteStore);
};

export const editStore: RequestHandler = async (req, res) => {
  const { id } = req.params;

  const editStoreSchema = z.object({
    name: z.string().min(4, "Nome deve ter pelo menos 4 caracteres"),
  });

  const data = editStoreSchema.safeParse(req.body);

  if (!data.success) {
    throw new ApiErrorValidationFields("Dados inválidos", 200);
  }

  const editStore = await Store.editStore(id, data.data.name);

  if (!editStore) {
    throw new ApiErrorValidationFields("Erro interno ao editar loja", 400);
  }

  res.json(editStore);
};

export const createColor: RequestHandler = async (req, res) => {
  const { storeId } = req.params;

  const createColorStoreSchema = z.object({
    name: z
      .string()
      .min(4, "Nome deve ter mais que 4 caracteres")
      .max(10, "Nome deve ter menos que 10 caracteres"),
    value: z.string().min(4).max(9).regex(/^#/, {
      message: "A string deve ser um valor de uma cor do tipo hex válida",
    }),
  });

  const data = createColorStoreSchema.safeParse(req.body);

  if (!data.success) {
    throw new ApiErrorValidationFields("Dados inválidos", 200);
  }

  const storeByStoreId = await Store.getStoreByStoreId(storeId);

  if (!storeByStoreId) {
    throw new ApiErrorValidationFields("Loja inexistente", 400);
  }

  const createColor = await Store.createColor({
    name: data.data.name,
    value: data.data.value,
    storeId: storeByStoreId.id,
  });

  if (!createColor) {
    throw new ApiErrorValidationFields("Erro interno ao criar cor", 400);
  }

  res.json(createColor);
};

export const getAllColors: RequestHandler = async (req, res) => {
  const { storeId } = req.params;

  const colors = await Store.getAllColors(storeId);

  if (!colors) {
    throw new ApiErrorValidationFields("Erro interno ao buscar cores", 400);
  }

  res.json(colors);
};

export const getColorById: RequestHandler = async (req, res) => {
  const { storeId, colorId } = req.params;

  const color = await Store.getColorById(storeId, colorId);

  res.json(color);
};

export const updateColor: RequestHandler = async (req, res) => {
  const { storeId, colorId } = req.params;

  const updateColorSchema = z.object({
    name: z.string().min(4, "Nome deve ter pelo menos 4 caracteres"),
    value: z.string().min(4).max(9).regex(/^#/, {
      message: "A string deve ser um valor de uma cor do tipo hex válida",
    }),
  });

  const data = updateColorSchema.safeParse(req.body);

  if (!data.success) {
    throw new ApiErrorValidationFields("Dados inválidos", 200);
  }

  const updateColor = await Store.updateColor(storeId, colorId, data.data);

  if (!updateColor) {
    throw new ApiErrorValidationFields("Erro interno ao atualizar cor", 400);
  }

  res.json(updateColor);
};

export const deleteColor: RequestHandler = async (req, res) => {
  const { storeId, colorId } = req.params;
  const isUsedInProduct = await Store.getProductByColorId(storeId, colorId);
  if (isUsedInProduct) {
    throw new ApiErrorValidationFields("Esta cor está sendo usada em um produto", 400)
  }
  const deletedColor = await Store.deleteColor(storeId, colorId);

  if (!deletedColor) {
    throw new ApiErrorValidationFields("Erro interno ao deletar cor", 400);
  }

  res.json(deletedColor);
};
export const createSize: RequestHandler = async (req, res) => {
  const { storeId } = req.params;

  const createSizeStoreSchema = z.object({
    name: z
      .string()
      .min(4, "Nome deve ter mais que 4 caracteres")
      .max(10, "Nome deve ter menos que 10 caracteres"),
    value: z.string().min(1).max(4),
  });

  const data = createSizeStoreSchema.safeParse(req.body);

  if (!data.success) {
    throw new ApiErrorValidationFields("Dados inválidos", 200);
  }

  const storeByStoreId = await Store.getStoreByStoreId(storeId);

  if (!storeByStoreId) {
    throw new ApiErrorValidationFields("Loja inexistente", 400);
  }

  const createSize = await Store.createSize({
    name: data.data.name,
    value: data.data.value,
    storeId: storeByStoreId.id,
  });

  if (!createSize) {
    throw new ApiErrorValidationFields("Erro interno ao criar tamanho", 400);
  }

  res.json(createSize);
};

export const getAllSizes: RequestHandler = async (req, res) => {
  const { storeId } = req.params;

  const sizes = await Store.getAllSizes(storeId);

  if (!sizes) {
    throw new ApiErrorValidationFields("Erro interno ao buscar tamanhos", 400);
  }

  res.json(sizes);
};

export const getSizeById: RequestHandler = async (req, res) => {
  const { storeId, sizeId } = req.params;

  const size = await Store.getSizeById(storeId, sizeId);

  res.json(size);
};

export const updateSize: RequestHandler = async (req, res) => {
  const { storeId, sizeId } = req.params;

  const updateSizeSchema = z.object({
    name: z.string().min(4, "Nome deve ter pelo menos 4 caracteres"),
    value: z.string().min(1, "Nome deve ter pelo menos 1 caractere"),
  });

  const data = updateSizeSchema.safeParse(req.body);

  if (!data.success) {
    throw new ApiErrorValidationFields("Dados inválidos", 200);
  }

  const updatedSized = await Store.updateSize(storeId, sizeId, data.data);

  if (!updatedSized) {
    throw new ApiErrorValidationFields(
      "Erro interno ao atualizar tamanho",
      400
    );
  }

  res.json(updatedSized);
};

export const deleteSize: RequestHandler = async (req, res) => {
  const { storeId, sizeId } = req.params;
  const isUsedInProduct = await Store.getProductBySizeId(storeId, sizeId);
  if (isUsedInProduct) {
    throw new ApiErrorValidationFields("Esta tamanho está sendo usado em um produto", 400)
  }
  const deletedSize = await Store.deleteSize(storeId, sizeId);

  if (!deletedSize) {
    throw new ApiErrorValidationFields("Erro interno ao deletar tamanho", 400);
  }

  res.json(deletedSize);
};

export const createBillboard: RequestHandler = async (req, res) => {
  const { storeId } = req.params
  const { label, image: { location, originalname, key, size } } = req.body


  const billboard = await Store.createBillboard({
    label,
    storeId,
    image: {
      url: location,
      name: originalname,
      key: key,
      size: size

    }
  })

  if (!billboard) {
    throw new ApiErrorValidationFields("Erro interno ao criar billboard", 400)
  }
  return res.json(billboard)
};

export const updateBillboard: RequestHandler = async (req, res) => {
  const { storeId, billboardId } = req.params
  const { label, image: { location, originalname, key, size } } = req.body
  const billboard = await Store.updateBillboard(billboardId, {
    storeId,
    label,
    image: {
      url: location ? location : req.body.image.url,
      name: originalname ? originalname : req.body.image.name,
      key: key ? key : req.body.image.key,
      size: size ? size : req.body.image.size
    }
  })
  if (!billboard) {
    throw new ApiErrorValidationFields("Erro interno ao atualizar billboard", 400)
  }
  return res.json(billboard)
}

export const getBillboardById: RequestHandler = async (req, res) => {
  const { storeId, billboardId } = req.params;

  const billboard = await Store.getBillboardById(storeId, billboardId);
  res.json(billboard);
};

export const getAllBillboards: RequestHandler = async (req, res) => {
  const { storeId } = req.params;

  const billboards = await Store.getAllBillboards(storeId);

  if (!billboards) {
    throw new ApiErrorValidationFields("Erro interno ao buscar outdoors", 400);
  }

  res.json(billboards);
};


export const deleteBillboard: RequestHandler = async (req, res) => {
  const { storeId, billboardId } = req.params;

  const isUsedInCategory = await Store.getCategoryByBillboardId(storeId, billboardId)
  if (isUsedInCategory) {
    throw new ApiErrorValidationFields("Esta outdoor está sendo usada em uma categoria", 400)
  }
  const deletedBillboard = await Store.deleteBillboard(storeId, billboardId);

  if (!deletedBillboard) {
    throw new ApiErrorValidationFields("Erro interno ao deletar outdoor", 400);
  }

  res.json(deletedBillboard);

};

export const uploadImage: RequestHandler = async (req, res) => {
  res.json(req.file);
}

export const createCategory: RequestHandler = async (req, res) => {
  const { storeId } = req.params
  const { name, billboardId } = req.body
  const category = await Store.createCategory({ name, storeId, billboardId })
  if (!category) {
    throw new ApiErrorValidationFields("Erro interno ao criar categoria", 400)
  }
  return res.json(category)
}

export const getAllCategories: RequestHandler = async (req, res) => {
  const { storeId } = req.params
  const categories = await Store.getAllCategories(storeId)
  if (!categories) {
    throw new ApiErrorValidationFields("Erro interno ao buscar categorias", 400)
  }
  return res.json(categories)
}
export const getCategoryById: RequestHandler = async (req, res) => {
  const { storeId, categoryId } = req.params
  const category = await Store.getCategoryById(storeId, categoryId)
  return res.json(category)
}

export const updateCategory: RequestHandler = async (req, res) => {
  const { storeId, categoryId } = req.params
  const { name, billboardId } = req.body
  const teste = await Store.updateCategory(storeId, categoryId, { name, billboardId })
  return res.json(teste)
}

export const deleteCategory: RequestHandler = async (req, res) => {
  const { storeId, categoryId } = req.params
  console.log("storeId, categoryId", storeId, categoryId)
  const isUsedInProduct = await Store.getProductByCategoryId(storeId, categoryId)
  console.log("isUsedInProduct", isUsedInProduct)
  if (isUsedInProduct) {
    throw new ApiErrorValidationFields("Esta categoria está sendo usada em um produto", 400)
  }
  const deletedCategory = await Store.deleteCategory(storeId, categoryId)
  if (!deletedCategory) {
    throw new ApiErrorValidationFields("Erro interno ao deletar categoria", 400)
  }
  res.json(deletedCategory)
}

export const getAllProducts: RequestHandler = async (req, res) => {
  const { storeId } = req.params
  const products = await Store.getAllProducts(storeId)
  return res.json(products)
}
export const getProductById: RequestHandler = async (req, res) => {
  const { storeId, productId } = req.params
  const product = await Store.getProductById(storeId, productId)
  return res.json(product)
}

export const createProduct: RequestHandler = async (req, res) => {
  const { storeId } = req.params
  const { name, categoryId, price, colorId, sizeId, isFeatured, isAvailable, image } = req.body
  const renomearPropriedades = image.map((image: any) => ({
    url: image.location,
    name: image.originalname,
    key: image.key,
    size: image.size
  }))
  const product = await Store.createProduct({
    storeId,
    name,
    categoryId,
    price,
    colorId,
    sizeId,
    isFeatured,
    isAvailable,
    image: renomearPropriedades
  })

  if (!product) {
    throw new ApiErrorValidationFields("Erro interno ao criar produto", 400)
  }
  return res.json(product)
}

export const updateProduct: RequestHandler = async (req, res) => {
  const { storeId, productId } = req.params
  const { name, categoryId, price, colorId, sizeId, isFeatured, isAvailable, image } = req.body
  console.log("=====REQ BODY=====")
  console.log(req.body)
  let formattedImages: any = [];

  if (Array.isArray(image)) {
    formattedImages = image.map(img => ({
      url: img.location ? img.location : img.url,
      name: img.originalname ? img.originalname : img.name,
      key: img.key ? img.key : img.key,
      size: img.size ? img.size : img.size
    }));
  }
  const product = await Store.updateProduct(productId, {
    name,
    categoryId,
    price,
    colorId,
    sizeId,
    isFeatured,
    isAvailable,
    image: formattedImages
  })
  console.log("======PRODUCT=====")
  console.log(product)
  res.json(product)
}

export const deleteProduct: RequestHandler = async (req, res) => {
  const { storeId, productId } = req.params

  const productDeleted = await Store.deleteProduct(storeId, productId)
  if (!productDeleted) {
    throw new ApiErrorValidationFields("Erro interno ao deletar produto", 400)
  }
  return res.json(productDeleted)
}

export const uploadImages: RequestHandler = async (req, res) => {
  console.log(req.files)
  res.json(req.files);
}
