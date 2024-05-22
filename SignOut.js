
import { signOut } from './firebase';

export const handleLogout = (navigation) => {
    signOut(auth)
      .then(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Start', params: { loggedOut: true } }],
        });
      })
      .catch((error) => {
        console.error('Error signing out: ', error);
      });
};