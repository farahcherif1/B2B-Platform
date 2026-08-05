<script>
import {BRow} from "bootstrap-vue-next";

export default {
  components: {BRow},
  props : {
    title : {

    },
    selected: {
      type: [String, Number],
      default: null,
    },
    searchExistent : {
      type: Boolean,
      default: false,
    },
    elements : {
      type: Array,
      default: () => [],
    },
    name : {
      type: String,
      default: "radio",
    }
  },
  data() {
    return{
      searchQuery : ''
    }

  },

  computed : {
    selectedElement: {
      get() {
        return this.selected;
      },
      set(value) {
        this.$emit("update:selected", value);
      },
    },
    filteredElements() {
      return this.elements.filter(element => element.toLowerCase().includes(this.searchQuery.toLowerCase()));
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
        <input type="text" 
        class="form-control" 
        id="placeholderInput" 
        placeholder="Search"
        v-model = "searchQuery"
        >
      </div>
    </BCol>
    </BRow>
    <BRow class="align-items-center p-4 pt-0">
    <BCol sm = "4" v-for="(element,index) in filteredElements" v-bind:key="index">
      <div class="form-check m-3">
        <input class="form-check-input" 
        type="radio" 
        :name="name" 
        v-model="selectedElement"
        :value="element"
        >
        <label class="form-check-label whitespace-pre w-fit" for= {{element}}>
          {{element}}
        </label>
      </div>
    </BCol>
  </BRow>
</template>

<style>

</style>