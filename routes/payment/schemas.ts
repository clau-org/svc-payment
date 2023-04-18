
import { z } from "../../deps.ts";

// Validation schema definition
export const productSchema = z.object({
    name:       z.string().nonempty(), // Product name, cannot be empty
    price:      z.number().positive(), // Product price, must be a positive number
    image:      z.string().url().optional(), // Product image URL, optional
    quantity:   z.number().positive(), // Product quantity, required
});
  
export const paymentMethodSchema = z.object({
    method: z.union([
        z.literal("stripe"), // Literal value "stripe"
        z.literal("mercadopago"), // Literal value "mercadopago"
        // Add other allowed payment methods here
    ]),
    key: z.string().optional(), // Optional attribute for the payment method key
    urls: z.object({
        success: z.string(), // URL de éxito (requerido)
        failure: z.string(), // URL de fallo (requerido)
        pending: z.string().optional(), // URL de pendiente (opcional)
    })
});
  
export const orderSchema = z.object({
    products: z.array(productSchema).min(1), // Array of products, each product must comply with productSchema
    paymentMethod: paymentMethodSchema, // Payment method, must comply with paymentMethodSchema
});