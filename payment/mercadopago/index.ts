export const paymentCheckoutMercadopago = async (order:Order) =>{

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