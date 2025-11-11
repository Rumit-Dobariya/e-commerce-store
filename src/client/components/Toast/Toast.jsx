import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimes,
} from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

const Toast = ({ id, message, type, action, actionCallback, onClose }) => {
  const typeStyles = useMemo(() => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-600",
          icon: <FaCheckCircle className="w-6 h-6 text-white" />,
        };
      case "warning":
        return {
          bg: "bg-yellow-600",
          icon: <FaExclamationTriangle className="w-6 h-6 text-white" />,
        };
      default:
        return {
          bg: "bg-gray-700",
          icon: <FaTimes className="w-6 h-6 text-white" />,
        };
    }
  }, [type]);

  const handleActionClick = (e) => {
    // e.stopPropogation()
    if (actionCallback) {
      actionCallback();
    }
    onClose(id);
  };

  return (
    <div
      className={`relative flex items-center p-4 pr-6 mb-3 rounded-lg shadow-xl text-white transform transition-all duration-300 ease-out translate-x-0 opacity-100 ${typeStyles.bg}`}
      style={{ minWidth: "300px" }}
    >
      <div className="flex-shrink-0 mr-3">{typeStyles.icon}</div>
      <div className="flex-grow">
        <p className="font-medium text-sm">{message}</p>
        {action && (
          <button
            onClick={(e) => handleActionClick(e)}
            className="mt-1 text-xs font-bold underline hover:text-opacity-80 transition"
          >
            {action}
          </button>
        )}
      </div>
      <button
        onClick={() => onClose(id)}
        className="absolute top-1 right-1 p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition"
        aria-label="Close notification"
      >
        <RxCross2 className="w-4 h-4 text-white" />
      </button>
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(
    ({ message, type = "info", duration = 3000, action, actionCallback }) => {
      const id = Date.now();
      const newToast = { id, message, type, duration, action, actionCallback };
      setToasts((prevToasts) => [...prevToasts, newToast]);
      return id;
    },
    [],
  );

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        removeToast(toasts[0].id);
      }, toasts[0].duration);

      return () => clearTimeout(timer);
    }
  }, [toasts, removeToast]);

  const contextValue = useMemo(
    () => ({ showToast, removeToast }),
    [showToast, removeToast],
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            action={toast.action}
            actionCallback={toast.actionCallback}
            onClose={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
