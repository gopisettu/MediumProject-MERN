import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';

const Post = ({ posts }) => {
  return (
    <article className="post">
      <Link to={`/post/${posts._id}`}> {/* Assuming _id is the unique identifier */}
        <h2>{posts.title}</h2>
        <p className="postDate">{posts.datetime}</p>
      </Link>
      <p className='postBody'>
        {posts.body.length <= 100 // Adjust the length as needed
          ? posts.body
          : `${posts.body.slice(0, 100)}...`}
      </p>
    </article>
  );
}

export default Post;
