<script>
import Authlayout from "../../layouts/authlayout.vue";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { EMAIL_PATTERN } from "../../utils/pattern";
import AuthService from "../../services/auth.service";

// const EMAIL_PATTERN = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

export default {
  components: {
    Authlayout,
    Form,
    Field,
    ErrorMessage,
  },

  data() {
    return {
      togglePasswordregister: false,
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
    };
  },

  methods: {
    onSubmitregister(values) {
      const { email, username: name, password } = values;

      AuthService.register(email, name, password )
        .then(() => {
          this.$router.push("/login");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    onSubmitlogin(values) {
      AuthService.login(values)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
<template>
  <Authlayout>
    <div class="d-flex p-4 bg-white">
      <div class="p-lg-5 bg-white">
        <div>
          <h5 class="text-primary">Register Account</h5>
          <p class="text-muted">Get your cepex B2B account now.</p>
        </div>

        <div class="mt-4">
          <Form
            :validation-schema="registrationSchema"
            @submit="onSubmitregister"
          >
            <div class="mb-3">
              <label for="email" class="form-label"
                >Email
                <p class="text-danger d-inline">*</p>
              </label>
              <Field
                name="email"
                type="email"
                class="form-control"
                placeholder="Enter email"
              />
              <ErrorMessage class="text-danger" name="email" />
            </div>
            <div class="mb-3">
              <label for="username" class="form-label"
                >Username
                <p class="text-danger d-inline">*</p>
              </label>
              <Field
                name="username"
                type="text"
                class="form-control"
                placeholder="Enter username"
              />
              <ErrorMessage class="text-danger" name="username" />
            </div>

            <div class="mb-3">
              <label class="form-label" for="password-input">Password</label>
              <div class="position-relative auth-pass-inputgroup mb-3">
                <Field
                  name="password"
                  :type="togglePasswordregister ? 'text' : 'password'"
                  class="form-control pe-5"
                  placeholder="Enter password"
                  id="password-input"
                />
                <ErrorMessage class="text-danger" name="password" />
                <BButton
                  variant="link"
                  class="position-absolute end-0 top-0 text-decoration-none text-muted"
                  type="button"
                  id="password-addon"
                  @click="togglePasswordregister = !togglePasswordregister"
                  ><i class="ri-eye-fill align-middle"></i
                ></BButton>
              </div>
            </div>
            <p class="text-muted">
              By registering you agree to the cepex B2B
              <br />
              <router-link
                to="/term-conditions"
                style="color: #405189"
                class="fw-medium"
                >Terms of Use</router-link
              >
            </p>
            <div class="d-flex justify-content-center" style="margin-top: 2rem">
              <BButton
                pill
                variant="outline-primary"
                class="w-75 fw-medium border-2"
                type="submit"
                >Sign Up</BButton
              >
            </div>
          </Form>
        </div>
      </div>
    </div>
  </Authlayout>
</template>
