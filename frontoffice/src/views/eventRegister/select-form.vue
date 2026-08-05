<template>
  <div class="max-w-md mx-auto bg-white rounded-3xl p-6 shadow-sm">
    <div class="flex flex-col space-y-3">
      <!-- Step 1 -->
      <div 
        class="flex items-center p-4 rounded-xl cursor-pointer bg-gray-50 border-red-600"
        :class="[
          this.completedSteps.includes(1) ? 'border-2 ' : ' ',
        ]"
        @click="$emit('changeStep', 1)"
      >
        <div 
          class="w-6 h-6 rounded-full flex items-center justify-center mr-3 "
          :class="[
            this.completedSteps.includes(1) 
              ? 'bg-red-500' 
              : 'bg-white border-2 border-gray-200'
          ]"
        >
          <CheckIcon
            v-if="this.completedSteps.includes(1)"
            class="w-3 h-3 text-white"
          />
        </div>
        <span 
          class="text-sm text-gray-700"
        >
          Step 1
        </span>
        <span 
          class="ml-2 text-sm text-gray-500"
        >
          Informations personnelles
        </span>
      </div>

      <!-- Step 2 -->
      <div 
        class="flex items-center p-4 rounded-xl bg-gray-50 border-red-600"
        :class="[
          completedSteps.includes(2) ? 'border-2' : '',
          completedSteps.includes(1) ? 'cursor-pointer' : 'cursor-not-allowed'

        ]"
        @click="this.completedSteps.includes(1) ? $emit('changeStep', 2) : null"
        >
        <div 
          class="w-6 h-6 rounded-full flex items-center justify-center mr-3"
          :class="[
            completedSteps.includes(2) 
              ? 'bg-red-500' 
              : 'bg-white border-2 border-gray-200'
          ]"
        >
          <CheckIcon
            v-if="completedSteps.includes(2)"
            class="w-3 h-3 text-white"
          />
        </div>
        <span 
          class="text-sm text-gray-700"
        >
          Step 2
        </span>
        <span 
          class="ml-2 text-sm text-gray-500"
        >
          Informations sur l'organisation
        </span>
      </div>

      <!-- Step 3 -->
      <div 
        class="flex items-center p-4 rounded-xl bg-gray-50 border-red-600"
        :class="[
          completedSteps.includes(3) ? 'border-2' : '',
          completedSteps.includes(2) ? 'cursor-pointer' : 'cursor-not-allowed'
        ]"
        @click="this.completedSteps.includes(2) ? $emit('changeStep', 3) : null"
        >
        <div 
          class="w-6 h-6 rounded-full flex items-center justify-center mr-3"
          :class="[
            completedSteps.includes(3) 
              ? 'bg-red-500' 
              : 'bg-white border-2 border-gray-200'
          ]"
        >
          <CheckIcon
            v-if="completedSteps.includes(3)"
            class="w-3 h-3 text-white"
          />
        </div>
        <span 
          class="text-sm text-gray-700"
        >
          Step 3
        </span>
        <span 
          class="ml-2 text-sm text-gray-500"
        >
          Adresse
        </span>
      </div>

      <!-- Step 4 -->
      <div 
        class="flex items-center p-4 rounded-xl bg-gray-50 border-red-600"
        :class="[
          completedSteps.includes(4) ? 'bg-red-50' : 'bg-gray-50',
          completedSteps.includes(3) ? 'cursor-pointer' : 'cursor-not-allowed'
        ]"
        @click="this.completedSteps.includes(3) ? $emit('changeStep', 4) : null"
        >
        <div 
          class="w-6 h-6 rounded-full flex items-center justify-center mr-3"
          :class="[
            completedSteps.includes(4) 
              ? 'bg-red-500' 
              : 'bg-white border-2 border-gray-200'
          ]"
        >
          <CheckIcon
            v-if="completedSteps.includes(4)"
            class="w-3 h-3 text-white"
          />
        </div>
        <span 
          class="text-sm text-gray-700"
        >
          Step 4
        </span>
        <span 
          class="ml-2 text-sm text-gray-500"
        >
          Questions personnaliser
        </span>
      </div>
    </div>

    <!-- Demo Controls (you can remove this in production) -->
    
  </div>
</template>

<script>
import { CheckIcon } from 'lucide-vue-next'

export default {
  components: {
    CheckIcon
  },
  emits : ['changeStep'],
  props : {
    completedSteps : {
      type : Array,
      required : true,
      default : () => []
    }
  },
  data () {
    return {
      
    }
  },

}


</script>