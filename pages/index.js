import Link from "next/link";
import product from "./product";
import baseUrl from "../helpers/baseUrl";
const Home = ({ products }) => {
  const productList = products.map((product) => {
    return (
      <div className="card" key={product.id}>
        <div className="card-image">
          <img src={product.mediaUrl} />
          <span className="card-title">{product.name}</span>
        </div>
        <div className="card-content">
          <p>RS{product.price}</p>
        </div>
        <div className="card-action">
          <Link href={"/product/[id]"} as={`/product/${product._id} `}>
            <a>View Product</a>
          </Link>
        </div>
      </div>
    );
  });
  console.log(products);
  return <div className="rootcard">{productList}</div>;
};
export async function getStaticProps() {
  const res = await fetch(`${baseUrl}/api/products`);
  const data = await res.json();
  return {
    props: {
      products: data,
    },
  };
}

export default Home;




