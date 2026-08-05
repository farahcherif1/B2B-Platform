<script>
import Authlayout from "@/layouts/authlayout.vue";
import { ErrorMessage, Field, Form } from "vee-validate";
import * as yup from "yup";
import { EMAIL_PATTERN } from "@/utils/pattern";
import AuthService from "../../services/auth.service";
export default {
  data() {
    return {
      togglePassword: false,
      schema: yup.object({
        email: yup
          .string()
          .email()
          .matches(EMAIL_PATTERN, "Email format is invalid")
          .required(),
        password: yup.string().required(),
      }),
      errorMessage: "",
      isSubmitting: false,
    };
  },
  components: {
    Authlayout,
    Form,
    Field,
    ErrorMessage,
  },
  methods: {
    onSubmit(values) {
      this.isSubmitting = true;
      AuthService.signinOrganizer(values)
        .then((res) => {
          localStorage.setItem("token", res.data.access_token);
          if (res.data.is_organizer) {
            localStorage.setItem("isOrganizer", true);
          }
          this.$router.push("/event-list");
        })
        .catch(() => {
          this.errorMessage = "Invalid email or password";
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    },
  },
};
</script>

<template>
  <Authlayout>
    <div class="p-lg-5 p-4 bg-white">
      <div>
        <h5 class="text-primary">Welcome Back !</h5>
        <p class="text-muted">Sign in to continue as Organizer in Cepex B2B</p>
      </div>

      <div class="mt-4">
        <Form :validation-schema="schema" @submit="onSubmit">
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <Field
              name="email"
              type="text"
              class="form-control"
              id="email"
              placeholder="Enter email"
            />
          </div>
          <ErrorMessage name="email" class="text-danger" />

          <div class="mb-3">
            <div class="float-end">
              <router-link to="/auth/reset-pwd-cover" class="text-muted">
                Forgot password?</router-link
              >
            </div>
            <label class="form-label" for="password-input">Password</label>
            <div class="position-relative auth-pass-inputgroup mb-3">
              <Field
                name="password"
                :type="togglePassword ? 'text' : 'password'"
                class="form-control pe-5"
                placeholder="Enter password"
                id="password-input"
              />

              <BButton
                variant="link"
                class="position-absolute end-0 top-0 text-decoration-none text-muted"
                type="button"
                id="password-addon"
                @click="togglePassword = !togglePassword"
                ><i class="ri-eye-fill align-middle"></i
              ></BButton>
              <ErrorMessage name="password" class="text-danger" />
            </div>
          </div>

          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              value=""
              id="auth-remember-check"
            />
            <label class="form-check-label" for="auth-remember-check">Remember me</label>
          </div>

          <div v-if="errorMessage" class="alert alert-danger mt-2" role="alert">
            {{ errorMessage }}
          </div>
          <div class="d-flex justify-content-center" style="margin-top: 8rem">
            <BButton
              pill
              variant="outline-primary"
              class="w-75"
              type="submit"
              :disabled="isSubmitting"
              >Sign In</BButton
            >
          </div>
        </Form>
      </div>
    </div>
  </Authlayout>
</template>
