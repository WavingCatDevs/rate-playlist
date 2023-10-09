import React, { useState, useEffect } from "react";
import {
  useAuthState,
  useSignInWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import { auth } from "../../firebase/client";
import { useRouter } from "next/router";

function Login() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const router = useRouter();

  const [user] = useAuthState(auth);

  if (user) {
    router.push("/");
  }

  const [signInWithEmailAndPassword, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const onSubmitLogin = (event) => {
    event.preventDefault();
    signInWithEmailAndPassword(loginEmail, loginPassword);
  };

  return (
    <React.Fragment>
      <div className="grid grid-cols-1 sm:grid-cols-2 h-screen w-full">
        <div className="hidden sm:block">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cm9jayUyMG11c2ljfGVufDB8fDB8fHww&w=1000&q=80"
          />
        </div>

        <div className="bg-gray-800 flex flex-col justify-center">
          <form
            className="max-w-[400px] w-full mx-auto rounded-lg bg-gray-900 p-8 px-8"
            onSubmit={onSubmitLogin}
          >
            <h2 className="text-4xl dark:text-white font-bold text-center">
              LOGIN
            </h2>
            <div className="flex flex-col text-gray-400 py-2">
              <label>Email</label>
              <input
                className="rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none"
                type="email"
                onChange={(e) => setLoginEmail(e.target.value)}
                value={loginEmail}
              />
            </div>
            <div className="flex flex-col text-gray-400 py-2">
              <label>Password</label>
              <input
                className="p-2 rounded-lg bg-gray-700 mt-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none"
                type="password"
                onChange={(e) => setLoginPassword(e.target.value)}
                value={loginPassword}
              />
            </div>

            <button className="w-full my-5 py-2 bg-teal-500 shadow-lg hover:shadow-teal-500/40 text-white font-semibold rounded-lg">
              Login
            </button>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Login;
