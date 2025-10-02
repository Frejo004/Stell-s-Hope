# 🚀 GUIDE COMPLET - SETUP LARAVEL POUR STELL'S HOPE

## 📋 TABLE DES MATIÈRES
1. [Installation Laravel](#1-installation-laravel)
2. [Configuration Base de Données](#2-configuration-base-de-données)
3. [Migrations & Schéma](#3-migrations--schéma)
4. [Modèles Eloquent](#4-modèles-eloquent)
5. [Authentication API](#5-authentication-api)
6. [Controllers & Routes](#6-controllers--routes)
7. [Admin Panel Filament](#7-admin-panel-filament)
8. [CORS pour React](#8-cors-pour-react)
9. [Intégration Frontend](#9-intégration-frontend)
10. [Déploiement](#10-déploiement)

---

## 1️⃣ INSTALLATION LARAVEL

### Prérequis
```bash
# Vérifier versions
php --version    # Minimum PHP 8.2
composer --version
```

### Installer Laravel
```bash
# Créer le projet backend
cd c:\Users\frejo\Documents\CODE\Stell-s-Hope
composer create-project laravel/laravel backend

cd backend
```

### Installer Packages Essentiels
```bash
# Auth API (Sanctum)
composer require laravel/sanctum

# Admin Panel (Filament)
composer require filament/filament:"^3.2" -W

# CORS
composer require fruitcake/laravel-cors

# Intervention Image (optimisation images)
composer require intervention/image

# Laravel Cashier (Stripe - optionnel pour paiements)
composer require laravel/cashier

# Debugbar (dev uniquement)
composer require barryvdh/laravel-debugbar --dev
```

### Structure Initiale
```
Stell-s-Hope/
├── Frontend/           # Votre React app existante
└── backend/           # Nouveau Laravel API
    ├── app/
    ├── database/
    ├── routes/
    └── ...
```

---

## 2️⃣ CONFIGURATION BASE DE DONNÉES

### Option A : PostgreSQL (Recommandé)

**Installer PostgreSQL** :
- Windows : https://www.postgresql.org/download/windows/
- Ou Docker : `docker run -p 5432:5432 -e POSTGRES_PASSWORD=secret postgres`

**Configurer `.env`** :
```env
# backend/.env

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=stells_hope
DB_USERNAME=postgres
DB_PASSWORD=votre_mot_de_passe
```

**Créer la base** :
```bash
# Dans psql ou pgAdmin
CREATE DATABASE stells_hope;
```

### Option B : MySQL (Alternative)

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=stells_hope
DB_USERNAME=root
DB_PASSWORD=
```

### Tester la Connexion
```bash
php artisan migrate:status
# Si connexion OK, vous verrez la liste des migrations
```

---

## 3️⃣ MIGRATIONS & SCHÉMA

### Créer les Migrations

```bash
# Users (déjà existant, modifier)
# Products
php artisan make:migration create_products_table

# Categories
php artisan make:migration create_categories_table

# Addresses
php artisan make:migration create_addresses_table

# Orders
php artisan make:migration create_orders_table

# Order Items
php artisan make:migration create_order_items_table

# Reviews
php artisan make:migration create_reviews_table

# Wishlist
php artisan make:migration create_wishlist_table

# Promotions
php artisan make:migration create_promotions_table
```

### Définir les Schémas

**`database/migrations/xxxx_create_products_table.php`** :
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description');
            $table->text('composition')->nullable();
            $table->text('care')->nullable();
            $table->decimal('price', 10, 2);
            $table->decimal('original_price', 10, 2)->nullable();
            $table->enum('category', ['homme', 'femme', 'unisexe']);
            $table->enum('type', ['hauts', 'bas', 'accessoires']);
            $table->json('sizes'); // ["S", "M", "L"]
            $table->json('colors'); // ["Noir", "Blanc"]
            $table->json('images'); // ["url1", "url2"]
            $table->integer('stock')->default(0);
            $table->decimal('rating', 3, 2)->default(0);
            $table->integer('review_count')->default(0);
            $table->boolean('is_new')->default(false);
            $table->boolean('is_on_sale')->default(false);
            $table->boolean('is_best_seller')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes(); // Pour ne pas supprimer définitivement
            
            // Index pour performance
            $table->index(['category', 'type']);
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
```

**`database/migrations/xxxx_create_addresses_table.php`** :
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['billing', 'shipping']);
            $table->string('first_name');
            $table->string('last_name');
            $table->string('address');
            $table->string('city');
            $table->string('postal_code');
            $table->string('country')->default('France');
            $table->string('phone')->nullable();
            $table->boolean('is_default')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};
```

**`database/migrations/xxxx_create_orders_table.php`** :
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->enum('status', [
                'pending', 
                'confirmed', 
                'processing',
                'shipped', 
                'delivered', 
                'cancelled'
            ])->default('pending');
            $table->decimal('subtotal', 10, 2);
            $table->decimal('shipping_cost', 10, 2)->default(0);
            $table->decimal('discount', 10, 2)->default(0);
            $table->decimal('total', 10, 2);
            $table->string('payment_method');
            $table->enum('payment_status', ['pending', 'paid', 'failed', 'refunded'])
                  ->default('pending');
            $table->foreignId('shipping_address_id')->nullable()->constrained('addresses');
            $table->foreignId('billing_address_id')->nullable()->constrained('addresses');
            $table->string('tracking_number')->nullable();
            $table->text('notes')->nullable();
            $table->string('promo_code')->nullable();
            $table->timestamps();
            
            // Index
            $table->index('user_id');
            $table->index('status');
            $table->index('order_number');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
```

**`database/migrations/xxxx_create_order_items_table.php`** :
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->nullable()->constrained()->onDelete('set null');
            $table->string('product_name'); // Snapshot
            $table->decimal('product_price', 10, 2); // Snapshot
            $table->string('size')->nullable();
            $table->string('color')->nullable();
            $table->integer('quantity');
            $table->decimal('subtotal', 10, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
```

**`database/migrations/xxxx_create_reviews_table.php`** :
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->integer('rating'); // 1-5
            $table->text('comment');
            $table->string('customer_name');
            $table->string('customer_size')->nullable();
            $table->string('customer_height')->nullable();
            $table->string('photo_url')->nullable();
            $table->boolean('is_verified')->default(false);
            $table->boolean('is_approved')->default(false);
            $table->timestamps();
            
            // Index
            $table->index('product_id');
            $table->index('is_approved');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
```

**`database/migrations/xxxx_create_wishlist_table.php`** :
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('wishlist', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            
            // Empêcher doublons
            $table->unique(['user_id', 'product_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wishlist');
    }
};
```

**`database/migrations/xxxx_create_promotions_table.php`** :
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('promotions', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->enum('type', ['percentage', 'fixed']);
            $table->decimal('value', 10, 2);
            $table->decimal('min_amount', 10, 2)->nullable();
            $table->integer('max_uses')->nullable();
            $table->integer('current_uses')->default(0);
            $table->timestamp('start_date');
            $table->timestamp('end_date');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('promotions');
    }
};
```

### Modifier la Migration Users

**`database/migrations/xxxx_create_users_table.php`** :
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('phone')->nullable();
            $table->enum('role', ['customer', 'admin'])->default('customer');
            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
```

### Exécuter les Migrations

```bash
php artisan migrate

# Si erreur, reset et relancer
php artisan migrate:fresh
```

---

## 4️⃣ MODÈLES ELOQUENT

### Créer les Modèles

```bash
php artisan make:model Product
php artisan make:model Address
php artisan make:model Order
php artisan make:model OrderItem
php artisan make:model Review
php artisan make:model Wishlist
php artisan make:model Promotion
```

### Définir les Relations

**`app/Models/User.php`** :
```php
<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'phone',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // Relations
    public function addresses()
    {
        return $this->hasMany(Address::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function wishlist()
    {
        return $this->belongsToMany(Product::class, 'wishlist')
                    ->withTimestamps();
    }

    // Helpers
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
}
```

**`app/Models/Product.php`** :
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'composition',
        'care',
        'price',
        'original_price',
        'category',
        'type',
        'sizes',
        'colors',
        'images',
        'stock',
        'rating',
        'review_count',
        'is_new',
        'is_on_sale',
        'is_best_seller',
        'is_active',
    ];

    protected $casts = [
        'sizes' => 'array',
        'colors' => 'array',
        'images' => 'array',
        'price' => 'decimal:2',
        'original_price' => 'decimal:2',
        'rating' => 'decimal:2',
        'is_new' => 'boolean',
        'is_on_sale' => 'boolean',
        'is_best_seller' => 'boolean',
        'is_active' => 'boolean',
    ];

    // Relations
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    // Scopes (filtres réutilisables)
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeInStock($query)
    {
        return $query->where('stock', '>', 0);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeBestSellers($query)
    {
        return $query->where('is_best_seller', true);
    }

    // Helpers
    public function inStock(): bool
    {
        return $this->stock > 0;
    }

    public function discount(): ?float
    {
        if ($this->original_price) {
            return (($this->original_price - $this->price) / $this->original_price) * 100;
        }
        return null;
    }
}
```

**`app/Models/Order.php`** :
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'order_number',
        'user_id',
        'status',
        'subtotal',
        'shipping_cost',
        'discount',
        'total',
        'payment_method',
        'payment_status',
        'shipping_address_id',
        'billing_address_id',
        'tracking_number',
        'notes',
        'promo_code',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'shipping_cost' => 'decimal:2',
        'discount' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    // Relations
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function shippingAddress()
    {
        return $this->belongsTo(Address::class, 'shipping_address_id');
    }

    public function billingAddress()
    {
        return $this->belongsTo(Address::class, 'billing_address_id');
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeRecent($query)
    {
        return $query->orderBy('created_at', 'desc');
    }

    // Generate unique order number
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($order) {
            $order->order_number = 'CMD' . strtoupper(uniqid());
        });
    }
}
```

**`app/Models/OrderItem.php`** :
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id',
        'product_id',
        'product_name',
        'product_price',
        'size',
        'color',
        'quantity',
        'subtotal',
    ];

    protected $casts = [
        'product_price' => 'decimal:2',
        'subtotal' => 'decimal:2',
    ];

    // Relations
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
```

**`app/Models/Address.php`** :
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'first_name',
        'last_name',
        'address',
        'city',
        'postal_code',
        'country',
        'phone',
        'is_default',
    ];

    protected $casts = [
        'is_default' => 'boolean',
    ];

    // Relations
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Full address string
    public function fullAddress(): string
    {
        return "{$this->address}, {$this->postal_code} {$this->city}, {$this->country}";
    }
}
```

**`app/Models/Review.php`** :
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = [
        'product_id',
        'user_id',
        'rating',
        'comment',
        'customer_name',
        'customer_size',
        'customer_height',
        'photo_url',
        'is_verified',
        'is_approved',
    ];

    protected $casts = [
        'is_verified' => 'boolean',
        'is_approved' => 'boolean',
    ];

    // Relations
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }
}
```

---

## 5️⃣ AUTHENTICATION API (SANCTUM)

### Publier Config Sanctum

```bash
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

### Configurer Sanctum

**`config/sanctum.php`** :
```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
    '%s%s',
    'localhost,localhost:3000,localhost:5173,127.0.0.1,127.0.0.1:8000,::1',
    env('APP_URL') ? ','.parse_url(env('APP_URL'), PHP_URL_HOST) : ''
))),
```

### Créer Auth Controller

```bash
php artisan make:controller Api/AuthController
```

**`app/Http/Controllers/Api/AuthController.php`** :
```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'nullable|string|max:20',
        ]);

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants sont incorrects.'],
            ]);
        }

        // Supprimer anciens tokens
        $user->tokens()->delete();

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Déconnexion réussie'
        ]);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
