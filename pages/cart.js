import baseUrl from "../helpers/baseUrl";
import { parseCookies } from "nookies";
import cookie from "js-cookie";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";

import StripeCheckout from "react-stripe-checkout";
const Cart = ({ error, products }) => {
  const { token } = parseCookies();
  const router = useRouter();
  const [cProducts, setCartProduct] = useState(products);
  let price = 0;
  if (!token) {
    return (
      <div className="center-align">
        <h3>please log in to view your cart</h3>
        <Link href="/login">
          <a>
            <button className="btn #1565c0 blue darken-3 ">Login</button>
          </a>
        </Link>
      </div>
    );
  }
  if (error) {
    M.toast({ html: error, classes: "red" });
    cookie.remove("user");
    cookie.remove("token");
    router.push("/login");
  }
  const handleRemove = async (pid) => {
    const res = await fetch(`${baseUrl}/api/cart`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        productId: pid,
      }),
    });
    const res2 = await res.json();

    setCartProduct(res2);
  };
  const CartItems = () => {
    return (
      <>
        {cProducts.map((item) => {
          // price = price + item.quantity * item.product.price;
          price = price + item.quantity * item.product.price;
          return (
            <div style={{ display: "flex", margin: "20px" }}>
              {/* key={item._id}
            > */}
              <img src={item.product.mediaUrl} style={{ width: "30%" }} />
              <div style={{ marginLeft: "20px" }}>
                <h6>{item.product.name}</h6>
                <h6>
                  {item.quantity} x₹{item.product.price}
                </h6>
                <button
                  className="btn red"
                  onClick={() => {
                    handleRemove(item.product._id);
                  }}
                >
                  remove
                </button>
              </div>
            </div>
          );
        })}
      </>
    );
  };
  const handleCheckout = async (paymentInfo) => {
    console.log(paymentInfo);
    const res = await fetch(`${baseUrl}/api/payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        paymentInfo,
      }),
    });
    const res2 = await res.json();
    M.toast({ html: res2.mesage, classes: "green " });
    router.push("/");
  };
  //stripe create unique id for customer
  const TotalPrice = () => {
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {/* <h5>Total ₹{price}</h5> */}
        <h5>total ₹ {price}</h5>

        <StripeCheckout
          name="Amazona"
          amount={price * 100}
          image={products[0].product.mediaUrl}
          currency="INR"
          shippingAddress={true}
          billingAddress={true}
          zipCode={true}
          stripeKey="pk_test_51LTTyYSEkTg4axxvRgCpGjNkUYlp1gwlQAd9bJVbKri2LEeDMFvfQRvolxMsouqUV4wXDV8NrB50HESe1cOGjI1l006sjjJRol"
          token={(paymentInfo) => handleCheckout(paymentInfo)}
        >
          <button className="btn">Buy Now</button>
        </StripeCheckout>
      </div>
    );
  };
  return (
    <div className="">
      <CartItems />
      <TotalPrice />
    </div>
  );
};
export async function getServerSideProps(ctx) {
  const { token } = parseCookies(ctx);
  if (!token) {
    return {
      // props:{products:[]}
    };
  }
  const res = await fetch(`${baseUrl}/api/cart`, {
    headers: {
      Authorization: token, //invalid token + "123",
    },
  });

  const products = await res.json();
  if (products.error) {
    return {
      props: { error: products.error },
    };
  }
  console.log("products", products);
  return {
    props: { products },
  };
}
export default Cart;
// export async function getServerSideProps(ctx) {
//   const { token } = parseCookies(ctx);
//   if (!token) {
//     return {
//       props: { products: [] },
//     };
//   }
//   const res = await fetch(`${baseUrl}/api/cart`, {
//     headers: {
//       Authorization: token,
//     },
//   });
//   const products = await res.json();
//   if (products.error) {
//     return {
//       props: { error: products.error },
//     };
//   }
//   console.log("products", products);
//   return {
//     props: { products },
//   };
// }

// export default Cart;
