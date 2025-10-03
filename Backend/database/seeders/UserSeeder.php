<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            ['Marie', 'Dupont', 'marie.dupont@email.com', '+33123456789'],
            ['Pierre', 'Martin', 'pierre.martin@email.com', '+33123456790'],
            ['Sophie', 'Bernard', 'sophie.bernard@email.com', '+33123456791'],
            ['Lucas', 'Petit', 'lucas.petit@email.com', '+33123456792'],
            ['Emma', 'Robert', 'emma.robert@email.com', '+33123456793'],
            ['Thomas', 'Richard', 'thomas.richard@email.com', '+33123456794'],
            ['Léa', 'Durand', 'lea.durand@email.com', '+33123456795'],
            ['Hugo', 'Moreau', 'hugo.moreau@email.com', '+33123456796'],
            ['Chloé', 'Simon', 'chloe.simon@email.com', '+33123456797'],
            ['Antoine', 'Laurent', 'antoine.laurent@email.com', '+33123456798'],
        ];

        $cities = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier'];
        $countries = ['France', 'Belgique', 'Suisse', 'Canada'];

        foreach ($users as $userData) {
            User::create([
                'first_name' => $userData[0],
                'last_name' => $userData[1],
                'email' => $userData[2],
                'password' => Hash::make('password'),
                'phone' => $userData[3],
                'address' => rand(1, 999) . ' rue de la ' . ['Paix', 'République', 'Liberté'][rand(0, 2)],
                'city' => $cities[array_rand($cities)],
                'postal_code' => rand(10000, 99999),
                'country' => $countries[array_rand($countries)],
                'is_admin' => false,
                'is_active' => true,
            ]);
        }
    }
}