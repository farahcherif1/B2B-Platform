<script>
import { ref, watch } from "vue";
import useVuelidate from "@vuelidate/core";

import DropZone from "@/components/widgets/dropZone";

export default {
  props: {
    img: {
      type: String,
      required: true,
      default: "",
    },
    text: {
      type: String,
      required: true,
      default: "Drag and Drop your files or Browse",
    },
    imgUrl: {
      type: String,
      required: true,
      default: "",
    },
  },
  emits: ["change"],

  name: "FileUploads",
  methods: {
    deleteRecord(ele) {
      ele.target.parentElement.parentElement.parentElement.remove();
    },
  },

  setup(props, { emit }) {
    let files = ref([]);
    let dropzoneFile = ref("");
    const drop = (e) => {
      dropzoneFile.value = e.dataTransfer.files[0];
      files.value.push(dropzoneFile.value);
      emit("change", files.value[0]);
    };
    const selectedFile = () => {
      dropzoneFile.value = document.querySelector(".dropzoneFile").files[0];
      files.value.push(dropzoneFile.value);
      emit("change", files.value[0]);
    };
    watch(
      () => [...files.value],
      (currentValue) => {
        return currentValue;
      }
    );

    return { dropzoneFile, files, drop, selectedFile, v$: useVuelidate() };
  },

  components: {
    DropZone,
  },
};
</script>

<template>
  <Layout>
    <PageHeader title="Form Upload" pageTitle="Forms" />
    <BRow class="align-items-center">
      <BCol lg="3" class="h-50">
        <img
          v-if="imgUrl"
          class="rounded-circle avatar-xl"
          alt="200x200"
          :src="imgUrl"
          data-holder-rendered="true"
        />
        <img
          v-else
          class="rounded"
          :src="require('@/assets/images/no_image.png')"
          data-holder-rendered="true"
        />
      </BCol>
      <BCol lg="8">
        <BCard no-body>
          <BCardBody>
            <DropZone
              @drop.prevent="drop"
              @change="selectedFile"
              :text="text"
            />
            <ul class="list-unstyled m-0 p-0" id="dropzone-preview">
              <div class="rounded" v-for="(file, index) of files" :key="index">
                <div class="d-flex p-2">
                  <div class="flex-grow-1">
                    <div class="pt-1">
                      <h5 class="fs-14 mb-1" data-dz-name="">
                        {{ file.name }}
                      </h5>
                      <p class="fs-13 text-muted mb-0" data-dz-size="">
                        <strong>{{ file.size / 1024 }}</strong> KB
                      </p>
                      <strong
                        class="error text-danger"
                        data-dz-errormessage=""
                      ></strong>
                    </div>
                  </div>
                  <div class="flex-shrink-0 ms-3">
                    <BButton
                      variant="danger"
                      size="sm"
                      data-dz-remove=""
                      @click="deleteRecord"
                    >
                      Delete
                    </BButton>
                  </div>
                </div>
              </div>
            </ul>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
  </Layout>
</template>
