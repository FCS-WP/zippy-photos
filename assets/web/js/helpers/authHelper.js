export const getForgotPasswordUrl = () => {
  const loginForm = document.getElementById("custom-login-form");
  return loginForm ? loginForm.dataset.forgot_url : '';
};
