import React from "react";
import Header from "../Components/Header";
import SignupSigninComponents from "../Components/SignupSignin";
import img2 from "../assets/img2.jpg";

function SignUp() {
  return (
    <div>
      <Header />

      <div
  className="wrapper"
  style={{
    background: `
      linear-gradient(
        rgba(105, 104, 117, 0.85),
        rgba(28, 6, 70, 0.65)
      ),
      url(${img2})
    `,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
>
  <SignupSigninComponents />
</div>

      </div>
  );
}

export default SignUp;
