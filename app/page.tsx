'use client';

import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type DialogueData = {
  name: string;
  company: string;
  email: string;
  industry: string;
  focus: 'CBAM' | 'Intra-EU ETS' | '';
};

type Step =
  | { id: 'name'; question: string; type: 'text'; placeholder: string }
  | { id: 'company'; question: string; type: 'text'; placeholder: string }
  | { id: 'contact'; question: string; type: 'contact' }
  | { id: 'focus'; question: string; type: 'choice'; options: Array<'CBAM' | 'Intra-EU ETS'> };

const steps: Step[] = [
  { id: 'name', question: 'What’s your name?', type: 'text', placeholder: 'Your name' },
  { id: 'company', question: 'Which company do you work for?', type: 'text', placeholder: 'Company' },
  { id: 'contact', question: 'What’s your email and your industry?', type: 'contact' },
  {
    id: 'focus',
    question: 'Are you looking for CBAM or Intra-EU ETS solutions?',
    type: 'choice',
    options: ['CBAM', 'Intra-EU ETS'],
  },
];

const etsPriceData = [
  { year: '2015', price: 7 },
  { year: '2016', price: 6 },
  { year: '2017', price: 7.5 },
  { year: '2018', price: 15 },
  { year: '2019', price: 25 },
  { year: '2020', price: 33 },
  { year: '2021', price: 53 },
  { year: '2022', price: 88 },
  { year: '2023', price: 84 },
  { year: '2024', price: 72 },
];

