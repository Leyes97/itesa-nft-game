import React from "react";
import {
  addNewDoc,
  deleteData,
  getData,
  getDocumento,
  updateData,
} from "../fetchData/controllers";

const TestPage = () => {
  //Ejemplo de data
  const userData = {
    email: "victor@gmail.com",
    isAdmin: true,
    lastname: "Programador",
    name: "Victor",
    walletAddress: "asdsa68923sadsgsf",
    isActive: true,
    level: 3,
    experience: 20,
    wonBattles: 2,
    lostBattles: 0,
    totalBattles: 2,
  };
  const updatedData = {
    lastName: "Mechi actualizado",
    name: "MEchi Actualizado",
  };

  const handlerGet = () => {
    getData("users").then((data) => {
      console.log(data);
    });
  };

  return (
    <div>
      <button
        onClick={() => {
          addNewDoc("users", userData);
        }}>
        Ejecutar addNewDoc
      </button>
      <button onClick={handlerGet}> Ejecutar getDocs</button>
      <button
        onClick={() => {
          updateData("users", "kbQYfPHLHrkZ6SMojLvn", updatedData);
        }}>
        Actualizar información
      </button>

      <button
        onClick={() => {
          deleteData("users", "kbQYfPHLHrkZ6SMojLvn");
        }}>
        Borrar documento
      </button>
      <button
        onClick={() => {
          getDocumento("users", "8reEa96yYeNOBAp7pfYc");
        }}>
        Traer un documento
      </button>
    </div>
  );
};

export default TestPage;
