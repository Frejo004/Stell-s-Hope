import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function ApiTest() {
  const [status, setStatus] = useState('Testing API connection...');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const testApi = async () => {
      try {
        // Test des produits
        const productsResponse = await api.get('/products');
        setProducts(productsResponse.data);
        
        // Test des catégories
        const categoriesResponse = await api.get('/categories');
        setCategories(categoriesResponse.data);
        
        setStatus('✅ API connection successful!');
      } catch (error) {
        console.error('API Test Error:', error);
        setStatus('❌ API connection failed: ' + (error.response?.data?.message || error.message));
      }
    };

    testApi();
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">API Connection Test</h1>
      
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="font-semibold mb-2">Status:</h2>
        <p>{status}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Categories ({categories.length})</h2>
          <div className="bg-white border rounded p-4 max-h-60 overflow-y-auto">
            {categories.length > 0 ? (
              <ul className="space-y-2">
                {categories.map((category: any) => (
                  <li key={category.id} className="border-b pb-2">
                    <strong>{category.name}</strong>
                    <br />
                    <small className="text-gray-600">{category.description}</small>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No categories loaded</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Products ({products.length})</h2>
          <div className="bg-white border rounded p-4 max-h-60 overflow-y-auto">
            {products.length > 0 ? (
              <ul className="space-y-2">
                {products.slice(0, 5).map((product: any) => (
                  <li key={product.id} className="border-b pb-2">
                    <strong>{product.name}</strong>
                    <br />
                    <span className="text-green-600">${product.price}</span>
                    <br />
                    <small className="text-gray-600">{product.type} - {product.gender}</small>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No products loaded</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}