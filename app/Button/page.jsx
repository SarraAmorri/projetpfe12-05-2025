// app/Button/page.jsx

export default function Button({ children, onClick, className }) {
    return (
      <button
        onClick={onClick}
        className={`${className} px-4 py-2 bg-blue-500 text-white rounded`}
      >
        {children}
      </button>
    );
  }
  