import { showAlert } from './alert';

import axios from 'axios';

export const trasnactMpesa = async (phone, amount, sms, contribId) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/contributions/${contribId}/transactions`,
      data: {
        phone,
        amount,
        sms,
      },
    });
    // console.log('JAVA SCRIPT1');
    console.log('JAVA SCRIPT', res);
    if (res.status === 200) {
      // if (res.data.status === 'success') {
      showAlert(
        'success',
        'Follow the prompt on your phone to complete: 25 seconds timeout'
      );
      window.setTimeout(() => {
        // location.assign('https://9c24eaa320ebb5.lhrtunnel.link/resultrans');
        location.reload('/');
        console.log('JAVA SCRIPT', res);
        // location.replace(document.referrer);
      }, 1500);
    } else {
      showAlert('error', 'Error processing Request Try Again');
    }
  } catch (error) {
    console.log('wont work why');
    showAlert('error', error.response.data.message);
  }
};
