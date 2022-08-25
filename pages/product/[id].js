import { useRouter } from "next/router";
import baseUrl from "../../helpers/baseUrl";
import { useRef, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { parseCookies } from "nookies";

const Product = ({ product }) => {
  const [quantity, setQuantity] = useState();
  const router = useRouter();
  const modalRef = useRef(null);
  const cookie = parseCookies();
  // const user = cookie.user ? JSON.stringify(cookie.user) : "";
  // const parsed = cookie.user ? JSON.parse(user) : "";
  const user = cookie.user ? JSON.parse(cookie.user) : "";
  // const user = true;
  // console.log(cookie.user, "abc");

  useEffect(() => {
    M.Modal.init(modalRef.current);
  }, []);
  if (router.isFallback) {
    return <h3>Loading...</h3>;
  }
  const getModal = () => {
    return (
      <div id="modal1" className="modal" ref={modalRef}>
        <div className="modal-content">
          <h4>{product.name}</h4>
          <p>Are you sure You want to delete this. </p>
        </div>
        <div className="modal-footer">
          <button className="btn waves-effect waves-light #d81b60 pink darken-1">
            CANCEL
          </button>
          <button
            className="btn waves-effect waves-light #004d40 teal darken-4"
            onClick={() => deleteProduct()}
          >
            YES
          </button>
        </div>
      </div>
    );
  };
  const deleteProduct = async () => {
    const res = await fetch(`${baseUrl}/api/product/${product._id} `, {
      method: "DELETE",
    });
    const res2 = await res.json();
    router.push("/");
  };
  const AddToCart = async () => {
    const res = await fetch(`${baseUrl}/api/cart`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: cookie.token,
      },
      body: JSON.stringify({
        quantity,
        productId: product._id,
      }),
    });
    const res2 = await res.json();
    // if (res2.err) {
    //   M.toast({ html: res2.message, classes: "red" });
    //   cookie.remove("user");
    //   cookie.remove("token");
    //   router.push("/login");
    // }
    //console.log(res2);
    M.toast({ html: res2.message, classes: "green" });
  };

  return (
    <div className="container center-align">
      <h3>{product.name}</h3>
      <img src={product.mediaUrl} />
      <h5>{product.price}</h5>
      <input
        type="number"
        style={{ width: "400px", margin: "10px" }}
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        placeholder="Quantity"
      />
      {user ? (
        <button
          className="btn waves-effect waves-light #1565c0 blue darken-3"
          onClick={() => AddToCart()}
        >
          Add
          <i className="material-icons right">add</i>
        </button>
      ) : (
        <button
          className="btn waves-effect waves-light #1565c0 blue darken-3"
          onClick={() => router.push("/login")}
        >
          Login To Add
          <i className="material-icons right">add</i>
        </button>
      )}

      {/* <button className="btn waves-effect waves-light #f44336 red">
        Add
        <i className="material-icons right">add</i>
      </button> */}

      <p>{product.description}</p>
      <button
        data-target="modal1"
        className="btn  modal-trigger waves-effect waves-light #004d40 teal darken-4"
      >
        Delete
        <i className="material-icons left">delete</i>
      </button>
      {getModal()}
    </div>
  );
};
// export async function getServerSideProps({ params: { id } }) {
//   const res = await fetch(`http://localhost:3000/api/product/${id}`);
//   const data = await res.json();
//   return {
//     props: { product: data },
//   };
// }
export async function getStaticProps({ params: { id } }) {
  const res = await fetch(`${baseUrl}/api/product/${id}`);
  const data = await res.json();
  return {
    props: { product: data },
  };
}
export async function getStaticPaths() {
  return {
    paths: [{ params: { id: "62dbce48a30475a51f5bc4d7" } }],
    fallback: true,
  };
}
export default Product;
