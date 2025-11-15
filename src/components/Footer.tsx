interface FooterProps {
  name?: string;
}

const Footer = ({ name = 'Asia Chatmon' }: FooterProps) => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-8 border-t border-border text-center py-4">
      <div className="text-sm text-muted-foreground">
        © {year} {name}. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;