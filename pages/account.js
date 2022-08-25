import { parseCookies } from "nookies";
import { useEffect } from "react";
import Router from "next/router";
const Account = () => {
  useEffect(() => {
    const { token } = parseCookies();
    console.log(token);

    if (!token) {
      console.log("inside if");

      // console.log("res", res); //string concatenate
      Router.push("/login");
    }
  }, []);
  return <h1>account page</h1>;
};

// export async function getServerSideProps(ctx) {
//   try {
//     return {
//       props: {},
//     };
//   } catch (err) {
//     console.log(err);
//     return {
//       props: {},
//     };
//   }
// }
export default Account;
