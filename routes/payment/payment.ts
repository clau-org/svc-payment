
import { response } from "https://esm.sh/v115/har-schema@2.0.0/deno/har-schema.mjs";
import { mercadopago, stripe }  from "../../deps.ts";
import { ServiceContext } from "../../service.ts";
import { Order, ProductMercadopago, PaymentTransaction, ProductStripe } from "./types.ts";

export const payment =  async (ctx:any) => {
    const { config, event,  } = ctx as ServiceContext;

    let data = null
    if(event.paymentMethod.method == 'stripe') data =  await paymentStripe(event)
    if(event.paymentMethod.method == 'mercadopago') data =  await paymentForMercadopago(event)

    return {
      data: {
        data,
        // config,
        // event,
      },
      message: "hello",
    };
}



const paymentForMercadopago = async (order:Order) =>{

  mercadopago.configure({
      access_token: order.paymentMethod.key
  });

  const products: ProductMercadopago[] = order.products.map(product => {
    const { name, price, image, quantity } = product;
    return {
      title: name,
      unit_price: price,
      picture_url: image,
      quantity
    };
  });

  const preference = {
      items: products,
      back_urls: {
          success: order.paymentMethod.urls.success,
          failure: order.paymentMethod.urls.failure,
          pending: order.paymentMethod.urls.pending
      },
      auto_return: 'approved'
  };
            
  const response = await mercadopago.preferences.create(preference);


  const paymentTransaction : PaymentTransaction = {
    id: response.body.id,
    paymentUrl: response.body.init_point,
    paymentPlatform: order.paymentMethod.method ,
  }
  return paymentTransaction;
}

const paymentStripe = async (order:Order) =>{

  const stripeClient = stripe(order.paymentMethod.key)
  // const stripeClient = stripe('sk_test_51KgGJyBOqmSp6J1dKgVYu8NOZDwTO7qBgZpCguZyMo3U3hIbcP3bOtRgO7JjaDjIq54c5du3cxZB0vvwc2tez7Md00GvTzdkDt')


  const products: ProductStripe[] = order.products.map(product => {
    const { name, price, image, quantity } = product;
    return {
      price_data: {
        currency: 'usd', // Actualiza la moneda según tus necesidades
        product_data: {
          name,
          images: image ? [image] : undefined, // Agrega la imagen si está presente en el producto original
        },
        unit_amount: Math.floor(price * 100), // Convierte el precio a centavos
      },
      quantity,
    };
  });

  const preference = {
    payment_method_types: ['card'],
    line_items: products,
    mode: 'payment',
    success_url:  order.paymentMethod.urls.success,
    cancel_url:   order.paymentMethod.urls.failure,
  };
            
  const response = await stripeClient.checkout.sessions.create(preference);

  const paymentTransaction : PaymentTransaction = {
    id: response.id,
    paymentUrl: response.url,
    paymentPlatform: order.paymentMethod.method ,
  }
  return paymentTransaction;
}