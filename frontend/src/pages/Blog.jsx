import { Link, useParams } from "react-router-dom";

export default function Blog() {
  const { id } = useParams();
  return (
    <div>
      <h1>Blog Title {id}</h1>
      <div>
        <Link to='/'>Back</Link>
        <Link to='update/' style={{ marginLeft: "10px" }}>
          Edit
        </Link>
        <button style={{ marginLeft: "10px" }}>Delete</button>
      </div>
      <hr />
      <p>Blog Content {id}</p>
    </div>
  );
}
