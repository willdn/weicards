import iziToast from 'izitoast'

/**
 * Create a notification
 * @param {string} - Notification's message
 */
export const addNotification = (options) => {
  iziToast.show({
    message: `${options.message}`,
    color: options.color,
    position: 'bottomCenter',
    timeout: 3000,
    transitionIn: 'bounceInUp'
  })
}

/**
 * Create a success notification
 * @param {string} - Notification's message
 */
export const successNotification = (message) => {
  addNotification({
    color: 'green',
    message: `${message}`
  })
}

/**
 * Create an error notification
 * @param {string} - Notification's message
 */
export const errorNotification = (message) => {
  addNotification({
    color: 'red',
    message: `${message}`
  })
}

/**
 * Create an submitted to network notification
 * @param {string} - Notification's message
 */
export const networkSubmittedNotification = () => {
  addNotification({
    color: 'blue',
    message: `Transaction submitted to network !`
  })
}

/**
 * Create an Transaction denied notification
 * @param {string} - Notification's message
 */
export const transactionDeniedNotif = (erorMessage) => {
  if (erorMessage.includes('User denied transaction signature.')) {
    errorNotification(`Transaction signature denied`)
  }
}
