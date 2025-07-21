import { alertConfirm } from "./showAlert";

export const setDisabledAddToCart = (value) => {
  const buttonATC = document.querySelector('.single_add_to_cart_button');
  if (!buttonATC) {
    return;
  }
  if (value) {
    buttonATC.setAttribute('disabled', true)
    buttonATC.classList.add('error-photos');
  } else {
    buttonATC.removeAttribute('disabled');
    buttonATC.classList.remove('error-photos');
  }
}


$(function(){
  $('form.cart').off('submit');
})