const timelineEvents = [
  {
    date: '17 May 2023',
    title: 'Regulation adopted',
    detail: 'CBAM Regulation (EU) 2023/956 enters into force.',
  },
  {
    date: '1 Oct 2023',
    title: 'Transitional phase',
    detail: 'Importers begin quarterly reporting on embedded greenhouse-gas emissions.',
  },
  {
    date: '1 Jan 2026',
    title: 'Definitive phase',
    detail: 'CBAM certificates matching embedded emissions must be purchased and surrendered.',
  },
  {
    date: '2026–2034',
    title: 'ETS integration',
    detail: 'Free EU ETS allocations phase out as CBAM expands to more sectors.',
  },
  {
    date: '2030+',
    title: 'Broader coverage',
    detail: 'Additional ETS sectors expected, including chemicals, glass, and downstream metals.',
  },
];

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<DialogueData>({
    name: '',
    company: '',
    email: '',
    industry: '',
    focus: '',
  });
  const [greeting, setGreeting] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const chartRef = useRef<HTMLElement | null>(null);
  const chartInView = useInView(chartRef, { once: true, margin: '-20% 0px' });
  const timelineRef = useRef<HTMLElement | null>(null);
  const timelineInView = useInView(timelineRef, { once: true, margin: '-20% 0px' });

  const totalSteps = steps.length;
  const progress = useMemo(() => ((currentStep + 1) / totalSteps) * 100, [currentStep, totalSteps]);

  const displayProgress = useMemo(() => (isComplete ? 100 : progress), [isComplete, progress]);

  const openModal = () => {
    setIsModalOpen(true);
    setCurrentStep(0);
    setFormData({
      name: '',
      company: '',
      email: '',
      industry: '',
      focus: '',
    });
    setGreeting(null);
    setIsComplete(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentStep(0);
    setGreeting(null);
    setIsComplete(false);
  };

  const activeStep = steps[currentStep];

  const canProceed = useMemo(() => {
    switch (activeStep.id) {
      case 'name':
        return formData.name.trim().length > 0;
      case 'company':
        return formData.company.trim().length > 0;
      case 'contact':
        return formData.email.trim().length > 0 && formData.industry.trim().length > 0;
      case 'focus':
        return formData.focus !== '';
      default:
        return false;
    }
  }, [activeStep.id, formData]);

  const goNext = () => {
    if (!canProceed) return;

    if (activeStep.id === 'name') {
      setGreeting(`Nice to meet you, ${formData.name}.`);
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      console.log('Osita dialogue submission', formData);
      setIsComplete(true);
    }
  };

  return (
    <main className="page">
      <header className="navbar">
        <span className="navbar__brand">
          <span>Osita</span>
        </span>
      </header>

      <motion.section
        className="hero"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      >
        <motion.h1
          className="hero__title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Turning regulation into competitive intelligence.
        </motion.h1>
        <motion.p
          className="hero__paragraph"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Carbon compliance in Europe is becoming a data problem, not a legal one. Importers must reconcile customs
          data, emissions reports, and CBAM certificates across fragmented systems, while ETS price volatility turns
          compliance into a timing challenge.
        </motion.p>
        <motion.p
          className="hero__paragraph"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Today, most teams manage this manually through consultants and spreadsheets. The result is slow verification,
          costly errors, and missed opportunities to optimize procurement.
        </motion.p>
        <motion.p
          className="hero__paragraph"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          The platform integrates emissions data, automates verification, and models certificate purchases in real
          time—turning CBAM compliance from a cost center into a strategic weapon.
        </motion.p>
        <motion.button
          className="hero__cta"
          onClick={openModal}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          Contact
        </motion.button>
      </motion.section>

      <div className="divider" />

      <motion.section
        ref={chartRef}
        className="section chart"
        initial={{ opacity: 0, y: 32 }}
        animate={chartInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="section__header">
          <h3>EU ETS carbon price</h3>
          <p>Spot price per tonne of CO₂e (2015–2024).</p>
        </div>
        <div className="chart__container">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={etsPriceData}>
              <defs>
                <linearGradient id="priceLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#1f3d7a" />
                  <stop offset="100%" stopColor="#911d1d" />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fill: '#4b5565' }} axisLine={{ stroke: '#cbd5f5' }} tickLine={false} />
              <YAxis
                tick={{ fill: '#4b5565' }}
                axisLine={{ stroke: '#cbd5f5' }}
                tickLine={false}
                width={60}
                tickFormatter={(value) => `€${value}`}
              />
              <Tooltip
                formatter={(value: number) => [`€${value.toFixed(0)}`, 'Price']}
                contentStyle={{ borderRadius: 8, borderColor: '#e2e8f0' }}
              />
              <Line type="monotone" dataKey="price" stroke="url(#priceLine)" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.section>

      <motion.section
        ref={timelineRef}
        className="section timeline"
        initial={{ opacity: 0, y: 32 }}
        animate={timelineInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="section__header">
          <h3>ETS & CBAM implementation timeline</h3>
          <p>Key milestones from regulation adoption through full integration.</p>
        </div>
        <div className="timeline__track">
          {timelineEvents.map((event, index) => (
            <motion.div
              key={event.date}
              className="timeline__event"
              initial={{ opacity: 0, y: 12 }}
              animate={timelineInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.05, duration: 0.4 }}
            >
              <div className="timeline__marker" />
              <span className="timeline__date">{event.date}</span>
              <h4>{event.title}</h4>
              <p>{event.detail}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <footer className="footer">
        <span>© 2025 Osita — Forging carbon regulation into competitive inteligience.</span>
        <a href="mailto:hello@osita.co">hello@osita.co</a>
      </footer>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              className="modal"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <button className="modal__close" aria-label="Close dialogue" onClick={closeModal}>
                ×
              </button>

              <div className="modal__progress">
                <span className="modal__greeting">{greeting}</span>
                <small>
                  {isComplete ? 'All steps complete' : `Step ${currentStep + 1} of ${totalSteps}`}
                </small>
                <div className="modal__progress-bar">
                  <span style={{ width: `${displayProgress}%` }} />
                </div>
              </div>

              <AnimatePresence mode="wait">
                {isComplete ? (
                  <motion.div
                    key="complete"
                    className="modal__confirmation"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="modal__icon" aria-hidden>
                      ✓
                    </div>
                    <h3>Thanks, we’ve received your details.</h3>
                    <p>Someone from Osita will reach out shortly to schedule the next conversation.</p>
                    <button className="modal__button modal__button--primary" type="button" onClick={closeModal}>
                      Close
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key={activeStep.id}
                    className="modal__form"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="modal__prompt">{activeStep.question}</p>

                    {activeStep.type === 'text' && (
                      <div>
                        <label htmlFor={activeStep.id}>Response</label>
                        <input
                          id={activeStep.id}
                          type="text"
                          placeholder={activeStep.placeholder}
                          value={formData[activeStep.id]}
                          onChange={(event) =>
                            setFormData((prev) => ({ ...prev, [activeStep.id]: event.target.value }))
                          }
                        />
                      </div>
                    )}

                    {activeStep.type === 'contact' && (
                      <>
                        <div>
                          <label htmlFor="email">Email</label>
                          <input
                            id="email"
                            type="email"
                            placeholder="name@company.com"
                            value={formData.email}
                            onChange={(event) =>
                              setFormData((prev) => ({ ...prev, email: event.target.value }))
                            }
                          />
                        </div>
                        <div>
                          <label htmlFor="industry">Industry</label>
                          <input
                            id="industry"
                            type="text"
                            placeholder="Industry focus"
                            value={formData.industry}
                            onChange={(event) =>
                              setFormData((prev) => ({ ...prev, industry: event.target.value }))
                            }
                          />
                        </div>
                      </>
                    )}

                    {activeStep.type === 'choice' && (
                      <div>
                        <label>Selection</label>
                        <div className="modal__choices">
                          {activeStep.options.map((option) => (
                            <button
                              key={option}
                              type="button"
                              className={`modal__button${formData.focus === option ? ' modal__button--primary' : ''}`}
                              onClick={() => setFormData((prev) => ({ ...prev, focus: option }))}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="modal__actions">
                      <button className="modal__button" type="button" onClick={closeModal}>
                        Cancel
                      </button>
                      <button
                        className="modal__button modal__button--primary"
                        type="button"
                        onClick={goNext}
                        disabled={!canProceed}
                      >
                        {currentStep === totalSteps - 1 ? 'Submit' : 'Next'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
