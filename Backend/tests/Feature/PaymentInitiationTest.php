<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\User;
use App\Services\MonerooGateway;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Moneroo\Laravel\Exceptions\InvalidPayloadException;
use Tests\TestCase;

class PaymentInitiationTest extends TestCase
{
    use RefreshDatabase;

    private ?\Mockery\MockInterface $gatewayMock = null;

    public function test_initiates_moneroo_payment_with_expected_payload(): void
    {
        $order = $this->createOrder();
        Sanctum::actingAs($order->user);

        $this->gateway()->shouldReceive('init')->once()->withArgs(function (array $data) use ($order) {
            return $data['amount'] === 25000
                && $data['currency'] === 'XOF'
                && $data['description'] === "Commande {$order->order_number}"
                && $data['customer']['email'] === $order->user->email
                && $data['metadata'] === ['order_id' => (string) $order->id, 'user_id' => (string) $order->user_id]
                && str_contains($data['return_url'], "order_id={$order->id}");
        })->andReturn((object) ['id' => 'pay_new', 'checkout_url' => 'https://checkout.moneroo.io/pay_new']);

        $this->postJson('/api/payment/initiate', ['order_id' => $order->id])
            ->assertOk()
            ->assertJsonPath('data.checkout_url', 'https://checkout.moneroo.io/pay_new')
            ->assertJsonPath('data.payment_id', 'pay_new');

        $order->refresh();
        $this->assertSame('pay_new', $order->payment_id);
        $this->assertSame('pending', $order->payment_status);
    }

    public function test_gateway_error_does_not_leak_details(): void
    {
        $order = $this->createOrder();
        Sanctum::actingAs($order->user);
        $this->gateway()->shouldReceive('init')->once()->andThrow(new InvalidPayloadException('secret internal detail'));

        $this->postJson('/api/payment/initiate', ['order_id' => $order->id])
            ->assertStatus(502)
            ->assertJsonMissing(['message' => 'secret internal detail']);
    }

    public function test_cannot_pay_order_of_another_user(): void
    {
        $order = $this->createOrder();
        Sanctum::actingAs(User::factory()->create());
        $this->gateway()->shouldReceive('init')->never();

        $this->postJson('/api/payment/initiate', ['order_id' => $order->id])->assertStatus(403);
    }

    public function test_cannot_pay_cancelled_order(): void
    {
        $order = $this->createOrder(['status' => 'cancelled']);
        Sanctum::actingAs($order->user);
        $this->gateway()->shouldReceive('init')->never();

        $this->postJson('/api/payment/initiate', ['order_id' => $order->id])->assertStatus(422);
    }

    private function gateway(): \Mockery\MockInterface
    {
        return $this->gatewayMock ??= $this->mock(MonerooGateway::class);
    }

    private function createOrder(array $overrides = []): Order
    {
        $user = User::factory()->create();

        return Order::create(array_merge([
            'user_id' => $user->id,
            'total' => 25000,
            'currency' => 'XOF',
            'status' => 'pending',
            'shipping_address' => ['city' => 'Cotonou'],
            'billing_address' => ['city' => 'Cotonou'],
            'payment_method' => 'moneroo',
        ], $overrides));
    }
}
