import { auth } from "../firebase/firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDocumento } from "../fetchData/controllers";

// Login using email/password
const loginEmail = async () => {
  // Get email/password from Form Inputs
  const loginEmail = txtEmail.value;
  const loginPassword = txtPassword.value;

  // Use auth from Firebase to log in to existing account
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      loginEmail,
      loginPassword
    );

    return getDocumento("users",userCredential.user.uid)
  } catch (error) {
    console.log(`There was an error: ${error}`);
  }
};

export default loginEmail;