import '@babel/polyfill';
import { showAlert } from './alert';
import axios from 'axios';

/* when deceased button is pressed
 the one of the dependants the contribution request is created 
 and admin is required to approve or reject the request*/

export const contribution = async (userid, dependantsid) => {
  console.log(email, password);
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/users/${userid}/dependents/${dependantsid}`,
      data: {
        userid,
        dependantsid,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Successfully Requested For Contribution');
      window.setTimeout(() => {
        location.assign('/');
        // location.replace(document.referrer);
      }, 1500);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
