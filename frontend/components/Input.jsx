import React from 'react';

const Input = ({ inputType, title, placeholder, handleClick, hidePassword }) => (
  <div className="mt-10 w-full">
    <p className="font-poppins dark:text-white text-mart-black-1 font-semibold text-xl">
      {title}
    </p>
    {inputType === 'number' ? (
      <div className="dark:bg-mart-black-1 bg-white border dark:border-mart-black-1 border-mart-gray-2 rounded-lg w-full outline-none font-poppins dark:text-white text-mart-gray-2 text-base mt-4 px-4 py-3 flexBetween flex-row">
        <input
          type="number"
          className="flex w-full dark:bg-mart-black-1 bg-white outline-none"
          placeholder={placeholder}
          onChange={handleClick}
        />
      </div>
    ) : inputType === 'textarea' ? (
      <textarea
        rows={10}
        className="dark:bg-mart-black-1 bg-white border dark:border-mart-black-1 border-mart-gray-2 rounded-lg w-full outline-none font-poppins dark:text-white text-mart-gray-2 text-base mt-4 px-4 py-3"
        placeholder={placeholder}
        onChange={handleClick}
      />
    ) : inputType === 'password' ? (
      <input
        type={hidePassword ? 'password' : 'text'}
        className="dark:bg-mart-black-1 bg-white border dark:border-mart-black-1 border-mart-gray-2 rounded-lg w-full outline-none font-poppins dark:text-white text-mart-gray-2 text-base mt-4 px-4 py-3"
        placeholder={placeholder}
        onChange={handleClick}
      />
    ) : (
      <input
        className="dark:bg-mart-black-1 bg-white border dark:border-mart-black-1 border-mart-gray-2 rounded-lg w-full outline-none font-poppins dark:text-white text-mart-gray-2 text-base mt-4 px-4 py-3"
        placeholder={placeholder}
        onChange={handleClick}
      />
    )}
  </div>
);

export default Input;
