import { useState, useEffect  } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface Attribute {
  id: number;
  name: string;
  values: string[];
}

interface Variant {
  id?: string | number;
  sku: string;
  price: string;
  stock_quantity: string;
  attributes: Record<string, string>;
}

interface ProductVariantManagerProps {
  attributes: Attribute[];
  onChange: (variants: Variant[]) => void;
  initialVariants?: Variant[];
}

export default function ProductVariantManager({ 
  attributes, 
  onChange,
  initialVariants = []
}: ProductVariantManagerProps) {
  const [variants, setVariants] = useState<Variant[]>(initialVariants);
  const [newVariant, setNewVariant] = useState<Omit<Variant, 'id'>>({
    sku: '',
    price: '',
    stock_quantity: '',
    attributes: {},
  });

  useEffect(() => {
    onChange(variants);
  }, [variants]);

  const handleAddVariant = () => {
    if (!newVariant.sku || !newVariant.price || !newVariant.stock_quantity) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    if (Object.keys(newVariant.attributes).length === 0) {
      alert('Veuillez sélectionner au moins un attribut');
      return;
    }

    setVariants([...variants, { ...newVariant, id: Date.now().toString() }]);
    setNewVariant({
      sku: '',
      price: '',
      stock_quantity: '',
      attributes: {},
    });
  };

  const handleRemoveVariant = (id: string | number) => {
    setVariants(variants.filter(v => v.id !== id));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Variantes de produit</h3>
      
      {/* Liste des variantes existantes */}
      {variants.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                {attributes.map(attr => (
                  <th key={attr.id} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {attr.name}
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {variants.map(variant => (
                <tr key={variant.id}>
                  <td className="px-4 py-3 text-sm text-gray-900">{variant.sku}</td>
                  {attributes.map(attr => (
                    <td key={attr.id} className="px-4 py-3 text-sm text-gray-900">
                      {variant.attributes[attr.id] || '-'}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-sm text-gray-900">{variant.price}€</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{variant.stock_quantity}</td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(variant.id!)}
                      className="text-red-600 hover:text-red-900"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Formulaire pour ajouter une nouvelle variante */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Ajouter une variante</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
            <input
              type="text"
              placeholder="SKU unique"
              value={newVariant.sku}
              onChange={(e) => setNewVariant({ ...newVariant, sku: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {attributes.map(attr => {
            // S'assurer que values est un tableau
            let parsedValues;
            if (typeof attr.values === 'string') {
              try {
                parsedValues = JSON.parse(attr.values);
              } catch (e) {
                console.error('Could not parse attribute values string:', attr.values, e);
                parsedValues = [];
              }
            } else {
              parsedValues = attr.values;
            }

            const values = Array.isArray(parsedValues) ? parsedValues : [];
            
            return (
              <div key={attr.id}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{attr.name}</label>
                <select
                  value={newVariant.attributes[attr.id] || ''}
                  onChange={(e) => 
                    setNewVariant({ 
                      ...newVariant, 
                      attributes: { 
                        ...newVariant.attributes, 
                        [attr.id]: e.target.value 
                      } 
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner {attr.name}</option>
                  {values.map((value: string) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€)</label>
            <input
              type="number"
              step="0.01"
              placeholder="Prix"
              value={newVariant.price}
              onChange={(e) => setNewVariant({ ...newVariant, price: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
            <input
              type="number"
              placeholder="Quantité"
              value={newVariant.stock_quantity}
              onChange={(e) => setNewVariant({ ...newVariant, stock_quantity: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <button
          type="button"
          onClick={handleAddVariant}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter la variante
        </button>
      </div>
    </div>
  );
}
