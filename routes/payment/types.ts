export interface Product {
    name:     string;
    price:    number;
    image?:   string;
    quantity: number;
}
  
export interface Urls {
    success: string,
    failure: string,
    pending: string
}

export interface PaymentMethod {
    method: string;
    key: string;
    urls: Urls
}

export interface Order {
    products: Product[];
    paymentMethod: PaymentMethod;
}

export interface ProductMercadopago {
    title: string;
    unit_price: number;
    picture_url?: string;
    quantity: number;
}

export interface ProductStripe {
    price_data: {
        currency: string;
        product_data: {
            name: string;
            images?: string[];
        };
        unit_amount: number;
    };
    quantity: number;
}

export interface PaymentTransaction {
    id: string;
    paymentUrl: string;
    paymentPlatform: string;
}