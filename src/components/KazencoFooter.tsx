export function KazencoFooter() {
  return (
    <footer className="kazenco-v5-footer">
      <div className="kazenco-v5-footer-main">
        <div className="kazenco-v5-footer-brand">
          <img src="/images/misc/kazenco-logo.svg" alt="KAZENCO" />
          <p>
            Engineering, construction, turnkey fit-out and industrial material
            supply across Kazakhstan since 2004.
          </p>
        </div>

        <div className="kazenco-v5-footer-column">
          <h3>Company</h3>
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#clients">Clients</a>
        </div>

        <div className="kazenco-v5-footer-column">
          <h3>Capabilities</h3>
          <a href="#products">Products</a>
          <a href="#industries">Industries</a>
          <a href="#contact">Request a quote</a>
        </div>

        <div className="kazenco-v5-footer-column">
          <h3>Location</h3>
          <p>Atyrau, Kazakhstan</p>
          <p>English · Russian · Turkish · Kazakh</p>
        </div>
      </div>

      <div className="inc-footer">
        <p className="m-0">© {new Date().getFullYear()} KAZENCO. All Rights Reserved.</p>
        <a
          href="http://fibilisim.com.tr/"
          target="_blank"
          rel="noreferrer"
          className="inc-footer-credit"
        >
          <span>Developed by</span>
          <img src="/images/misc/developed-by.ico" alt="Fi Bilişim" />
        </a>
      </div>
    </footer>
  );
}
