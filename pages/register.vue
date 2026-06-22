<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2 class="auth-title">ثبت نام</h2>

      <form @submit.prevent="handleRegister" class="auth-form">
        <!-- نام کاربری -->
        <div class="form-group">
          <label class="form-label">نام کاربری</label>
          <input
            v-model="form.username"
            type="text"
            required
            class="form-input"
          />
        </div>

        <!-- ایمیل -->
        <div class="form-group">
          <label class="form-label">ایمیل</label>
          <input
            v-model="form.email"
            type="email"
            required
            class="form-input"
          />
        </div>

        <!-- شماره تلفن -->
        <div class="form-group">
          <label class="form-label">شماره تلفن</label>
          <input
            v-model="form.phone_number"
            type="tel"
            required
            class="form-input"
          />
        </div>

        <!-- نام -->
        <div class="form-group">
          <label class="form-label">نام</label>
          <input
            v-model="form.first_name"
            type="text"
            required
            class="form-input"
          />
        </div>

        <!-- نام خانوادگی -->
        <div class="form-group">
          <label class="form-label">نام خانوادگی</label>
          <input
            v-model="form.last_name"
            type="text"
            required
            class="form-input"
          />
        </div>

        <!-- رمز عبور -->
        <div class="form-group">
          <label class="form-label">رمز عبور</label>
          <input
            v-model="form.password"
            type="password"
            required
            class="form-input"
          />
        </div>

        <!-- تکرار رمز عبور -->
        <div class="form-group">
          <label class="form-label">تکرار رمز عبور</label>
          <input
            v-model="form.password2"
            type="password"
            required
            class="form-input"
          />
        </div>

        <!-- پیغام خطا -->
        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <!-- دکمه ثبت نام -->
        <button type="submit" :disabled="isLoading" class="btn-primary">
          {{ isLoading ? "در حال ثبت نام..." : "ثبت نام" }}
        </button>
      </form>

      <!-- لینک ورود -->
      <p class="auth-footer">
        حساب کاربری دارید؟
        <NuxtLink to="/login" class="auth-link"> ورود </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "auth",
});

const { register, isLoading, error } = useAuth();
const router = useRouter();

const form = ref({
  username: "",
  email: "",
  phone_number: "",
  first_name: "",
  last_name: "",
  password: "",
  password2: "",
});

const handleRegister = async () => {
  try {
    await register(form.value);
    router.push("/");
  } catch (err) {
    console.error("Register failed:", err);
  }
};
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  padding: 20px;
}

.auth-card {
  max-width: 450px;
  width: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 40px;
}

.auth-title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 6px;
  color: #555;
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.error-message {
  color: #dc2626;
  font-size: 14px;
  padding: 10px;
  background-color: #fee;
  border-radius: 6px;
  border: 1px solid #fcc;
}

.btn-primary {
  width: 100%;
  padding: 12px;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #1d4ed8;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-footer {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}

.auth-link {
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
}

.auth-link:hover {
  text-decoration: underline;
}
</style>
