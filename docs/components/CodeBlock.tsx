import React from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { useTheme } from './ThemeProvider';

interface CodeBlockProps {
  code: string;
  language: string;
  title?: string;
  showLineNumbers?: boolean;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language,
  title,
  showLineNumbers = false
}) => {
  const { theme } = useTheme();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block-wrapper">
      {title && (
        <div className="code-block-title">
          <span>{title}</span>
          <button onClick={handleCopy} className="copy-button">
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
      )}
      <Highlight
        theme={theme === 'dark' ? themes.nightOwl : themes.github}
        code={code.trim()}
        language={language}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={`${className} code-block-pre`} style={style}>
            {!title && (
              <button onClick={handleCopy} className="copy-button-inline">
                {copied ? '✓' : '📋'}
              </button>
            )}
            <code>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {showLineNumbers && <span className="line-number">{i + 1}</span>}
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </code>
          </pre>
        )}
      </Highlight>
    </div>
  );
};

export default CodeBlock;
