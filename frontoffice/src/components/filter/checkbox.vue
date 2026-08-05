<script>
import {BRow} from "bootstrap-vue-next";

export default{
  components: {BRow},
  name : "checkbox",
  props : {
    title : {


    },
    selected: {
      type: Array,
      default: () => [],
    },
    searchExistent: {
      type: Boolean,
      default: false,
    },
    elements : {
      type: Array,
      default: () => [],
    }

  },
  data() {
    return{
      searchQuery : ''
    }

  },

  computed : {
    selectedElements: {
      get() {
        return this.selected;
      },
      set(value) {
        this.$emit("update:selected", value);
      },
    },
    filteredElements() {
      return this.elements.filter(element => 
      element.toLowerCase().includes(this.searchQuery.toLowerCase())).slice(0, 6);
    },
  },
}
</script>

<template>
  <BRow>
    <h5 class = "p-4 pb-0 m-3 mt-0 mb-2">{{this.title}}</h5>

  </BRow>
  <BRow class="align-items-center p-4 pt-0" v-if = "searchExistent">
    <BCol sm = "9">
      <div>
        <input type="text" class="form-control" 
        id="placeholderInput" 
        placeholder="Search"
        v-model="searchQuery"
        >
      </div>
    </BCol>
  </BRow>
  <BRow class="align-items-center p-4 pt-0">
    <BCol sm = "6" v-for="(element,index) in filteredElements" v-bind:key="index">
      <div class="form-check m-3 ">
        <input class="form-check-input"
         type="checkbox"
          v-model="selectedElements"
          :value="element"
          >
        <label class="form-check-label whitespace-pre " for= {{element}}>
          {{element}}
        </label>
      </div>
    </BCol>
  </BRow>
</template>

<style>

</style>