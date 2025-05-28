<template>
    <div class="flex">
        <Sidebar />
        <div class="flex-1 flex flex-col">
            <Topbar />
        </div>
    </div>
    
    <div class ="p-4">
        <ProfilesDetail/>
    </div>
    

</template>

<script setup>

import Topbar from '@/components/Topbar.vue';
import ProfilesDetail from '@/components/ProfilesDetail.vue';
</script>