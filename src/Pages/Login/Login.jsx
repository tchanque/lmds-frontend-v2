import { Input } from "@nextui-org/react";
import { axiosPrivate } from "../../api/axios";
import { useState } from "react";
import { bearerToken } from "../../atom/atoms";
import { useAtom } from "jotai";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useAtom(bearerToken);

  const handleSubmit = (e) => {
    e.preventDefault();

    axiosPrivate
      .post("/users/sign_in", { user: { email: email, password: password } })
      .then((response) => {
        console.log(response);
        setToken(response.headers.authorization);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
        } else {
          console.error(error);
        }
      });
  };

  return (
    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
      <form onSubmit={handleSubmit}>
        <Input
          type="email"
          label="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          label="Mot de passe"
          placeholder=""
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="Submit">Connexion</button>
      </form>
    </div>
  );
}

export default Login;
