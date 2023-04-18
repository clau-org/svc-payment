export const paymentCheckoutStripe = async (order:Order) =>{

  const stripeClient = stripe(order.paymentMethod.key)

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