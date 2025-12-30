<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // This migration was intended to rename total_amount to total,
        // but we decided to keep total_amount for consistency.
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