```

---

## 6️⃣ CONTROLLERS & ROUTES

### Créer Controllers

```bash
php artisan make:controller Api/ProductController --resource
php artisan make:controller Api/OrderController --resource
php artisan make:controller Api/AddressController --resource
php artisan make:controller Api/ReviewController --resource
php artisan make:controller Api/WishlistController
```

### Product Controller (Exemple)

**`app/Http/Controllers/Api/ProductController.php`** :
```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query()->active();

        // Filtres
        if ($request->has('category')) {
            $query->byCategory($request->category);
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Tri
        $sort = $request->get('sort', 'newest');
        match($sort) {
            'price-low' => $query->orderBy('price', 'asc'),
            'price-high' => $query->orderBy('price', 'desc'),
            'rating' => $query->orderBy('rating', 'desc'),
            default => $query->orderBy('created_at', 'desc'),
        };

        $products = $query->paginate(12);

        return response()->json($products);
    }

    public function show($id)
    {
        $product = Product::with('reviews.user')
            ->findOrFail($id);

        return response()->json($product);
    }

    public function bestSellers()
    {
        $products = Product::active()
            ->bestSellers()
            ->limit(8)
            ->get();

        return response()->json($products);
    }
}
```

### Routes API

**`routes/api.php`** :
```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\AddressController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\WishlistController;

// Auth routes (publiques)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Products (publiques)
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/products/best-sellers', [ProductController::class, 'bestSellers']);

// Reviews (publiques en lecture)
Route::get('/products/{product}/reviews', [ReviewController::class, 'index']);

// Routes protégées (auth required)
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Orders
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    
    // Addresses
    Route::apiResource('addresses', AddressController::class);
    
    // Reviews
    Route::post('/products/{product}/reviews', [ReviewController::class, 'store']);
    
    // Wishlist
    Route::get('/wishlist', [WishlistController::class, 'index']);
    Route::post('/wishlist/{product}', [WishlistController::class, 'add']);
    Route::delete('/wishlist/{product}', [WishlistController::class, 'remove']);
});
```

---

**Suite dans le prochain message (trop long)... Voulez-vous que je continue avec :**
- Admin Panel Filament
- CORS Configuration
- Seeders (données de test)
- Intégration Frontend React

**Dites-moi ce qui vous intéresse le plus ! 🚀**
