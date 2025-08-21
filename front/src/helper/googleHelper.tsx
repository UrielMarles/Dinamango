import { apiHelper } from "@/helper/apiHelper";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/helper/firebaseConfig";
import { FirebaseError } from "firebase/app";

const provider = new GoogleAuthProvider();

export const inicioSesionGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        const data = {
            UID: user?.uid,
            Email: user?.email,
            Nombre: user?.displayName,
            Apellido: user?.displayName,
            ProfilePictureUrl: user?.photoURL
        };

        const responseData = await apiHelper.googleLogin(data);
        sessionStorage.setItem("authToken", responseData.token || "");
        window.location.href = "/";
    } catch (error) {
        if (error instanceof FirebaseError) {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = (error as any).customData?.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
        } else {
            console.error("Error inesperado:", error);
        }
    }
};
