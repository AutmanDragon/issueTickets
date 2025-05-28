<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-200">
      <div class="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 class="text-center text-xl font-semibold">ระบบแจ้งปัญหา</h1>
        <p class="text-center text-gray-500 text-sm mb-6">Issue Ticket System</p>
  
        <div class="mb-4">
          <label class="block mb-1">อีเมล</label>
          <input type="email" placeholder="อีเมลของคุณ"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black" />
        </div>
  
        <div class="mb-6">
          <label class="block mb-1">รหัสผ่าน</label>
          <input type="password" placeholder="รหัสผ่านของคุณ"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black" />
        </div>
  
        <button class="w-full bg-black text-white py-2 rounded-md flex items-center justify-center gap-2">
          <span class="material-icons">person</span>
          ลงทะเบียน
        </button>
  
        <p class="mt-4 text-center text-sm">
          มีบัญชีแล้วใช่ไหม?
          <a href="#" class="text-blue-600 hover:underline">เข้าสู่ระบบ</a>
        </p>
      </div>
    </div>
  </template>
  
  <script setup>
  // ไม่มี logic เพราะยังไม่เชื่อม backend
  </script>
  


  
  <style>
  @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
  </style>
  