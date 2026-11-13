import { useEffect, useRef, useState } from 'react';
import { whatsappText } from '../lib/format';
import { WhatsAppIcon } from './WhatsAppIcon';

const HUBS = ['Karatina University', 'Dedan Kimathi University', 'Kirinyaga University'];
const PAYMENTS = ['M-Pesa', 'Visa', 'Mastercard', 'Bank Transfer'];

/** Help & Support topics. Placeholder copy — confirm the details with Lucy before launch. */
const HELP: { title: string; body: string[] }[] = [
  {
    title: 'FAQ',
    body: [
      'How do I order? Tap "Buy on WhatsApp" on any product. Your order details are pre-filled — just send the message and Lucy confirms.',
      'Can I order items that are restocking? Yes — tap "Pre-order" and you\'ll be first in line when stock lands.',
      'Do you deliver to my campus? See Campus Hubs below, or message us on WhatsApp to ask about your area.',
    ],
  },
  {
    title: 'M-Pesa Payment Guide',
    body: [
      'Pay on delivery: inspect your items, then pay via M-Pesa to the number Lucy shares on WhatsApp.',
      'Keep your M-Pesa confirmation SMS until you\'re happy with your order.',
      'Card and bank transfer payments are also accepted — ask on WhatsApp for details.',
    ],
  },
  {
    title: 'Delivery Timelines',
    body: [
      'Karatina University, Dedan Kimathi University (Nyeri) & Kirinyaga University (Kutus): same or next day.',
      'Other areas: message us on WhatsApp to check if we can deliver to you.',
      'Free delivery to all three campuses for orders over KES 2,500.',
    ],
  },
  {
    title: 'Return Policy',
    body: [
      'Check your items on delivery before paying.',
      'Faulty or wrong items can be returned within 7 days in original packaging — message us on WhatsApp to arrange a swap or refund.',
    ],
  },
];

function HelpDialog({ topic, onClose }: { topic: (typeof HELP)[number] | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (topic && !d.open) d.showModal();
    if (!topic && d.open) d.close();
  }, [topic]);
  return (
    <dialog
      ref={ref}
      className="help-dialog"
      aria-labelledby="help-dialog-title"
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {topic && (
        <div className="help-dialog__inner">
          <div className="help-dialog__head">
            <h2 id="help-dialog-title">{topic.title}</h2>
            <button className="help-dialog__close" aria-label="Close" onClick={onClose}>×</button>
          </div>
          {topic.body.map((line) => <p key={line}>{line}</p>)}
          <a className="pill pill--forest pill--wa" href={whatsappText(`Hi Lucy! I have a question about: ${topic.title}`)} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon size={22} />
            Ask on WhatsApp
          </a>
        </div>
      )}
    </dialog>
  );
}

export function Newsletter() {
  const [contact, setContact] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  return (
    <div className="newsletter-wrap">
      <form
        className="newsletter"
        onSubmit={(e) => {
          e.preventDefault();
          if (contact.trim()) setSubscribed(true);
        }}
      >
        <h2>STAY UPTO DATE ABOUT OUR LATEST CAMPUS DEALS</h2>
        <div className="newsletter__form">
          <input
            value={contact}
            onChange={(e) => {
              setContact(e.target.value);
              setSubscribed(false);
            }}
            placeholder="Email or WhatsApp number"
            aria-label="Email or WhatsApp number"
          />
          <button type="submit">{subscribed ? "You're on the list" : 'Get Flash Drop Alerts'}</button>
        </div>
      </form>
    </div>
  );
}

export function Footer() {
  const [topic, setTopic] = useState<(typeof HELP)[number] | null>(null);
  return (
    <footer className="footer">
      <HelpDialog topic={topic} onClose={() => setTopic(null)} />
      <div className="footer__grid">
        <div className="footer__about">
          <div className="footer__brand">Lucy Household Items</div>
          <p>Drip for your crib, without breaking HELB.</p>
        </div>
        <div className="footer__col">
          <div className="footer__head">CAMPUS HUBS</div>
          {HUBS.map((h) => (
            <a
              key={h}
              className="footer__wa"
              href={whatsappText(`Hi Lucy! Do you deliver to ${h}?`)}
              target="_blank"
              rel="noopener noreferrer"
              title={`Ask on WhatsApp about delivery to ${h}`}
            >
              <WhatsAppIcon size={18} />
              {h}
            </a>
          ))}
        </div>
        <div className="footer__col">
          <div className="footer__head">HELP &amp; SUPPORT</div>
          {HELP.map((h) => (
            <button key={h.title} type="button" className="footer__link" aria-haspopup="dialog" onClick={() => setTopic(h)}>
              {h.title}
            </button>
          ))}
        </div>
        <div className="footer__col footer__pay">
          <div className="footer__head">ACCEPTED PAYMENTS</div>
          <div className="pay-wrap">
            {PAYMENTS.map((p) => <span key={p} className="pay-badge">{p}</span>)}
          </div>
        </div>
      </div>
      <div className="footer__legal">Lucy Household Items © {new Date().getFullYear()}</div>
    </footer>
  );
}
