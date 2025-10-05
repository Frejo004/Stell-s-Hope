<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class LogService
{
    public function logUserAction(string $action, array $data = [], string $level = 'info')
    {
        $user = Auth::user();
        $logData = [
            'action' => $action,
            'user_id' => $user?->id,
            'user_email' => $user?->email,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'data' => $data,
            'timestamp' => now()->toISOString()
        ];

        Log::channel('daily')->{$level}('User Action', $logData);
    }

    public function logProductAction(string $action, int $productId, array $data = [])
    {
        $this->logUserAction("product.{$action}", array_merge([
            'product_id' => $productId
        ], $data));
    }

    public function logOrderAction(string $action, int $orderId, array $data = [])
    {
        $this->logUserAction("order.{$action}", array_merge([
            'order_id' => $orderId
        ], $data));
    }

    public function logAdminAction(string $action, array $data = [])
    {
        $this->logUserAction("admin.{$action}", $data);
    }

    public function logSecurityEvent(string $event, array $data = [])
    {
        $logData = [
            'event' => $event,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'data' => $data,
            'timestamp' => now()->toISOString()
        ];

        Log::channel('daily')->warning('Security Event', $logData);
    }

    public function logError(string $message, \Exception $exception = null, array $context = [])
    {
        $logData = [
            'message' => $message,
            'exception' => $exception ? [
                'message' => $exception->getMessage(),
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
                'trace' => $exception->getTraceAsString()
            ] : null,
            'context' => $context,
            'timestamp' => now()->toISOString()
        ];

        Log::channel('daily')->error('Application Error', $logData);
    }

    public function logPerformance(string $operation, float $duration, array $metrics = [])
    {
        $logData = [
            'operation' => $operation,
            'duration_ms' => $duration * 1000,
            'metrics' => $metrics,
            'timestamp' => now()->toISOString()
        ];

        Log::channel('daily')->info('Performance Metric', $logData);
    }

    public function getLogStats(int $days = 7)
    {
        $logPath = storage_path('logs');
        $stats = [
            'total_logs' => 0,
            'error_count' => 0,
            'warning_count' => 0,
            'info_count' => 0,
            'files' => []
        ];

        for ($i = 0; $i < $days; $i++) {
            $date = now()->subDays($i)->format('Y-m-d');
            $logFile = "{$logPath}/laravel-{$date}.log";
            
            if (file_exists($logFile)) {
                $content = file_get_contents($logFile);
                $stats['total_logs'] += substr_count($content, 'ERROR');
                $stats['error_count'] += substr_count($content, 'ERROR');
                $stats['warning_count'] += substr_count($content, 'WARNING');
                $stats['info_count'] += substr_count($content, 'INFO');
                $stats['files'][] = [
                    'date' => $date,
                    'size' => filesize($logFile),
                    'errors' => substr_count($content, 'ERROR'),
                    'warnings' => substr_count($content, 'WARNING')
                ];
            }
        }

        return $stats;
    }
}
