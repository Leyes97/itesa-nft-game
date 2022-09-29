import db, { auth } from "../../firebase/firebase-config";
import {
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
} from "firebase/auth";
import {
  collection,
  query,
  where,
  getDoc,
  getDocs,
} from "firebase/firestore";

// Login using email/password
const sendLoginLink = async (email) => {
  // Buscar si existe usuario por email en la DB
  let userExists = false;

  const docRef = query(
    collection(db, "users"),
    where("email", "==", email)
  );
  const querySnapshot = await getDocs(docRef);
  // Existe el usuario
  querySnapshot.forEach((doc) => {
    // console.log(doc.id, " => ", doc.data());
    userExists = true;
  });

  // Si no existe el usuario, cortar la ejecución (no mandar mail)
  if (!userExists) {
    return true;
  }

  const location = window.location;

  let url;
  if (location.pathname === "/testToken")
    url = "http://localhost:3000/testToken";
  else if (location.pathname === "/user/tokens")
    url = "http://localhost:3000/user/tokens";
  else if (
    location.pathname === "/login" &&
    location.origin === "http://localhost:3000"
  )
    url = "http://localhost:3000/login2fa";
  // Redirigir a Vercel si no se cumplen las anteriores
  else url = "https://itesa-nft-game.vercel.app/login2fa";

  // Si existe el usuario, mandar el mail
  const actionCodeSettings = {
    // URL you want to redirect back to
    url,
    handleCodeInApp: true,
  };

  // Enviar correo para hacer login
  sendSignInLinkToEmail(auth, email, actionCodeSettings)
    .then(() => {
      // The link was successfully sent.
      console.log("Login Link set to:", email);
      // Save the email locally
      window.localStorage.setItem("emailForSignIn", email);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(error.code, error.message);
    });
};
export default sendLoginLink;

export const checkLoginLink = async () => {
  // Chequear si el usuario viene del link de su inbox
  if (!isSignInWithEmailLink(auth, window.location.href)) {
    // Redirigir a /login si el usuario no proviene desde el link de su inbox
    // TODO: 20/9 cambiar a Vercel para la demo
    window.location.replace("http://localhost:3000/login");
    // window.location.replace("https://itesa-nft-game.vercel.app/login");
  }
};
