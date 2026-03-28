import React, { useState } from 'react';

const faqData = [
  { id: '01', question: 'What is StreamVibe?', answer: 'StreamVibe is a streaming service that allows you to watch movies and shows on demand.' },
  { id: '02', question: 'How much does StreamVibe cost?', answer: 'We offer various plans tailored to your needs, ranging from basic to premium tiers.' },
  { id: '03', question: 'What content is available on StreamVibe?', answer: 'You can access a vast library of movies, TV shows, documentaries, and exclusive originals.' },
  { id: '04', question: 'How can I watch StreamVibe?', answer: 'Watch on your smartphone, tablet, Smart TV, laptop, or gaming console.' },
  { id: '05', question: 'How do I sign up for StreamVibe?', answer: 'Simply click the "Start Free Trial" button and follow the registration steps.' },
  { id: '06', question: 'What is the StreamVibe free trial?', answer: 'New users get a 7-day free trial to explore all features before being charged.' },
  { id: '07', question: 'How do I contact StreamVibe customer support?', answer: 'You can reach us via the "Support" page or through our 24/7 live chat.' },
  { id: '08', question: 'What are the StreamVibe payment methods?', answer: 'We accept all major credit cards, PayPal, and various digital wallets.' },
];

const FAQ: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('01');

  return (
    <section className="bg-[#141414] px-6 md:px-16 py-20">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-[#999999] max-w-2xl">
            Got questions? We've got answers! Check out our FAQ section to find answers to the most common questions about StreamVibe.
          </p>
        </div>
        <button className="bg-[#E50914] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#ff0f1a] transition-colors w-fit">
          Ask a Question
        </button>
      </div>

      {/* FAQ GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12">
        {faqData.map((faq) => (
          <div key={faq.id} className="relative py-6 border-b border-[#262626]">
            {/* The thin red line indicator for the active item */}
            {openId === faq.id && (
              <div className="absolute bottom-[-1px] left-0 w-full h-[1px] bg-linear-to-r from-[#E50914] to-transparent z-10" />
            )}

            <div 
              className="flex items-start gap-5 cursor-pointer group"
              onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
            >
              {/* Number Box */}
              <div className="bg-[#1F1F1F] border border-[#262626] rounded-lg px-4 py-3 text-white font-bold text-lg min-w-[54px] text-center">
                {faq.id}
              </div>

              {/* Question & Answer */}
              <div className="flex-1">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-white text-lg md:text-xl font-medium group-hover:text-zinc-300 transition-colors">
                    {faq.question}
                  </h3>
                  <span className="text-white text-2xl">
                    {openId === faq.id ? '−' : '+'}
                  </span>
                </div>

                {/* Animated Answer */}
                <div className={`overflow-hidden transition-all duration-300 ${openId === faq.id ? 'max-h-40 mt-4' : 'max-h-0'}`}>
                  <p className="text-[#999999] leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;