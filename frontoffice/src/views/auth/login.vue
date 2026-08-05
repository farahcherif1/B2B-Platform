<script>
import Authlayout from "../../layouts/authlayout.vue";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import AuthService from "../../services/auth.service";

const EMAIL_PATTERN = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

export default {
  components: {
    Authlayout,
    Form,
    Field,
    ErrorMessage,
  },

  data() {
    return {
      togglePasswordlogin: false,
      registrationSchema: yup.object({
        email: yup
          .string()
          .email()
          .matches(EMAIL_PATTERN, "Email format is invalid")
          .required(),
        username: yup.string().required("Username is required"),
        password: yup.string().min(6).required(),
      }),
      loginSchema: yup.object({
        email: yup
          .string()
          .email()
          .matches(EMAIL_PATTERN, "Email format is invalid")
          .required(),
        password: yup.string().min(6).required(),
      }),
      isSubmitting: false,
      errorMessage: "",
    };
  },

  methods: {
    onSubmitlogin(values) {
      this.isSubmitting = true;
      AuthService.login(values)
        .then((res) => {
          localStorage.setItem("token", res.data.access_token);
          
          this.$router.push("/event-cards");
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
    <hr class="border border-secondary border-dashed" />
    <div class="p-lg-5 p-4 bg-white">
      <div>
        <h5 class="text-primary">Welcome Back !</h5>
        <p class="text-muted">Sign in to continue to Cepex B2B.</p>
      </div>

      <div class="mt-4">
        <Form :validation-schema="loginSchema" @submit="onSubmitlogin">
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <Field
              name="email"
              type="text"
              class="form-control"
              placeholder="Enter email"
            />
          </div>
          <ErrorMessage name="email" class="text-danger" />
          <div class="mb-3">
            <div class="float-end">
              <router-link to="/reset-password" class="text-muted">
                Forgot password?</router-link
              >
            </div>
            <label class="form-label" for="password-input">Password</label>
            <div class="position-relative auth-pass-inputgroup mb-3">
              <Field
                name="password"
                :type="togglePasswordlogin ? 'text' : 'password'"
                class="form-control pe-5"
                placeholder="Enter password"
              />
              <BButton
                variant="link"
                class="position-absolute end-0 top-0 text-decoration-none text-muted"
                type="button"
                id="password-addon"
                @click="togglePasswordlogin = !togglePasswordlogin"
                ><i class="ri-eye-fill align-middle"></i
              ></BButton>
            </div>
          </div>

          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              value=""
              id="auth-remember-check"
            />
            <label class="form-check-label" for="auth-remember-check"
              >Remember me</label
            >
          </div>

          <div v-if="errorMessage" class="alert alert-danger mt-2" role="alert">
            {{ errorMessage }}
          </div>

          <div class="d-flex justify-content-center mt-4">
            <BButton
              pill
              variant="outline-primary"
              class="w-75 fw-medium border-2"
              type="submit"
              :disabled="isSubmitting"
              >Log In</BButton
            >
          </div>
          <div class="mt-4 text-center">
            <p class="text-center mt-3 fw-medium">OU</p>
            <div class="d-flex justify-content-center">
              <router-link to="/signup" class="text-primary fw-medium">
                Créer votre compte sur CEPEX B2B
              </router-link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  </Authlayout>
</template>
