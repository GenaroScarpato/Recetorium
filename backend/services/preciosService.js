const axios = require('axios');

const consultarPrecio = async (nombreProducto) => {
  try {
    const response = await axios.get('https://api.mercadolibre.com/sites/MLA/search', {
      params: {
        q: nombreProducto,
        limit: 1,
      },
    });

    const { results } = response.data;
      return results[0].price;
    
  } catch (error) {
    console.error('Error al consultar el precio:', error);
    throw error;
  }
};

module.exports = { consultarPrecio };