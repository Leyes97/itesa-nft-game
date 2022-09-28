import { cookieStorageManager } from "@chakra-ui/react";
import { async } from "@firebase/util";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  setDoc,
  increment,
  where,
  query,
} from "firebase/firestore";
import db from "../firebase/firebase-config";

//Agregar un nuevo documento a una colección
export const addNewDoc = async (coleccion, data) => {
  const docRef = await addDoc(collection(db, coleccion), data);
  console.log("Document written with name ", docRef);
};

//Agregar un nuevo documento a una colección seteando el ID
export const setNewDoc = async (coleccion, data, uid) => {
  const docRef = await setDoc(doc(db, coleccion, uid), data, {
    merge: true,
  });
  console.log("Document written with name ", docRef);
};

//Traer información
export const getData = async (coleccion) => {
  const data = await getDocs(collection(db, coleccion));
  return data.docs?.map((doc) => ({ ...doc.data(), id: doc.id }));
};

//Traer un solo doc
export const getDocumento = async (coleccion, id) => {
  const docRef = doc(db, coleccion, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // console.log("Document data:", docSnap.data());
    return docSnap.data();
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
};

//Actualizar información
export const updateData = async (coleccion, id, data) => {
  const dataDoc = doc(db, coleccion, id);
  await updateDoc(dataDoc, data);
};

// Actualizar cantidad de tokens
export const updateTokenQuant = async (coleccion, id, value) => {
  const dataDoc = doc(db, coleccion, id);
  await updateDoc(dataDoc, { tokenQuantity: increment(value) });
};

// // Actualizar experiencia
// export const updateExperienceLevel = async (id, value) => {
//   const dataDoc = doc(db, "user-stats", id);
//   await updateDoc(dataDoc, { experience: increment(value) });
// };

//Borrar Información
export const deleteData = async (coleccion, id) => {
  const userDoc = doc(db, coleccion, id);
  await deleteDoc(userDoc);
  console.log(`Documento de ${coleccion} eliminado`);
};

// Traer el documento que coincida con el id del usuario logueado
export const getId = async (coleccion, id) => {
  const data = await getData(coleccion);
  const avatar = data.filter((obj) => obj.userId === id);
  console.log(avatar);
  return avatar;
};

const getRivalsBet = async (rivals) => {
  console.log("rivals en funcion", rivals);
  const rivalsBet = [];

  rivals.forEach((rival) => {
    if (rival.wannaBet) {
      getDailyMatches(rival.uid).then((dailyMatchesRival) => {
        console.log("respuesta de .then", dailyMatchesRival);

        if (dailyMatchesRival.length >= 5) {
          rivalsBet.push(dailyMatchesRival);
          console.log("rivals bet new dentro del for each", rivalsBet);
        }
      });
    }
  });
  return rivalsBet;
};

// Matchmaking: buscar rival con mismo rango de nivel
export const getRival = async (coleccion, id) => {
  // Redondear de 10 en 10 (para arriba)
  function roundDecimalUp(value) {
    return Math.ceil(value / 10) * 10;
  }
  // Redondear de 10 en 10 (para abajo)
  function roundDecimalDown(value) {
    return Math.floor(value / 10) * 10;
  }

  // Traer data del usuario actual
  const user = await getDocumento("users", id);

  // Filtrar por niveles
  const usersRef = collection(db, coleccion);
  const levelQuery = query(
    usersRef,
    where("level", "<=", roundDecimalUp(user.level)),
    where("level", ">=", roundDecimalDown(user.level))
  );
  const levelQuerySnap = await getDocs(levelQuery);

  // Agregar cada rival a un arreglo
  const rivals = [];

  levelQuerySnap.forEach((doc) => {
    if (doc.id != id) {
      // const docData = doc.data()
      // ({ ...obj, key: 'value' })
      rivals.push({ ...doc.data(), uid: doc.id });
    }
  });

  //// Matchmaking de peleas con apuestas
  // Daily Matches propias
  const dailyMatches = await getDailyMatches(id);
  console.log("partidas propias jugadas hoy:", dailyMatches);

  // Daily Matches rivales
  // const rivalsBet = await getRivalsBet(rivals);

  // console.log("LLAMANDO FUNCION", getRivalsBet(rivals));

  // console.log("Rivals bet new (+5 peleas y wannaBet):", rivalsBet);

  console.warn("-------------------------------");
  // Si el usuario lleva mas de 5 peleas
  if (dailyMatches.length >= 5) {
    // console.log("rivalbet[0]", rivalsBet[0]);

    console.log("partidas jugadas hoy:", dailyMatches);
    // Y quiere apostar para continuar jugando
    if (user.wannaBet) {
      console.log("queres apostar, te vamos a buscar un rival");
      // Buscar un rival random que quiera apostar
      const rivalsBet = rivals.filter((rival) => rival.wannaBet === true);
      console.log("rivalsBet", rivalsBet);
      const rivalBet =
        rivalsBet[Math.floor(Math.random() * rivals.length)] ||
        rivalsBet[0];
      console.log("rivalBet random", rivalBet);
      return rivalBet;
    } else if (!user.wannaBet) {
      alert(
        "Como ya jugaste 5 peleas y no queres apostar, no podras jugar mas por hoy"
      );
    }
  }

  // Elegir rival al azar
  const rival = rivals[Math.floor(Math.random() * rivals.length)];

  return rival;
};

// Determinar cantidad de batallas diarias
export const getDailyMatches = async (uid) => {
  // Obtener el dia actual en formato dia/mes/año
  const now = new Date();
  const fullfecha = `${now.getDate()}/${
    now.getMonth() + 1
  }/${now.getFullYear()}`;

  // Filtrar por partidas de cada dia del usuario loggeado
  const matchesRef = collection(db, "matches");
  const matchesQuery = query(
    matchesRef,
    where("date", "==", fullfecha),
    where("user1", "==", uid)
  );
  const matchesQuerySnap = await getDocs(matchesQuery);

  // Agregar cada match a un arreglo
  const matches = [];
  matchesQuerySnap.forEach((doc) => {
    matches.push(doc.data());
    // matches.push({ ...doc.data(), id: doc.id });
  });

  return matches;
};

// Buscar NFT-Items equipados de usuario
export const getEqNFTitems = async (uid) => {
  // Traer data del usuario actual
  // const user = await getDocumento("users", uid);

  // Filtrar por NFTs
  const nftRef = collection(db, "nft");
  const nftQuery = query(
    nftRef,
    where("equipped", "==", true),
    where("user", "==", uid)
  );
  const nftQuerySnap = await getDocs(nftQuery);

  // Agregar cada nft a un arreglo
  const nfts = [];
  nftQuerySnap.forEach((doc) => {
    // nfts.push(doc.data());
    nfts.push({ ...doc.data(), id: doc.id });
  });

  return nfts;
};

//Buscar todos los items de un usuario
export const getNFTItems = async (uid) => {
  const nftRef = collection(db, "nft");
  const nftQuery = query(nftRef, where("user", "==", uid));
  const nftQuerySnap = await getDocs(nftQuery);

  // Agregar cada nft a un arreglo
  const nfts = [];
  nftQuerySnap.forEach((doc) => {
    // nfts.push(doc.data());
    nfts.push({ ...doc.data(), id: doc.id });
  });

  return nfts;
};

// Equipar NFT Item
export const equipNFTitem = async (nftId) => {
  // Traer el item actual por id
  const dataDoc = doc(db, "nft", nftId);
  const docSnap = await getDoc(dataDoc);

  // Estado actual del item (equipado o no)
  const itemStatus = docSnap.data().equipped;
  // Actualizar el estado del item toggleandolo
  await updateDoc(dataDoc, { equipped: !itemStatus });
};

// Obtener el avatar del usuario
export const getAvatar = async (userId) => {
  const usersRef = collection(db, "userAvatar");
  const avatarQuery = query(usersRef, where("userId", "==", userId));
  const avatarQuerySnap = await getDocs(avatarQuery).then((res) => res);

  // Agregar cada avatar a un arreglo
  const avatar = [];

  avatarQuerySnap.forEach((doc) => {
    if (doc.id != userId) {
      // const docData = doc.data()
      // ({ ...obj, key: 'value' })
      avatar.push({ ...doc.data(), uid: doc.id });
    }
  });
  return avatar[0];
};

// TODO: 27/9 Elegir usuarios dipuestos a apostar (wannaBet = true)

/* // Matchmaking: buscar usuarios con wannaPlay: true y mismo rango de nivel
export const getRivalWannaPlay = async (coleccion, id) => {
  // Traer data del usuario actual
  const user = await getDocumento("users", id);

  // Elegir usuarios dispuestos a jugar
  const usersRef = collection(db, coleccion);
  const wannaPlayQuery = query(usersRef, where("wannaPlay", "==", true));
  const wannaPlayQuerySnap = await getDocs(wannaPlayQuery);
  // wannaPlayQuerySnap.forEach((doc) => {
  //   console.log(doc.id, " => ", doc.data());
  // });

  // Query combinada wannaPlay + filtro Level
  const wannaPlayLevelQuery = query(
    usersRef,
    where("wannaPlay", "==", true),
    where("level", "<=", user.level * 2)
  );

  // Filtrar por niveles
  const wannaPlayLevelQuerySnap = await getDocs(wannaPlayLevelQuery);
  wannaPlayLevelQuerySnap.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });

  // Elegir uno al azar

  // console.log(avatar)
  // return rivals;
}; */
