import Link from "next/link";
const product = () => {
  return (
    <div>
      <h1>product page </h1>
      <Link href="/">
        <a>go to Home</a>
      </Link>
    </div>
  );
};
export default product;
