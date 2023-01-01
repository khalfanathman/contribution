/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alert';

//TYPE PASSWORD OR DATA
export const UpdateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://127.0.0.1:3000/api/v1/users/updateMyPassword'
        : 'http://127.0.0.1:3000/api/v1/users/updateMe';
    console.log('Updated');
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Successfully Updated');
      window.setTimeout(() => {
        location.assign('/me');
      }, 1000);
    }
  } catch (error) {
    alert(error);
  }
};
