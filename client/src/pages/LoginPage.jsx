import { useContext, useState } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

const LoginPage = () => {
  const [currentState, setCurrentState] = useState("sign up");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const {login} = useContext(AuthContext);
  

  const onsubmithandler = (event)=>{
    event.preventDefault();

    if(currentState ==='sign up' && !isDataSubmitted){
        setIsDataSubmitted(true);
        return;
    }

    login(currentState==="sign up"?'signup':'login',{fullname,email,password,bio})
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center
    justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl"
    >
      {/* ---------------left -------------- */}
      <img src={assets.logo_big} alt="" className="w-[min(30vw,250px)]" />

      {/* --------------right ---------- */}
      <form
      onSubmit={onsubmithandler}
      className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg">
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currentState}
          {isDataSubmitted && <img onClick={()=>setIsDataSubmitted(false)} src={assets.arrow_icon} className="cursor-pointer w-5" alt="" />}
          
        </h2>
        {currentState === "sign up" && !isDataSubmitted && (
          <input
            onChange={(e) => setFullname(e.target.value)}
            value={fullname}
            type="text"
            name=""
            className="p-2 border border-gray-500  rounded-md focus:outline-none"
            placeholder="Full Name"
            required
          />
        )}

        {!isDataSubmitted && (
          <>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              name=""
              placeholder="Email Address"
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              id=""
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              name=""
              placeholder="Password Here"
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              id=""
            />
          </>
        )}

        {currentState === "sign up" && isDataSubmitted && (
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="please a short bio..."
            required
          ></textarea>
        )}

        <button
          type="submit"
          className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer"
        >
          {currentState === "sign up" ? "Create Account" : "Login now"}
        </button>

        <div>
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy</p>
        </div>

        <div className="flex flex-col gap-2">
          {currentState === "sign up" ? (
            <p className="text-sm text-gray-600">
              Already have an account{" "}
              <span
                onClick={() => {setCurrentState("Login"); setIsDataSubmitted(false)}}
                className="font-medium text-violet-500 cursor-pointer"
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Create an account{" "}
              <span
               onClick={() => {setCurrentState("sign up")}}
              className="font-medium text-violet-500 cursor-pointer">
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
