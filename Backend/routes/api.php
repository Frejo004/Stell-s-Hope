<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminProductController;
use App\Http\Controllers\Admin\AdminOrderController;
use App\Http\Controllers\Admin\AdminCustomerController;
use App\Http\Controllers\Admin\AdminPromotionController;
use App\Http\Controllers\Admin\AdminTicketController;
use App\Http\Controllers\Admin\AdminSidebarController;
use App\Http\Controllers\Admin\AdminInventoryController;
use App\Http\Controllers\Admin\AdminReviewController;
use App\Http\Controllers\Admin\AdminAnalyticsController;
use App\Http\Controllers\Admin\AdminAttributeController;
use App\Http\Controllers\Api\WishlistController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\Api\FileController;
use App\Http\Controllers\PromotionController;
use App\Http\Controllers\PaymentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Public routes
Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:5,1');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Email Verification
Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verify'])->name('verification.verify');
Route::post('/email/resend', [AuthController::class, 'resendVerificationEmail'])->middleware(['auth:sanctum', 'throttle:6,1'])->name('verification.resend');

// Products routes (public) — routes statiques AVANT la route dynamique {product}
Route::get('/products/featured', [ProductController::class, 'featured']);
Route::get('/products/bestsellers', [ProductController::class, 'bestsellers']);
Route::get('/products/search', [ProductController::class, 'search']);
Route::get('/products/search/suggestions', [ProductController::class, 'searchSuggestions']);
Route::get('/products/debug', [ProductController::class, 'debug']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);

// Categories routes (public)
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);

// File routes (public)
Route::get('/images/{path}', [FileController::class, 'getImage'])->where('path', '.*');

// Promotion validation (public)
Route::post('/promotions/validate', [PromotionController::class, 'validate']);
Route::post('/promotions/apply', [PromotionController::class, 'apply']);

// Suivi de commande public (sans authentification)
Route::get('/orders/track-public', [OrderController::class, 'trackPublic']);

