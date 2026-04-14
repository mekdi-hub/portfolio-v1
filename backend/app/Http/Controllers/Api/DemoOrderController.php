<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DemoOrder;
use Illuminate\Http\Request;

class DemoOrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $orders = DemoOrder::latest()->get();
        return response()->json($orders);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'status' => 'required|string|max:255',
            'assigned_rider' => 'nullable|string|max:255'
        ]);

        $order = DemoOrder::create($validated);
        return response()->json([
            'message' => 'Demo order created successfully',
            'data' => $order
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $order = DemoOrder::findOrFail($id);
        return response()->json($order);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $order = DemoOrder::findOrFail($id);
        
        $validated = $request->validate([
            'status' => 'sometimes|string|max:255',
            'assigned_rider' => 'nullable|string|max:255'
        ]);

        $order->update($validated);
        return response()->json($order);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $order = DemoOrder::findOrFail($id);
        $order->delete();
        return response()->json(['message' => 'Demo order deleted successfully']);
    }
}
