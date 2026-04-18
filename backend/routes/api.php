<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\DemoOrderController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Public routes for portfolio
Route::post('projects/upload-image', [ProjectController::class, 'uploadImage']);
Route::apiResource('projects', ProjectController::class);
Route::apiResource('messages', MessageController::class);
Route::apiResource('demo-orders', DemoOrderController::class);
