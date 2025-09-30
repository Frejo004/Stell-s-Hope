import { Review } from '../types';

export const reviews: Review[] = [
  {
    id: '1',
    productId: '1',
    customerName: 'Marie L.',
    rating: 5,
    comment: 'Excellente qualité, la coupe est parfaite et le tissu très agréable. Je recommande !',
    date: '2024-01-15',
    hasPhoto: true,
    photoUrl: 'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg',
    customerSize: 'M',
    customerHeight: '1m70'
  },
  {
    id: '2',
    productId: '1',
    customerName: 'Antoine D.',
    rating: 4,
    comment: 'Très belle chemise, taille normalement. Petit bémol sur les boutons qui pourraient être plus solides.',
    date: '2024-01-10',
    hasPhoto: false,
    customerSize: 'L',
    customerHeight: '1m85'
  },
  {
    id: '3',
    productId: '2',
    customerName: 'Sophie M.',
    rating: 5,
    comment: 'Cette robe est magnifique ! La coupe est très flatteuse et le tissu de grande qualité. Parfaite pour le bureau comme pour les sorties.',
    date: '2024-01-20',
    hasPhoto: true,
    photoUrl: 'https://images.pexels.com/photos/1462456/pexels-photo-1462456.jpeg',
    customerSize: 'S',
    customerHeight: '1m65'
  }
];