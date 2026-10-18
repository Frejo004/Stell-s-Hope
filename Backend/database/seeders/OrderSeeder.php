<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use App\Models\Product;
use Carbon\Carbon;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::where('is_admin', false)->get();
        $products = Product::where('is_active', true)->get();
        $statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

        for ($i = 0; $i < 100; $i++) {
            $user = $users->random();
            $orderProducts = $products->random(rand(1, 5));
            $total = 0;

            $order = Order::create([
                'user_id' => $user->id,
                'order_number' => 'ORD-' . (time() + $i),
                'status' => $statuses[array_rand($statuses)],
                'total' => 0,
                'shipping_address' => [
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'street' => $user->address ?? 'Rue du Commerce, Plateau',
                    'city' => $user->city ?? 'Abidjan',
                    'postal_code' => (string) ($user->postal_code ?? '01 BP 1234'),
                    'country' => $user->country ?? 'Côte d\'Ivoire',
                    'phone' => $user->phone ?? '+225 07 00 00 00 00',
                ],
                'billing_address' => [
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'street' => $user->address ?? 'Rue du Commerce, Plateau',
                    'city' => $user->city ?? 'Abidjan',
                    'postal_code' => (string) ($user->postal_code ?? '01 BP 1234'),
                    'country' => $user->country ?? 'Côte d\'Ivoire',
                    'phone' => $user->phone ?? '+225 07 00 00 00 00',
                ],
                'payment_method' => ['card', 'mobile_money', 'moneroo'][rand(0, 2)],
                'payment_status' => ['pending', 'paid', 'failed'][rand(0, 2)],
                'created_at' => Carbon::now()->subDays(rand(0, 90)),
            ]);

            foreach ($orderProducts as $product) {
                $quantity = rand(1, 3);
                $total += $product->price * $quantity;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'price' => $product->price,
                ]);
            }

            $order->update(['total' => $total]);
        }
    }
}