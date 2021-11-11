import React from "react";

export default function Detail(props) {
  const { personinfo, label, input, labelinfo, username, value } = props;
  return (
    <div className={personinfo}>
      <label className={label}>{labelinfo}</label>
      {username ? (
        <input
          type="text"
          className={input}
          name="username"
          defaultValue={username}
          disabled
        />
      ) : (
        <input
          type="text"
          className={input}
          name={labelinfo}
          defaultValue={value}
        />
      )}
    </div>
  );
}
