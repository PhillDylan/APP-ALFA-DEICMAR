import { Api } from "../axios-config";
import CryptoJS from "crypto-js";

const secretKey = "sua_chave_de_criptografia";
const iv = CryptoJS.enc.Hex.parse('00000000000000000000000000000000'); // IV fixo

interface IAuth {
  accessToken: string;
  idoperador: string;
  message: string;
  nomeoperador: string;
  first_access: string;
}


const encrypt = (data: string): string => {
  const derivedKey = CryptoJS.PBKDF2(secretKey, iv, { keySize: 256 / 32, iterations: 100 }); // Chave derivada do IV
  const encryptedData = CryptoJS.AES.encrypt(data, derivedKey, { iv }).toString();
  return encryptedData;
};

const decrypt = (encryptedData: string): string => {
  const derivedKey = CryptoJS.PBKDF2(secretKey, iv, { keySize: 256 / 32, iterations: 100 }); // Chave derivada do IV
  const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, derivedKey, { iv });
  const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
  return decryptedData;
};

const auth = async (
  email: string,
  password: string
): Promise<IAuth | Error> => {
  try {
    const concatenatedData = `${email}:${password}`; // Use a senha original, não o hash
    const encryptedData = encrypt(concatenatedData);

    const { data } = await Api.postForm("/auth", { data: { encryptedData } });

    if (data) {
      console.log(data)
      return data;
    }

    return new Error("Erro no login.");
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro no login."
    );
  }
};

export const AuthService = {
  auth,
};
