<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('product_variant_attributes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_variant_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_attribute_id')->constrained()->onDelete('cascade');
            $table->string('value');
            $table->timestamps();
            
            $table->unique(['product_variant_id', 'product_attribute_id'], 'variant_attribute_unique');
        });
    }

    public function down()
    {
        Schema::dropIfExists('product_variant_attributes');
    }
};
