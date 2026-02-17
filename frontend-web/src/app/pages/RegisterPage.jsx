import { FileX } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

export function RegisterPage() {
  return (
    <div>
      <div
        className="containerA"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center",
        }}
      >
        <div className="login" style={{ padding: 8 }}>
          <h1>Login</h1>
          <label htmlFor="">Email</label>
          <br />
          <input type="Email" className="" />
          <hr />
          <label htmlFor="">Senha</label>
          <br />
          <input type="password" className="" />
          <br />
          <br />
          <button>LOGAR</button>
          <br />
          <hr />
          <br />
        </div>
        <div className="register">
          <h1>Regsitrar</h1>
          <label htmlFor="">Email</label>
          <br />
          <input type="Email" className="" />
          <hr />
          <label htmlFor="">Username</label>
          <br />
          <input type="username" />
          <hr />
          <label htmlFor="">Telefone</label>
          <br />
          <input type="number" />
          <hr />
          <label htmlFor="">Senha</label>
          <br />
          <input type="password" className="" />
          <hr />
          <label htmlFor="">Confirmar Senha</label>
          <br />
          <input type="password" className="" />
          <br />
          <button>Registrar</button>
          <br />
          <hr />
          <br />
        </div>
      </div>
    </div>
  );
}
