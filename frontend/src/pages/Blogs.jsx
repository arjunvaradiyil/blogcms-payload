import { Link } from "react-router-dom";

export default function Blogs() {
  return (
    <div>
      <h1>Blogs</h1>
      <hr />
      <Link to='create/'>Create</Link>
      <ol>
        <li>
          <Link to='1/'>My First Blog</Link>
        </li>
      </ol>
    </div>
  );
}
