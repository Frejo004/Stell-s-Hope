import { Product } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Chemise Oxford Premium',
    price: 79.90,
    originalPrice: 99.90,
    images: [
      'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg',
      'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg',
      'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg',
      'https://images.pexels.com/photos/1040946/pexels-photo-1040946.jpeg'
    ],
    category: 'homme',
    type: 'hauts',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Blanc', 'Bleu marine', 'Rose poudré'],
    description: 'Chemise Oxford en coton premium, coupe moderne et confortable. Parfaite pour un look décontracté-chic.',
    composition: '100% Coton biologique certifié GOTS',
    care: 'Lavage machine 30°C, repassage moyen, pas de sèche-linge',
    rating: 4.5,
    reviewCount: 24,
    isOnSale: true,
    isBestSeller: true
  },
  {
    id: '2',
    name: 'Robe Midi Évasée',
    price: 129.90,
    images: [
      'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg',
      'https://images.pexels.com/photos/1462456/pexels-photo-1462456.jpeg',
      'https://images.pexels.com/photos/1462460/pexels-photo-1462460.jpeg',
      'https://images.pexels.com/photos/1462454/pexels-photo-1462454.jpeg'
    ],
    category: 'femme',
    type: 'hauts',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Noir', 'Camel', 'Bordeaux'],
    description: 'Robe midi élégante avec coupe évasée, parfaite pour toutes les occasions.',
    composition: '95% Viscose, 5% Élasthanne',
    care: 'Lavage à la main recommandé, séchage à plat',
    rating: 4.8,
    reviewCount: 31,
    isNew: true,
    isBestSeller: true
  },
  {
    id: '3',
    name: 'Jean Slim Stretch',
    price: 89.90,
    images: [
      'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg',
      'https://images.pexels.com/photos/1598506/pexels-photo-1598506.jpeg',
      'https://images.pexels.com/photos/603022/pexels-photo-603022.jpeg',
      'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg'
    ],
    category: 'unisexe',
    type: 'bas',
    sizes: ['28', '29', '30', '31', '32', '33', '34', '36'],
    colors: ['Brut', 'Délavé', 'Noir'],
    description: 'Jean slim stretch confortable avec finitions soignées. Coupe moderne et flatteuse.',
    composition: '98% Coton, 2% Élasthanne',
    care: 'Lavage machine 30°C à l\'envers, pas de javel',
    rating: 4.3,
    reviewCount: 18,
    isBestSeller: true
  },
  {
    id: '4',
    name: 'Sac Cabas Cuir Premium',
    price: 159.90,
    images: [
      'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg',
      'https://images.pexels.com/photos/1152078/pexels-photo-1152078.jpeg',
      'https://images.pexels.com/photos/1152079/pexels-photo-1152079.jpeg',
      'https://images.pexels.com/photos/1152080/pexels-photo-1152080.jpeg'
    ],
    category: 'femme',
    type: 'accessoires',
    sizes: ['Unique'],
    colors: ['Cognac', 'Noir', 'Taupe'],
    description: 'Sac cabas spacieux en cuir véritable avec doublure contrastante et multiples poches.',
    composition: 'Cuir pleine fleur tannage végétal, doublure coton',
    care: 'Nettoyer avec un chiffon doux, éviter l\'eau',
    rating: 4.7,
    reviewCount: 42,
    isNew: true
  },
  {
    id: '5',
    name: 'Pull Col Roulé Cachemire',
    price: 199.90,
    originalPrice: 249.90,
    images: [
      'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg',
      'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg',
      'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg',
      'https://images.pexels.com/photos/1040946/pexels-photo-1040946.jpeg'
    ],
    category: 'femme',
    type: 'hauts',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Beige', 'Gris chiné', 'Noir', 'Camel'],
    description: 'Pull col roulé en cachemire pur, douceur et élégance pour l\'hiver.',
    composition: '100% Cachemire grade A',
    care: 'Lavage à la main ou pressing, séchage à plat',
    rating: 4.9,
    reviewCount: 15,
    isOnSale: true
  },
  {
    id: '6',
    name: 'Sneakers Minimalistes',
    price: 119.90,
    images: [
      'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg',
      'https://images.pexels.com/photos/1464624/pexels-photo-1464624.jpeg',
      'https://images.pexels.com/photos/1464623/pexels-photo-1464623.jpeg',
      'https://images.pexels.com/photos/1464622/pexels-photo-1464622.jpeg'
    ],
    category: 'unisexe',
    type: 'accessoires',
    sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
    colors: ['Blanc', 'Noir', 'Gris'],
    description: 'Sneakers au design épuré et intemporel. Confort optimal pour le quotidien.',
    composition: 'Cuir végétal, semelle en caoutchouc recyclé',
    care: 'Nettoyer avec un chiffon humide',
    rating: 4.4,
    reviewCount: 28,
    isBestSeller: true
  }
];