import { Review } from '../types';

export const reviews: Review[] = [
  {
    id: 1,
    product_id: 1,
    customerName: 'Marie L.',
    rating: 5,
    comment: 'Excellente qualité, la coupe est parfaite et le tissu très agréable. Je recommande !',
    date: '2024-01-15',
    is_approved: true,
    created_at: '2024-01-15T12:00:00Z',
    updated_at: '2024-01-15T12:00:00Z',
    user_id: 0,
    user: { id: 0, first_name: 'Marie', last_name: 'L.' },
    customerSize: 'M',
    customerHeight: '1m70'
  } as any, // Temporary cast until we fully unify mock and real reviews
  {
    id: 2,
    product_id: 1,
    customerName: 'Antoine D.',
    rating: 4,
    comment: 'Très belle chemise, taille normalement. Petit bémol sur les boutons qui pourraient être plus solides.',
    date: '2024-01-10',
    is_approved: true,
    created_at: '2024-01-10T12:00:00Z',
    updated_at: '2024-01-10T12:00:00Z',
    user_id: 0,
    user: { id: 0, first_name: 'Antoine', last_name: 'D.' },
    customerSize: 'L',
    customerHeight: '1m85'
  } as any,
  {
    id: 3,
    product_id: 2,
    customerName: 'Sophie M.',
    rating: 5,
    comment: 'Cette robe est magnifique ! La coupe est très flatteuse et le tissu de grande qualité. Parfaite pour le bureau comme pour les sorties.',
    date: '2024-01-20',
    is_approved: true,
    created_at: '2024-01-20T12:00:00Z',
    updated_at: '2024-01-20T12:00:00Z',
    user_id: 0,
    user: { id: 0, first_name: 'Sophie', last_name: 'M.' },
    customerSize: 'S',
    customerHeight: '1m65'
  } as any
];