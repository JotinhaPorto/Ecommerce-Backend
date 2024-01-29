import { RequestHandler } from "express";
import * as Store from "../services/store";
import * as Auth from "../services/auth";
import { ApiErrorValidationFields } from "../utils/ApiError";
import { z } from "zod";

export const getStoreByUserId: RequestHandler = async (req, res) => {

    const store = await Store.getStoreByUserId(req.user as string)

    res.json(store)
}
export const getStoreByStoreId: RequestHandler = async (req, res) => {

    const { id } = req.params

    const store = await Store.getStoreByStoreId(id)

    res.json(store)
}



export const getAllStores: RequestHandler = async (req, res) => {

    const stores = await Store.getAllStores(req.user as string)

    res.json(stores)
}

export const createStore: RequestHandler = async (req, res) => {

    const createStoreSchema = z.object({
        name: z.string().min(4, "Nome deve ter pelo menos 4 caracteres"),
    })

    const data = createStoreSchema.safeParse(req.body)

    if (!data.success) {
        throw new ApiErrorValidationFields("Dados inválidos", 200)
    }


    const user = await Auth.getUserById(req.user as string)

    if (!user) {
        throw new ApiErrorValidationFields("Não autorizado", 400)
    }

    const store = await Store.createStore({ name: data.data.name, userId: user.id })

    if (!store) {
        throw new ApiErrorValidationFields("Erro interno ao criar store", 400)
    }

    res.json(store)
}
export const deleteStore: RequestHandler = async (req, res) => {

    const { id } = req.params

    const deleteStore = await Store.deleteStore(id)

    if (!deleteStore) {
        throw new ApiErrorValidationFields("Erro interno ao deletar loja", 400)
    }

    res.json(deleteStore)
}

export const editStore: RequestHandler = async (req, res) => {
    const { id } = req.params
    console.log(id)

    const editStoreSchema = z.object({
        name: z.string().min(4, "Nome deve ter pelo menos 4 caracteres"),
    })

    const data = editStoreSchema.safeParse(req.body)

    if (!data.success) {
        throw new ApiErrorValidationFields("Dados inválidos", 200)
    }


    const editStore = await Store.editStore(id, data.data.name)

    if (!editStore) {
        throw new ApiErrorValidationFields("Erro interno ao editar loja", 400)
    }

    res.json(editStore)
}