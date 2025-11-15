import './Footer.css';

export default function Footer() {
  return (
    <footer className="gs-footer">
      <div className="gs-container gs-footer-inner">
        <p>© {new Date().getFullYear()} Gyan Setu Coaching Center</p>
        <p>Bridging Concepts, Building Futures</p>
      </div>
    </footer>
  );
}
