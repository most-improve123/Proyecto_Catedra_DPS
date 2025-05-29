
const firebaseConfig = {
  apiKey: "AIzaSyB59dQD36LdcugrKv60vHnK6alADN2k5cU",
  authDomain: "agri-7429e.firebaseapp.com",
  projectId: "agri-7429e",
  storageBucket: "agri-7429e.firebasestorage.app",
  messagingSenderId: "296635663830",
  appId: "1:296635663830:android:64b965de2b819852299077"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);