interface FooterProps {
  name?: string;
}

const Footer = ({ name = 'Asia Chatmon' }: FooterProps) => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-8 border-t border-border text-center py-4">
      <div className="flex flex-col items-center gap-2">
        <div className="flex gap-4 justify-center mb-1">
          <a
            href="https://github.com/asiachat"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub"
            aria-label="Visit Asia Chatmon's GitHub profile (opens in new tab)"
            className="hover:opacity-80 focus-ring"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.36 6.84 9.72.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.17-1.1-1.48-1.1-1.48-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.18 9.18 0 0 1 2.5-.34c.85 0 1.71.11 2.5.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.64 1.03 2.76 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12.26C22 6.58 17.52 2 12 2z" /></svg>
          </a>
          <a
            href="https://www.linkedin.com/in/asiachatmon"
            target="_blank"
            rel="noopener noreferrer"
            title="LinkedIn"
            aria-label="Visit Asia Chatmon's LinkedIn profile (opens in new tab)"
            className="hover:opacity-80 focus-ring"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><rect x="2" y="2" width="20" height="20" rx="2" ry="2" /><line x1="8" y1="11" x2="8" y2="16" /><line x1="8" y1="8" x2="8" y2="8" /><line x1="12" y1="16" x2="12" y2="11" /><path d="M16 16v-3a2 2 0 0 0-4 0" /></svg>
          </a>
          <a
            href="mailto:asiachatmon56@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            title="Gmail"
            aria-label="Email Asia Chatmon (opens mail client)"
            className="hover:opacity-80 focus-ring"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="4" width="20" height="16" rx="2" fill="#fff" stroke="#e0e0e0" strokeWidth="1.5" />
              <path d="M2 4l10 9 10-9" stroke="#ea4335" strokeWidth="2" fill="none" />
              <path d="M2 20V4l10 9 10-9v16" stroke="#34a853" strokeWidth="2" fill="none" />
              <path d="M2 20h20" stroke="#4285f4" strokeWidth="2" fill="none" />
              <path d="M2 4h20" stroke="#fbbc05" strokeWidth="2" fill="none" />
            </svg>
          </a>
        </div>
        <div className="text-sm text-muted-foreground">
          © {year} {name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;