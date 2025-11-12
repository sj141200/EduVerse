
import { useMessage } from '../context/MessageContext';
import { CheckCircle, Info, AlertTriangle, X, AlertOctagon } from 'lucide-react';
import React from 'react';

const typeToClass = {
  success: 'alert-success',
  error: 'alert-error',
  warning: 'alert-warning',
  info: 'alert-info',
};
const typeToIcon = {
  success: <CheckCircle className="w-6 h-6" />,
  error: <AlertOctagon className=" w-6 h-6" />,
  warning: <AlertTriangle className="w-6 h-6" />,
  info: <Info className="w-6 h-6" />,
};

function MessageToast() {
  const { messages, removeMessage } = useMessage();
  if (!messages || messages.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end max-w-xs w-full">
      {messages.map((msg, idx) => (
        <ToastItem key={msg.id} msg={msg} onClose={() => removeMessage(msg.id)} index={idx} />
      ))}
    </div>
  );
}

function ToastItem({ msg, onClose, index }) {
  const start = React.useRef(Date.now());

  React.useEffect(() => {
    let frame;
    const tick = () => {
      const elapsed = Date.now() - start.current;
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [msg.duration]);

  // Animation: fade in/out and slide up
  // Animate in: opacity 0→100, translateY(20px)→0
  // Animate out: handled by removal from context

  return (
    <div
      className={`alert ${typeToClass[msg.type] || 'alert-info'} shadow-lg flex items-center gap-3 relative animate-toast-in`}
      role="alert"
      style={{
        animationDelay: `${index * 60}ms`,
        minWidth: '280px',
        maxWidth: '100%',
      }}
    >
      <span className="mr-1">{typeToIcon[msg.type] || typeToIcon.info}</span>
      <span className="flex-1 wrap-break-word">{msg.message}</span>
      <button
        className="btn btn-xs btn-circle btn-ghost absolute top-2 right-2"
        aria-label="Dismiss"
        onClick={onClose}
      >
        <X className="w-4 h-4" />
      </button>
      {/* Progress bar removed for simplicity */}
    </div>
  );
}

// Animations (TailwindCSS + custom)
// Add to your global CSS if not present:
// .animate-toast-in { animation: toast-in .35s cubic-bezier(.4,0,.2,1); }
// @keyframes toast-in { from { opacity:0; transform:translateY(20px);} to { opacity:1; transform:translateY(0);} }

export default MessageToast;
