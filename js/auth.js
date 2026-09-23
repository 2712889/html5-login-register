"use strict";

function setStatus(element, message, tone = "success") {
  if (!element) return;
  element.textContent = message;
  element.dataset.tone = tone;
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

document.querySelectorAll("[data-demo-action='reset']").forEach((button) => {
  button.addEventListener("click", () => setStatus(document.getElementById("loginStatus"), "演示版暂不发送重置邮件，请使用注册页创建账号。", "error"));
});

const loginForm = document.getElementById("loginForm");
loginForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  setStatus(document.getElementById("loginStatus"), "登录验证将在表单增强阶段接入。", "error");
});

const registerForm = document.getElementById("registerForm");
registerForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  setStatus(document.getElementById("registerStatus"), "学习档案已创建，登录验证将在下一阶段接入。");
});
