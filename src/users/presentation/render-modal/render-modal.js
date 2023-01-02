import modalHtml from './render-modal.html?raw';
import './render-modal.css';
import { User } from '../../models/user';
import { getUserByID } from '../../use-cases/get-user-by-id';

let modal, form;
let loadedUser = {};

/**
 * @param {String|Number} id
 */
export const showModal = async id => {
  modal?.classList.remove('hide-modal');
  loadedUser = {};

  if (!id) return;
  const user = await getUserByID(id);

  setFormValues(user);
};

export const hideModal = () => {
  modal?.classList.add('hide-modal');
  form?.reset(); // reset() es un metodo nativo para resetear los formularios
};

/**
 * @param {User} user
 */
const setFormValues = user => {
  form.querySelector('[name="firstName"]').value = user.firstName;
  form.querySelector('[name="lastName"]').value = user.lastName;
  form.querySelector('[name="balance"]').value = user.balance;
  form.querySelector('[name="isActive"]').checked = user.isActive;

  loadedUser = user;
};

/**
 * @param {HTMLDivElement} element
 * @param {(userLike) => Promise<void>} callback
 */
export const renderModal = (element, callback) => {
  if (modal) return;

  modal = document.createElement('div');
  modal.innerHTML = modalHtml;
  modal.className = 'modal-container hide-modal';

  // Cerrar el modal
  modal.addEventListener('click', e => {
    if (e.target.className === 'modal-container') {
      hideModal();
    }
  });

  // Formulario
  form = modal.querySelector('form');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const formData = new FormData(form);
    const userLike = { ...loadedUser };

    for (const [key, value] of formData) {
      if (key === 'balance') {
        userLike[key] = +value; // convierte string a number
        continue;
      }

      if (key === 'isActive') {
        userLike[key] = value === 'on' ? true : false;
        continue;
      }

      userLike[key] = value;
    }

    await callback(userLike);

    hideModal();
  });

  element.append(modal);
};
