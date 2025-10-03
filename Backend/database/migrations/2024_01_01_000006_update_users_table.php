<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Users table already has the correct structure, no changes needed
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('name')->after('id');
            $table->dropColumn([
                'first_name', 'last_name', 'phone', 'address', 
                'city', 'postal_code', 'country', 'is_admin', 'is_active'
            ]);
        });
    }
};