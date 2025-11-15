import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LiveDemoProps {
  title: string;
  description: string;
}

const LiveDemo: React.FC<LiveDemoProps> = ({ title, description }) => {
  const [status, setStatus] = useState<'idle' | 'downloading' | 'completed'>('idle');
  const [progress, setProgress] = useState(0);

  const startDemo = () => {
    setStatus('downloading');
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus('completed');
          setTimeout(() => {
            setStatus('idle');
            setProgress(0);
          }, 2000);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  return (
    <div className="live-demo">
      <div className="live-demo-header">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      <div className="live-demo-content">
        <div className="demo-visualization">
          <div className="demo-file-icon">📦</div>
          <AnimatePresence>
            {status === 'downloading' && (
              <motion.div
                className="download-animation"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <div className="download-particles">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="particle"
                      animate={{
                        y: [0, -50],
                        opacity: [0, 1, 0]
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {status === 'completed' && (
            <motion.div
              className="success-check"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              ✓
            </motion.div>
          )}
        </div>

        <div className="demo-controls">
          <div className="progress-container">
            <div className="progress-bar">
              <motion.div
                className="progress-fill"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <span className="progress-text">{progress}%</span>
          </div>

          <div className="status-badges">
            <span className={`status-badge ${status}`}>
              {status === 'idle' && '⏸ Idle'}
              {status === 'downloading' && '⬇ Downloading...'}
              {status === 'completed' && '✓ Completed'}
            </span>
          </div>

          <button
            onClick={startDemo}
            disabled={status === 'downloading'}
            className="demo-button"
          >
            {status === 'idle' ? 'Start Demo' : status === 'downloading' ? 'Downloading...' : 'Done!'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveDemo;
