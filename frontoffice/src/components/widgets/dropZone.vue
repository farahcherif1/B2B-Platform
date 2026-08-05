
<template>
  <div
    @dragenter.prevent="toggleActive"
    @dragleave.prevent="toggleActive"
    @dragover.prevent
    @drop.prevent="toggleActive"
    :class="{ 'active-dropzone': active }"
    class="dropzone position-relative"
    style="height: 100%;
    min-height: 0px;
    "
  >
    <div class="mb-1">
        <i class="display-4 text-muted ri-upload-cloud-2-fill"></i>
    </div>

    <h5>{{ text }}</h5>
    <label for="dropzoneFile" class="stretched-link"></label>
   <input type="file" id="dropzoneFile" class="dropzoneFile btn btn-primary" />
  </div>
</template>


<script>
import { ref } from "vue";
export default {
  props : {
    text : {
      type : String,
      required : true,
      default : 'Drag and Drop your files or Browse'
    }
  },
  name: "dropzone",
  setup() {
    const active = ref(false);
    const toggleActive = () => {
      active.value = !active.value;
    };
    return { active, toggleActive };
  },
};
</script>
