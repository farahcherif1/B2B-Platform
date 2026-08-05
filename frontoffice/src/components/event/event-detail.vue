
<script>
import { ref } from 'vue'
import { CalendarDays, MapPin, Globe2 } from 'lucide-vue-next'
import EventService from '@/services/event.service.js'
import Horizontal from "@/layouts/horizontal.vue";
import { MonthEnum } from "@/enum/enums.js";


export default {
  components: { CalendarDays, MapPin, Globe2,Horizontal },
  props : ['id'],
  data () {
    return {
      event : {},
      statistics : ref([
        { value: 926, label: 'Participants' },
        { value: 91, label: 'Meetings' },
        { value: 21, label: 'Sessions' }
      ]),
      months : Object.values(MonthEnum)
    }
  },
  async created() {
    await this.fetchEvent()
  },
  methods : {
    handleRegister() {
      this.$router.push(`/event-register/${this.id}`)
    },
    replaceDate(date) {
      try{
        date = date.slice(0, 10);
        date = date.split("-");
      }
      catch(e){
        return "Invalid Date"
      }
      return `${date[2]} ${this.months[parseInt(date[1]) - 1]} ${date[0]}`;
    },
    async fetchEvent() {
      const response = await EventService.getEventDetails(this.id)
      this.event = await response.data
    },
    checkLanguage(languages){
      if(languages && languages.length > 0){
        return languages[0].name
      }
      return ""
  }
}
}

</script>
<template>
  <Horizontal/>
  <div class="max-w-7xl mx-auto p-4 space-y-8 mt-6" style = "background-color: white;">
    <div class="grid md:grid-cols-12 gap-8" style = "height: 29rem;">
    <!-- Hero Section -->
    <div class="relative rounded-lg overflow-hidden col-span-12 md:col-span-7">
      <img
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20from%202025-01-20%2019-38-35-INvnBeZYCULWcWOHXmfqHZwu9jkGQa.png"
        alt="Horizon Europe Brokerage Event"
        class="w-full h-full object-cover"
      />
      <div class="absolute top-4 left-4">
        <span class="bg-gray-900/75 text-white px-3 py-1 rounded-full text-sm">
          {{event.type}}
        </span>
      </div>
    </div>

    <!-- Event Title & Details -->
    <div class="space-y-6 col-span-12 md:col-span-5 flex flex-col h-full" >
      <div class="flex-1"> 
      <h1 class="text-3xl font-bold p-3 mr-6 my-6">
          {{event.name}}
      </h1>
      
      <div class="flex flex-col gap-3 p-3 py-0 mt-4">
        <div class="flex items-center gap-2 text-gray-600">
          <CalendarDays class="h-5 w-5" />
          <span>{{replaceDate(event.startDate)}} - {{replaceDate(event.endDate)}}</span>
        </div>
        <div class="flex items-center gap-2 text-gray-600">
          <MapPin class="h-5 w-5" />
          <span>Vienna, Austria</span>
        </div>
        <div class="flex items-center gap-2 text-gray-600">
          <Globe2 class="h-5 w-5" />
          <span>{{checkLanguage(event.languages)}}</span>
        </div>
        <div class="flex items-center gap-2 text-gray-600">
          <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_19_67)">
            <path d="M10.0557 6.66663H10.065H10.0557Z" fill="black"/>
            <path d="M10.0557 6.66663H10.065" stroke="#082530" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10.0557 10H10.065H10.0557Z" fill="black"/>
            <path d="M10.0557 10H10.065" stroke="#082530" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10.0557 13.3334H10.065H10.0557Z" fill="black"/>
            <path d="M10.0557 13.3334H10.065" stroke="#082530" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M1.72217 13.3334V16.6668H18.3888V13.3334M1.72217 6.6667V3.33337H18.3888V6.6667" fill="black"/>
            <path d="M1.72217 13.3334V16.6668H18.3888V13.3334M1.72217 6.6667V3.33337H18.3888V6.6667" stroke="#082530" stroke-width="1.33333"/>
            <path d="M0.88916 13.3332C2.73012 13.3332 4.22249 11.8409 4.22249 9.99996C4.22249 8.15901 2.73012 6.66663 0.88916 6.66663" fill="black"/>
            <path d="M0.88916 13.3332C2.73012 13.3332 4.22249 11.8409 4.22249 9.99996C4.22249 8.15901 2.73012 6.66663 0.88916 6.66663" stroke="#082530" stroke-width="1.33333"/>
            <path d="M19.2225 6.66675C17.3815 6.66675 15.8892 8.15914 15.8892 10.0001C15.8892 11.841 17.3815 13.3334 19.2225 13.3334" fill="black"/>
            <path d="M19.2225 6.66675C17.3815 6.66675 15.8892 8.15914 15.8892 10.0001C15.8892 11.841 17.3815 13.3334 19.2225 13.3334" stroke="#082530" stroke-width="1.33333"/>
            </g>
            <defs>
            <clipPath id="clip0_19_67">
            <rect width="20" height="20" fill="white" transform="translate(0.0556641)"/>
            </clipPath>
            </defs>
            </svg>

          <span v-if = "!event.paid">Gratuit</span>
          <span v-if = "event.paid">Payant - {{event.price}} TND</span>

        </div>
      </div>
    </div> 
    <div class="mt-auto pt-4">

      <div class="flex flex-col gap-3 items-center">
        <a 
          :href="`/${event.path}`" 
          target="_blank" 
          rel="noopener noreferrer"
          class="px-8 py-2 text-sm border-1 border-red-600 rounded-md hover:bg-gray-50 transition-colors w-64 text-center text-red-600"
        >
          Visit Event Website
        </a>
        <button 
          class="px-8 py-2 text-sm  text-white rounded-md hover:bg-red-600 transition-colors w-64"
          style="background-color: #CD0F45;"
          @click="handleRegister"
        >
          Register Now
        </button>
      </div>
      
      </div>
    </div>
  </div>

    <!-- Statistics -->
    <div class="grid grid-cols-3 gap-4 max-w-2xl">
      <div v-for="stat in statistics" :key="stat.label" 
           class="rounded-lg shadow p-6 text-center"
           style = "background-color: #F8F8F9; "
           >
        <div class="text-3xl font-bold">{{ stat.value }}</div>
        <div class="text-sm text-gray-600">{{ stat.label }}</div>
      </div>
    </div>

    <!-- About Section -->
    <div class="space-y-4 max-w-3xl">
      <h2 class="text-2xl font-semibold">About this event</h2>
      <p class="text-gray-600">Artificial Intelligence is a business reality</p>
      <p class="text-gray-600">
        You are interested in AI, but had enough of science fiction?
        Join the Applied Artificial Intelligence Conference on 17.10.2024 in Vienna, focuses on the real-world
        impact of AI - from policy, strategy & organization to use-cases and investments.
      </p>
      
      <h3 class="text-xl font-semibold mt-6">What can you expect?</h3>
      <p class="text-gray-600">
        Keynotes of international experts, business case demonstrations, panel discussions, in-depth
        workshops, and prearranged 1:1 meetings with participants from all over the world.
      </p>

      <h3 class="text-xl font-semibold mt-6">Event Organiser</h3>
      <p class="text-gray-600">WKO AUSSENWIRTSCHAFT AUSTRIA</p>
    </div>

    <!-- Registration Notice -->
    
  </div>
</template>


<style scoped>
button, input, textarea, h1, h2, h3,div {
  font-family: 'Inter', sans-serif !important;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>