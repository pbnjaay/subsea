import React from 'react';

const Footer = () => {
  return (
    <footer className="container py-6 md:px-8 mt-10 md:mt-0 supports-backdrop-blur:bg-background/60 w-full border-t bg-background/95 backdrop-blur text-sm font-thin text-muted-foreground">
      <p>
        <span className="font-semibold"> &copy;Orange2023</span> Built By{' '}
        <a href="#" className="underline">
          Digidex
        </a>
      </p>
    </footer>
  );
};

export default Footer;
