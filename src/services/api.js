// src/services/api.js

// 1. Busca FIPE via Brasil API
// A Brasil API exige o código FIPE ou uma busca sequencial (Marcas -> Modelos -> Anos).
// Para simplificar, vou mostrar como buscar o valor se você já tem o código FIPE do carro,
// ou como buscar a lista de marcas.

export async function fetchFipeBrands() {
  try {
    const response = await fetch('https://brasilapi.com.br/api/fipe/marcas/v1/carros');
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar marcas FIPE:", error);
    return [];
  }
}
