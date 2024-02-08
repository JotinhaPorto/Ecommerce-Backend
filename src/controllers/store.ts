import { RequestHandler } from "express";
import * as Store from "../services/store";
import * as Auth from "../services/auth";
import { ApiErrorValidationFields } from "../utils/ApiError";
import { z } from "zod";

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
  console.log(id);

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

  const deletedSize = await Store.deleteSize(storeId, sizeId);

  if (!deletedSize) {
    throw new ApiErrorValidationFields("Erro interno ao deletar tamanho", 400);
  }

  res.json(deletedSize);
};
