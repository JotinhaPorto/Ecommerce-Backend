export interface BillboardRequestFile {
    fieldname?: string
    originalname: string
    encoding?: string
    mimetype?: string
    size: number
    bucket?: string
    key: string
    acl?: string
    contentType?: string
    contentDisposition?: any
    contentEncoding?: any
    storageClass?: string
    serverSideEncryption?: any
    location: string
    etag?: string
}

export interface Billboard {
    label: string;
    storeId: string;
    image: {
        url: string;
        name: string;
        key: string;
        size: number
    }
}

export interface Product {
    name: string;
    storeId: string;
    categoryId: string;
    price: number;
    colorId: string;
    sizeId: string;
    isFeatured: boolean;
    isAvailable: boolean;
    image: {
        url: string;
        name: string;
        key: string;
        size: number
    }[]
}