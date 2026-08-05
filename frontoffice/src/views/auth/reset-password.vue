<script>
import Authlayout from "../../layouts/authlayout.vue";
import Lottie from "@/components/widgets/lottie.vue";
import animationData from "@/components/widgets/rhvddzym.json";
import { ErrorMessage, Field, Form } from "vee-validate";
import * as yup from "yup";
import { EMAIL_PATTERN } from "../../utils/pattern";
import AuthService from "../../services/auth.service";

export default {
  components: {
    Authlayout,
    lottie: Lottie,
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    return {
      defaultOptions: {
        animationData: animationData,
      },
      emailSchema: yup.object().shape({
        email: yup
          .string()
          .email()
          .matches(EMAIL_PATTERN, "Email format is invalid")
          .required(),
      }),
      isSubmitting: false,
      success: "",
      error: "",
    };
  },
  methods: {
    onSubmit(values) {
      const { email } = values;
      this.isSubmitting = true;
      AuthService.resetPassword(email).finally(() => {
        this.isSubmitting = false;
      });
    },
  },
};
</script>

<template>
  <Authlayout>
    <BCard no-body style="width: 750px; height: 700px">
      <BCardBody class="d-flex align-items-center flex-column p-4">
        <div class="text-center mt-2 align-self-start mb-4">
          <h5 class="text-secondary text-start">Forgot Password?</h5>
          <p class="text-muted text-start">Reset password with CEPEX</p>
        </div>
        <div class="d-flex flex-column gap-3 w-75 mt-4">
          <lottie
            class="avatar-xl some-class"
            colors="primary:#0ab39c"
            :options="defaultOptions"
            :height="120"
            :width="120"
          />
          <BAlert
            :model-value="true"
            variant="warning"
            class="mb-2 mx-2 border-0 text-center"
            >Enter your email and instructions will be sent to you!</BAlert
          >

          <div class="p-2">
            <Form @submit="onSubmit" :validation-schema="emailSchema">
              <div class="mb-4">
                <label class="form-label">Email</label>
                <Field
                  name="email"
                  type="email"
                  class="form-control"
                  id="email"
                  placeholder="Enter Email"
                />
                <ErrorMessage name="email" class="text-danger" />
              </div>

              <div class="text-center mt-4">
                <BButton
                  variant="secondary"
                  class="w-100"
                  type="submit"
                  :disabled="isSubmitting"
                  >Send Reset Link</BButton
                >
              </div>
            </Form>
          </div>
        </div>
        <div
          v-if="success || error"
          class="alert alert-dismissible fade show mt-4 w-75 d-flex justify-content-center"
        >
          <p v-if="success" class="text-success m-0">
            <i class="ri-check-line me-2"></i> {{ success }}
          </p>
          <p v-if="error" class="text-danger m-0">
            <i class="ri-error-warning-line me-2"></i> {{ error }}
          </p>
        </div>

        <div class="mt-4 text-center">
          <p class="mb-0">
            Wait, I remember my password...
            <router-link
              to="/login"
              class="fw-semibold text-secondary text-decoration-underline"
            >
              Click here
            </router-link>
          </p>
        </div>
      </BCardBody>
    </BCard>
  </Authlayout>
</template>
