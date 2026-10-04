<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('orders', 'total_amount') && !Schema::hasColumn('orders', 'total')) {
            DB::statement('ALTER TABLE orders RENAME COLUMN total_amount TO total');
        }

        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'subtotal')) {
                $table->decimal('subtotal', 10, 2)->default(0)->after('total');
            }

            if (!Schema::hasColumn('orders', 'shipping_amount')) {
                $table->decimal('shipping_amount', 10, 2)->default(0)->after('subtotal');
            }

            if (!Schema::hasColumn('orders', 'discount_amount')) {
                $table->decimal('discount_amount', 10, 2)->default(0)->after('shipping_amount');
            }

            if (!Schema::hasColumn('orders', 'promotion_code')) {
                $table->string('promotion_code')->nullable()->after('discount_amount');
            }

            if (!Schema::hasColumn('orders', 'currency')) {
                $table->string('currency', 3)->default('XOF')->after('promotion_code');
            }
        });

        Schema::table('order_items', function (Blueprint $table) {
            if (!Schema::hasColumn('order_items', 'unit_price')) {
                $table->decimal('unit_price', 10, 2)->default(0)->after('quantity');
            }

            if (!Schema::hasColumn('order_items', 'discount_amount')) {
                $table->decimal('discount_amount', 10, 2)->default(0)->after('unit_price');
            }

            if (!Schema::hasColumn('order_items', 'line_total')) {
                $table->decimal('line_total', 10, 2)->default(0)->after('discount_amount');
            }
        });

        DB::table('order_items')->where('unit_price', 0)->update([
            'unit_price' => DB::raw('price'),
            'line_total' => DB::raw('price * quantity'),
        ]);

        DB::table('orders')->where('subtotal', 0)->update([
            'subtotal' => DB::raw('total'),
        ]);
    }

    public function down(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            foreach (['unit_price', 'discount_amount', 'line_total'] as $column) {
                if (Schema::hasColumn('order_items', $column)) {
                    $table->dropColumn($column);
                }
            }
        });

        Schema::table('orders', function (Blueprint $table) {
            foreach (['subtotal', 'shipping_amount', 'discount_amount', 'promotion_code', 'currency'] as $column) {
                if (Schema::hasColumn('orders', $column)) {
                    $table->dropColumn($column);
                }
            }
        });

        if (Schema::hasColumn('orders', 'total') && !Schema::hasColumn('orders', 'total_amount')) {
            DB::statement('ALTER TABLE orders RENAME COLUMN total TO total_amount');
        }
    }
};
