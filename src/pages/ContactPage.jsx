import '../styles/contact.css';

export default function ContactPage() {
  return (
    <section className="contact-page">
      <div className="gs-container contact-inner">
        <div className="contact-info">
          <h1>Contact <span className="gs-accent-text">Us</span></h1>
          <p>
            Have a question about our Class 9 or 10 Maths videos?
            Send us a message and we’ll get back to you.
          </p>

          <div className="contact-details">
            <p><strong>Email:</strong> rohitmanna55@gmail.com</p>
            <p><strong>Phone:</strong> +91-9993130364</p>
          </div>
        </div>

        <form className="contact-form">
          <div className="form-row">
            <label>Name</label>
            <input type="text" placeholder="Your name" />
          </div>
          <div className="form-row">
            <label>Email</label>
            <input type="email" placeholder="your@email.com" />
          </div>
          <div className="form-row">
            <label>Message</label>
            <textarea rows="4" placeholder="Your message"></textarea>
          </div>
          <button type="submit" className="gs-btn">Send Message</button>
        </form>
      </div>
    </section>
  );
}
