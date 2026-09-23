"use strict";

const STORAGE_KEY = "aiTutorDemoUser:v1";
const REMEMBER_KEY = "aiTutorRememberedEmail:v1";

function setStatus(element, message, tone = "success") {
  if (!element) return;
  element.textContent = message;
  element.dataset.tone = tone;
}

function getErrorElement(input) {
  return document.getElementById(`${input.id}Error`);
}

function showError(input, message) {
  const error = getErrorElement(input);
  input.setCustomValidity(message);
  input.setAttribute("aria-invalid", "true");
  if (error) {
    error.textContent = message;
    error.hidden = false;
  }
}

function clearError(input) {
  const error = getErrorElement(input);
  input.setCustomValidity("");
  input.removeAttribute("aria-invalid");
  if (error) {
    error.textContent = "";
    error.hidden = true;
  }
}

function readableValidationMessage(input) {
  if (input.validity.valueMissing) return `请填写${input.labels?.[0]?.textContent.trim() || "此项"}`;
  if (input.validity.typeMismatch && input.type === "email") return "请输入有效的邮箱地址";
  if (input.validity.patternMismatch && input.type === "tel") return "请输入有效的 11 位手机号码";
  if (input.validity.patternMismatch && input.type === "password") return "密码需包含字母和数字";
  if (input.validity.tooShort) return `至少需要 ${input.minLength} 位字符`;
  if (input.validity.tooLong) return `最多允许 ${input.maxLength} 位字符`;
  if (input.validity.rangeUnderflow) return `不能小于 ${input.min}`;
  if (input.validity.rangeOverflow) return `不能大于 ${input.max}`;
  return "请检查此项内容";
}

function validateInput(input) {
  clearError(input);
  if (!input.checkValidity()) {
    showError(input, readableValidationMessage(input));
    return false;
  }
  return true;
}

async function digestPassword(password) {
  const data = new TextEncoder().encode(`ai-tutor-demo:${password}`);
  if (globalThis.crypto?.subtle) {
    const digest = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  return Array.from(data, (byte) => (byte * 31 % 255).toString(16).padStart(2, "0")).join("");
}

function collectInterests() {
  return Array.from(document.querySelectorAll("input[name='interests']:checked"), (input) => input.value);
}

function getPasswordScore(password) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Za-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password) && password.length >= 10) score += 1;
  return score;
}

function updatePasswordStrength() {
  const input = document.getElementById("registerPassword");
  const meter = document.getElementById("passwordStrength");
  const output = document.getElementById("strengthText");
  if (!input || !meter || !output) return;
  const labels = ["尚未输入", "较弱", "一般", "良好", "很强"];
  const score = input.value ? Math.max(1, getPasswordScore(input.value)) : 0;
  meter.value = score;
  output.textContent = labels[score];
}

function updateAvatarPreview() {
  const fileInput = document.getElementById("avatar");
  const preview = document.getElementById("avatarPreview");
  if (!fileInput || !preview || !fileInput.files?.[0]) return;
  const [file] = fileInput.files;
  if (!file.type.startsWith("image/")) return;
  const imageUrl = URL.createObjectURL(file);
  preview.src = imageUrl;
  preview.hidden = false;
  preview.addEventListener("load", () => URL.revokeObjectURL(imageUrl), { once: true });
}

document.querySelectorAll(".password-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const input = document.getElementById(button.getAttribute("aria-controls"));
    if (!input) return;
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    button.textContent = show ? "隐藏" : "显示";
    button.setAttribute("aria-pressed", String(show));
  });
});

document.querySelectorAll(".auth-form input, .auth-form select").forEach((input) => {
  input.addEventListener("blur", () => {
    if (input.value || input.required) validateInput(input);
  });
  input.addEventListener("input", () => {
    if (input.getAttribute("aria-invalid")) validateInput(input);
  });
});

document.getElementById("registerPassword")?.addEventListener("input", updatePasswordStrength);
document.getElementById("avatar")?.addEventListener("change", updateAvatarPreview);

document.querySelectorAll("[data-demo-action='reset']").forEach((button) => {
  button.addEventListener("click", () => setStatus(document.getElementById("loginStatus"), "演示版暂不发送重置邮件，请使用注册页创建账号。", "error"));
});

const rememberedEmail = localStorage.getItem(REMEMBER_KEY);
const loginEmail = document.getElementById("loginEmail");
const rememberAccount = document.getElementById("rememberAccount");
const loginStatus = document.getElementById("loginStatus");

if (rememberedEmail && loginEmail && rememberAccount) {
  loginEmail.value = rememberedEmail;
  rememberAccount.checked = true;
}

if (new URLSearchParams(location.search).get("registered") === "1") {
  setStatus(loginStatus, "注册成功，请使用新账号登录。");
}

document.getElementById("registerForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const valid = Array.from(form.querySelectorAll("input, select")).every((input) => validateInput(input));
  const password = form.elements.password;
  const confirmPassword = form.elements.confirmPassword;

  if (password.value !== confirmPassword.value) {
    showError(confirmPassword, "两次输入的密码不一致");
    confirmPassword.focus();
    return;
  }

  if (!form.elements.terms.checked) {
    showError(form.elements.terms, "请先同意平台使用约定");
    return;
  }

  if (!valid || !form.checkValidity()) {
    form.querySelector(":invalid")?.focus();
    return;
  }

  const profile = {
    nickname: form.elements.nickname.value.trim(),
    email: form.elements.email.value.trim().toLowerCase(),
    phone: form.elements.phone.value,
    role: form.elements.role.value,
    school: form.elements.school.value.trim(),
    grade: Number(form.elements.grade.value),
    birthday: form.elements.birthday.value,
    interests: collectInterests()
  };

  const record = { profile, passwordHash: await digestPassword(password.value), createdAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  setStatus(document.getElementById("registerStatus"), "学习档案创建成功，正在前往登录页面…");
  form.querySelector("button[type='submit']").disabled = true;
  setTimeout(() => {
    location.href = `index.html?registered=1&email=${encodeURIComponent(profile.email)}`;
  }, 700);
});

document.getElementById("loginForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const emailInput = form.elements.email;
  const passwordInput = form.elements.password;
  const emailValid = validateInput(emailInput);
  const passwordValid = validateInput(passwordInput);
  if (!emailValid || !passwordValid) return;

  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  if (!stored || stored.profile.email !== emailInput.value.trim().toLowerCase()) {
    showError(emailInput, "未找到这个邮箱对应的演示档案");
    emailInput.focus();
    return;
  }

  const inputHash = await digestPassword(passwordInput.value);
  if (inputHash !== stored.passwordHash) {
    showError(passwordInput, "密码不正确，请重新输入");
    passwordInput.focus();
    return;
  }

  clearError(passwordInput);
  if (rememberAccount.checked) localStorage.setItem(REMEMBER_KEY, stored.profile.email);
  else localStorage.removeItem(REMEMBER_KEY);
  setStatus(loginStatus, `欢迎回来，${stored.profile.nickname}。正在进入个性化学习空间…`);
  form.querySelector("button[type='submit']").disabled = true;
});
