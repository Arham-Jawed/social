import React from "react";

const CommentSection = ({ post }) => {
  return (
    <div className="h-full w-full flex flex-col items-start">
      <h1 className="text-[1.5rem] tracking-tight underline">
        Comments {post.comments.length}
      </h1>
      {post.comments.length === 0 && (
        <h1 className="text-[0.8rem] tracking-tighter text-gray-500">
          No comments yet
        </h1>
      )}
      <div className="w-full min-h-[3rem] flex flex-col gap-3 mt-4">
        {post.comments.map((comment) => (
          <div
            key={comment.text}
            className="h-[3rem] w-full bg-black border-[1px] border-zinc-800 px-4 flex items-center rounded-xl"
          >
            <h1 className="text-[0.9rem] tracking-tight">{comment.text}</h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
