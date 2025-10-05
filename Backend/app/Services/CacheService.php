<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redis;

class CacheService
{
    const CACHE_TTL = 3600; // 1 heure
    const PRODUCT_CACHE_TTL = 1800; // 30 minutes
    const USER_CACHE_TTL = 7200; // 2 heures

    public function remember(string $key, callable $callback, int $ttl = self::CACHE_TTL)
    {
        return Cache::remember($key, $ttl, $callback);
    }

    public function forget(string $key)
    {
        return Cache::forget($key);
    }

    public function flush()
    {
        return Cache::flush();
    }

    // Cache spécifique aux produits
    public function getProducts(string $key, callable $callback)
    {
        return $this->remember("products.{$key}", $callback, self::PRODUCT_CACHE_TTL);
    }

    public function forgetProductCache(int $productId = null)
    {
        if ($productId) {
            Cache::forget("product.{$productId}");
        }
        
        // Supprimer tous les caches de produits
        $keys = Cache::getRedis()->keys('products.*');
        foreach ($keys as $key) {
            Cache::forget(str_replace(config('cache.prefix') . ':', '', $key));
        }
    }

    // Cache spécifique aux utilisateurs
    public function getUser(string $key, callable $callback)
    {
        return $this->remember("user.{$key}", $callback, self::USER_CACHE_TTL);
    }

    public function forgetUserCache(int $userId = null)
    {
        if ($userId) {
            Cache::forget("user.{$userId}");
        }
        
        // Supprimer tous les caches d'utilisateurs
        $keys = Cache::getRedis()->keys('user.*');
        foreach ($keys as $key) {
            Cache::forget(str_replace(config('cache.prefix') . ':', '', $key));
        }
    }

    // Cache pour les statistiques
    public function getStats(string $key, callable $callback, int $ttl = 300) // 5 minutes
    {
        return $this->remember("stats.{$key}", $callback, $ttl);
    }

    // Cache pour les catégories
    public function getCategories(callable $callback)
    {
        return $this->remember('categories.all', $callback, self::CACHE_TTL);
    }

    public function forgetCategoryCache()
    {
        Cache::forget('categories.all');
    }

    // Méthodes utilitaires
    public function getCacheInfo()
    {
        return [
            'driver' => config('cache.default'),
            'prefix' => config('cache.prefix'),
            'ttl' => self::CACHE_TTL,
        ];
    }

    public function getCacheStats()
    {
        if (config('cache.default') === 'redis') {
            $redis = Redis::connection();
            return [
                'used_memory' => $redis->info()['used_memory_human'] ?? 'N/A',
                'connected_clients' => $redis->info()['connected_clients'] ?? 'N/A',
                'total_commands_processed' => $redis->info()['total_commands_processed'] ?? 'N/A',
            ];
        }

        return ['driver' => config('cache.default')];
    }
}
