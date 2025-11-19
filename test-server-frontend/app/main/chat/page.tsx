"use client";
import React from "react";

type Props = {};

function ChatPage({}: Props) {
  async function handleClick() {
  }
  return (
    <>
      <section className="min-h-screen">
        <div></div>
        <div className="flex justify-center items-center  h-full relative">
          <label className="input input-bordered w-full max-w-xs rounded-full m-4 input-info">
            <input type="text" className="grow" placeholder="Message" />
          </label>
          <div>
            <button
              onClick={handleClick}
              className="btn btn-ghost btn-outline rounded-full m-4"
            >
              Send
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default ChatPage;
