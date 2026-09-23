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

function updateErrorSummary(form, messages) {
  const summary = document.getElementById(`${form.id.replace("Form", "")}ErrorSummary`);
  if (!summary) return;
  if (!messages.length) {
    summary.textContent = "";
    summary.hidden = true;
    return;
  }
  summary.textContent = `请检查以下内容：${messages.slice(0, 3).join("；")}${messages.length > 3 ? "等" : ""}`;
  summary.hidden = false;
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

function renderInterestTags(container, interests) {
  if (!container) return;
  container.replaceChildren();
  interests.forEach((interest) => {
    const tag = document.createElement("span");
    tag.className = "interest-tag";
    tag.textContent = interest;
    container.append(tag);
  });
}

function updateAvatarPreview() {
  const fileInput = document.getElementById("avatar");
  const preview = document.getElementById("avatarPreview");
  const fallback = document.getElementById("avatarFallback");
  if (!fileInput || !preview || !fallback || !fileInput.files?.[0]) return;
  const [file] = fileInput.files;
  if (!file.type.startsWith("image/")) return;
  const imageUrl = URL.createObjectURL(file);
  preview.src = imageUrl;
  preview.hidden = false;
  fallback.hidden = true;
  preview.addEventListener("load", () => URL.revokeObjectURL(imageUrl), { once: true });
}

function updateProfilePreview() {
  const form = document.getElementById("registerForm");
  if (!form) return;
  const nickname = form.elements.nickname?.value.trim();
  const role = form.elements.role?.value;
  const school = form.elements.school?.value.trim();
  const grade = form.elements.grade?.value;
  const interests = collectInterests();
  const nicknamePreview = document.getElementById("previewNickname");
  const rolePreview = document.getElementById("previewRole");
  const fallback = document.getElementById("avatarFallback");

  if (nicknamePreview) nicknamePreview.textContent = nickname || "未来的 AI 学习者";
  if (fallback) fallback.textContent = (nickname || "智").slice(0, 1);
  if (rolePreview) {
    const details = [role, school, grade ? `${grade} 年级` : ""].filter(Boolean);
    rolePreview.textContent = details.length ? details.join(" · ") : "选择学习身份与兴趣后，这里会实时更新";
  }
  renderInterestTags(document.getElementById("previewInterests"), interests);
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
document.querySelectorAll("#registerForm input, #registerForm select").forEach((input) => {
  input.addEventListener("input", updateProfilePreview);
  input.addEventListener("change", updateProfilePreview);
});
document.querySelectorAll("input[name='theme']").forEach((input) => {
  input.addEventListener("change", () => {
    document.body.dataset.theme = input.value;
  });
});

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
  const messages = [];
  const fields = Array.from(form.querySelectorAll("input, select"));
  const valid = fields.map((input) => {
    const isValid = validateInput(input);
    if (!isValid) messages.push(getErrorElement(input)?.textContent || "存在无效内容");
    return isValid;
  }).every(Boolean);
  const password = form.elements.password;
  const confirmPassword = form.elements.confirmPassword;

  if (!valid) {
    updateErrorSummary(form, messages);
    form.querySelector(":invalid")?.focus();
    return;
  }

  if (password.value !== confirmPassword.value) {
    showError(confirmPassword, "两次输入的密码不一致");
    messages.push("两次输入的密码不一致");
    updateErrorSummary(form, messages);
    confirmPassword.focus();
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
    interests: collectInterests(),
    theme: form.elements.theme.value
  };

  const record = { profile, passwordHash: await digestPassword(password.value), createdAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  setStatus(document.getElementById("registerStatus"), "学习档案创建成功。");
  form.querySelector("button[type='submit']").disabled = true;
  const dialog = document.getElementById("successDialog");
  const goToLogin = document.getElementById("goToLogin");
  const destination = `index.html?registered=1&email=${encodeURIComponent(profile.email)}`;
  if (dialog?.showModal) {
    dialog.showModal();
    goToLogin?.focus();
    goToLogin?.addEventListener("click", () => { location.href = destination; }, { once: true });
  } else {
    setTimeout(() => { location.href = destination; }, 700);
  }
});

document.getElementById("loginForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const emailInput = form.elements.email;
  const passwordInput = form.elements.password;
  const emailValid = validateInput(emailInput);
  const passwordValid = validateInput(passwordInput);
  const messages = [];
  if (!emailValid) messages.push(getErrorElement(emailInput)?.textContent || "邮箱格式不正确");
  if (!passwordValid) messages.push(getErrorElement(passwordInput)?.textContent || "密码格式不正确");
  updateErrorSummary(form, messages);
  if (!emailValid || !passwordValid) {
    form.querySelector(":invalid")?.focus();
    return;
  }

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
  document.body.dataset.theme = stored.profile.theme || "ocean";
  const welcomeCard = document.getElementById("welcomeCard");
  const welcomeTitle = document.getElementById("welcomeTitle");
  const welcomeSummary = document.getElementById("welcomeSummary");
  const welcomeAvatar = document.getElementById("welcomeAvatar");
  if (welcomeCard && welcomeTitle && welcomeSummary && welcomeAvatar) {
    welcomeTitle.textContent = `${stored.profile.nickname}，欢迎回来`;
    welcomeSummary.textContent = `${stored.profile.role} · ${stored.profile.school} · ${stored.profile.grade} 年级`;
    welcomeAvatar.textContent = stored.profile.nickname.slice(0, 1);
    renderInterestTags(document.getElementById("welcomeInterests"), stored.profile.interests || []);
    welcomeCard.hidden = false;
    welcomeCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
  setStatus(loginStatus, "身份验证成功，个性化学习空间已准备就绪。");
});
