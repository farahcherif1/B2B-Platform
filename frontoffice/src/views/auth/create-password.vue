<script>
import { ErrorMessage, Field, Form } from "vee-validate";
import Authlayout from "../../layouts/authlayout.vue";
import * as yup from "yup";
import AuthService from "../../services/auth.service";

export default {
  components: {
    Authlayout,
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    return {
      schema: yup.object({
        password: yup.string().required().min(8),
        confirmPassword: yup
          .string()
          .required()
          .oneOf([yup.ref("password"), null], "Passwords must match"),
      }),
      tooglePassword: false,
      toogleConfirmPassword: false,
    };
  },
  methods: {
    onSubmit(values) {
      const { password } = values;
      const token = this.$route.params.token;

      AuthService.createPassword(password,token )
        .then(() => {
          this.$router.push("/login");
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
    <BCard class="p-4 w-75">
      <BCardBody class="p-4 bg-white">
        <div class="text-center mt-2">
          <h5 class="text-primary text-start">Create new password</h5>
          <p class="text-secondary text-start">
            Your new password must be different from previous used password.
          </p>
        </div>

        <div class="p-2">
          <Form :validation-schema="schema" @submit="onSubmit">
            <div class="mb-3">
              <label class="form-label" for="password-input">Password</label>
              <div class="position-relative auth-pass-inputgroup">
                <Field
                  name="password"
                  :type="tooglePassword ? 'text' : 'password'"
                  class="form-control pe-5 password-input"
                  onpaste="return false"
                  placeholder="Enter password"
                />
                <BButton
                  variant="link"
                  class="position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                  type="button"
                  id="password-addon"
                  @click="tooglePassword = !tooglePassword"
                  ><i class="ri-eye-fill align-middle"></i>
                </BButton>
                <ErrorMessage class="text-danger" name="password" />
              </div>
              <div id="passwordInput" class="form-text">
                Must be at least 8 characters.
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label" for="confirm-password-input"
                >Confirm Password</label
              >
              <div class="position-relative auth-pass-inputgroup mb-3">
                <Field
                  name="confirmPassword"
                  :type="toogleConfirmPassword ? 'text' : 'password'"
                  class="form-control pe-5 password-input"
                  onpaste="return false"
                  placeholder="Confirm password"
                />
                <BButton
                  variant="link"
                  class="position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                  type="button"
                  id="confirm-password-input"
                  @click="toogleConfirmPassword = !toogleConfirmPassword"
                  ><i class="ri-eye-fill align-middle"></i>
                </BButton>
                <ErrorMessage class="text-danger" name="confirmPassword" />
              </div>
            </div>

            <div id="password-contain" class="p-3 bg-light mb-2 rounded">
              <h5 class="fs-13">Password must contain:</h5>
              <p id="pass-length" class="invalid fs-12 mb-2">
                Minimum <b>8 characters</b>
              </p>
              <p id="pass-lower" class="invalid fs-12 mb-2">
                At <b>lowercase</b> letter (a-z)
              </p>
              <p id="pass-upper" class="invalid fs-12 mb-2">
                At least <b>uppercase</b> letter (A-Z)
              </p>
              <p id="pass-number" class="invalid fs-12 mb-0">
                A least <b>number</b> (0-9)
              </p>
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

            <div class="mt-4">
              <BButton
                variant="success"
                class="w-100"
                @click="validatepassword"
                type="submit"
                >Reset Password</BButton
              >
            </div>
          </Form>
        </div>
      </BCardBody>
      <div class="mt-4 text-center mb-4">
        <p class="mb-0">
          Wait, I remember my password...
          <router-link
            to="/login"
            class="fw-semibold text-primary text-decoration-underline"
          >
            Click here
          </router-link>
        </p>
      </div>
    </BCard>
  </Authlayout>
</template>
