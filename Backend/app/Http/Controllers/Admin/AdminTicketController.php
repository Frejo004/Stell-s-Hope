<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\Request;

class AdminTicketController extends Controller
{
    public function index(Request $request)
    {
        $query = Ticket::with('user');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }

        $tickets = $query->orderBy('created_at', 'desc')->paginate(15);
        return response()->json($tickets);
    }

    public function show(Ticket $ticket)
    {
        return response()->json($ticket->load('user'));
    }

    public function update(Request $request, Ticket $ticket)
    {
        $request->validate([
            'status' => 'required|in:open,in_progress,resolved,closed',
            'admin_response' => 'nullable|string'
        ]);

        $ticket->update($request->all());
        return response()->json($ticket);
    }

    public function updateStatus(Request $request, Ticket $ticket)
    {
        $request->validate([
            'status' => 'required|in:open,pending,resolved'
        ]);

        $ticket->update(['status' => $request->status]);
        return response()->json(['message' => 'Statut mis à jour']);
    }

    public function stats()
    {
        $tickets = Ticket::with('user')->get()->map(function($ticket) {
            return [
                'id' => $ticket->id,
                'customer' => ($ticket->user->first_name ?? 'Client') . ' ' . ($ticket->user->last_name ?? ''),
                'email' => $ticket->user->email ?? 'Non renseigné',
                'subject' => $ticket->subject,
                'status' => $ticket->status,
                'priority' => $ticket->priority ?? 'medium',
                'created' => $ticket->created_at->toISOString(),
                'updated' => $ticket->updated_at->toISOString()
            ];
        });

        $stats = [
            'total' => $tickets->count(),
            'open' => $tickets->where('status', 'open')->count(),
            'pending' => $tickets->where('status', 'pending')->count(),
            'resolved' => $tickets->where('status', 'resolved')->count()
        ];

        return response()->json([
            'tickets' => $tickets,
            'stats' => $stats
        ]);
    }
}