// Payment routes (public)
Route::post('/payment/webhook', [PaymentController::class, 'webhook']);
Route::get('/payment/callback', [PaymentController::class, 'callback'])->name('payment.callback');

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::put('/password', [AuthController::class, 'updatePassword']);

    // Cart
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart/add', [CartController::class, 'add']);
    Route::put('/cart/update', [CartController::class, 'update']);
    Route::delete('/cart/remove', [CartController::class, 'remove']);
    Route::delete('/cart/clear', [CartController::class, 'clear']);

    // Orders
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);
    Route::get('/orders/{order}/track', [OrderController::class, 'track']);
    Route::post('/orders/{order}/cancel', [OrderController::class, 'cancel']);

    // Wishlist
    Route::get('/wishlist', [WishlistController::class, 'index']);
    Route::post('/wishlist', [WishlistController::class, 'store']);
    Route::delete('/wishlist/{productId}', [WishlistController::class, 'destroy']);
    Route::post('/wishlist/toggle', [WishlistController::class, 'toggle']);

    // Reviews
    Route::get('/reviews', [ReviewController::class, 'index']);
    Route::post('/reviews', [ReviewController::class, 'store']);

    // Support Tickets
    Route::get('/tickets', [TicketController::class, 'index']);
    Route::post('/tickets', [TicketController::class, 'store']);
    Route::get('/tickets/{ticket}', [TicketController::class, 'show']);

    // File Management
    Route::post('/files/upload', [FileController::class, 'upload']);
    Route::delete('/files/delete', [FileController::class, 'delete']);

    // Payment
    Route::post('/payment/initiate', [PaymentController::class, 'initiate']);

    // Admin routes
    Route::middleware('admin')->prefix('admin')->group(function () {
        // Dashboard
        Route::get('/dashboard', [AdminDashboardController::class, 'index']);

        // Products management
        Route::get('/products', [AdminProductController::class, 'index']);
        Route::post('/products', [AdminProductController::class, 'store']);
        Route::get('/products/{product}', [AdminProductController::class, 'show']);
        Route::put('/products/{product}', [AdminProductController::class, 'update']);
        Route::delete('/products/{product}', [AdminProductController::class, 'destroy']);
        Route::put('/products/{product}/status', [AdminProductController::class, 'updateStatus']);
        Route::post('/products/bulk-update', [AdminProductController::class, 'bulkUpdate']);

        // Product Attributes management
        Route::get('/attributes', [AdminAttributeController::class, 'index']);
        Route::post('/attributes', [AdminAttributeController::class, 'store']);
        Route::get('/attributes/{attribute}', [AdminAttributeController::class, 'show']);
        Route::put('/attributes/{attribute}', [AdminAttributeController::class, 'update']);
        Route::delete('/attributes/{attribute}', [AdminAttributeController::class, 'destroy']);

        // Orders management — routes statiques AVANT {order}
        Route::get('/orders', [AdminOrderController::class, 'index']);
        Route::get('/orders/stats', [AdminOrderController::class, 'stats']);
        Route::get('/orders/export', [AdminOrderController::class, 'export']);
        Route::post('/orders/bulk-update', [AdminOrderController::class, 'bulkUpdate']);
        Route::get('/orders/{order}', [AdminOrderController::class, 'show']);
        Route::put('/orders/{order}/status', [AdminOrderController::class, 'updateStatus']);

        // Customers management
        Route::get('/customers', [AdminCustomerController::class, 'index']);
        Route::get('/customers/stats', [AdminCustomerController::class, 'stats']);
        Route::get('/customers/{customer}', [AdminCustomerController::class, 'show']);
        Route::get('/customers/{customer}/orders', [AdminCustomerController::class, 'orders']);
        Route::put('/customers/{customer}/status', [AdminCustomerController::class, 'updateStatus']);
        Route::get('/customers/export', [AdminCustomerController::class, 'export']);



        // Categories management
        Route::get('/categories', [CategoryController::class, 'adminIndex']);
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{category}', [CategoryController::class, 'update']);
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);









        // Shipping methods
        Route::get('/shipping', [AdminDashboardController::class, 'shippingMethods']);
        Route::post('/shipping', [AdminDashboardController::class, 'createShippingMethod']);
        Route::put('/shipping/{method}', [AdminDashboardController::class, 'updateShippingMethod']);

        // Payment methods
        Route::get('/payments', [AdminDashboardController::class, 'paymentMethods']);
        Route::put('/payments/{method}', [AdminDashboardController::class, 'updatePaymentMethod']);

        // Promotions
        Route::get('/promotions', [AdminPromotionController::class, 'index']);
        Route::post('/promotions', [AdminPromotionController::class, 'store']);
        Route::put('/promotions/{promotion}', [AdminPromotionController::class, 'update']);
        Route::delete('/promotions/{promotion}', [AdminPromotionController::class, 'destroy']);

        // Support Tickets — routes statiques AVANT {ticket}
        Route::get('/tickets/list', [AdminTicketController::class, 'index']);
        Route::get('/tickets/stats', [AdminTicketController::class, 'stats']);
        Route::get('/tickets', [AdminTicketController::class, 'stats']);
        Route::get('/tickets/{ticket}', [AdminTicketController::class, 'show']);
        Route::put('/tickets/{ticket}', [AdminTicketController::class, 'update']);

        // Settings
        Route::get('/settings', [AdminDashboardController::class, 'settings']);
        Route::put('/settings', [AdminDashboardController::class, 'updateSettings']);

        // Sidebar Stats
        Route::get('/sidebar-stats', [AdminSidebarController::class, 'getSidebarStats']);

        // Inventory
        Route::get('/inventory', [AdminInventoryController::class, 'index']);
        Route::put('/inventory/{product}', [AdminInventoryController::class, 'updateStock']);

        // Reviews Management
        Route::get('/reviews', [AdminReviewController::class, 'index']);
        Route::put('/reviews/{review}/status', [AdminReviewController::class, 'updateStatus']);

        // Analytics
        Route::get('/analytics', [AdminAnalyticsController::class, 'index']);
        // Correction #13 : routes analytics manquantes ajoutées
        Route::get('/analytics/revenue', [AdminDashboardController::class, 'revenueAnalytics']);
        Route::get('/analytics/products', [AdminDashboardController::class, 'productAnalytics']);
        Route::get('/analytics/customers', [AdminDashboardController::class, 'customerAnalytics']);

        // Tickets Status Update
        Route::put('/tickets/{ticket}/status', [AdminTicketController::class, 'updateStatus']);
    });
});