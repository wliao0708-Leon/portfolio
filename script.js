(() => {
  'use strict';

  // Keep links to sections of the earlier single-page version working.
  const legacyPages = { '#education': 'education.html', '#experience': 'experience.html', '#projects': 'projects.html', '#contact': 'contact.html' };
  const isHome = /(?:\/|\/index\.html)$/.test(window.location.pathname);
  if (isHome && legacyPages[window.location.hash]) {
    window.location.replace(legacyPages[window.location.hash]);
    return;
  }

  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.nav-toggle');

  function setMenu(open) {
    if (!header || !menuToggle) return;
    header.classList.toggle('menu-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  }

  if (header && menuToggle) {
    menuToggle.addEventListener('click', () => setMenu(!header.classList.contains('menu-open')));
    header.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenu(false));
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && header.classList.contains('menu-open')) {
        setMenu(false);
        menuToggle.focus();
      }
    });
  }

  document.documentElement.classList.add('js-ready');
  const revealElements = document.querySelectorAll('.reveal');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('is-visible'));
  }

  // These case studies are fixed editorial content, never user-supplied HTML.
  const projects = {
    kapt: {
      eyebrow: 'Concept Prototype', title: 'KAPT',
      description: 'Rethinking Prepaid Services in Hong Kong',
      blocks: [
        ['Overview', "Designed and built a web prototype exploring how smart-contract escrow could improve trust in Hong Kong's prepaid fitness and beauty services. The concept links payments to completed visits and explores refunds for unused sessions, balancing consumer protection with merchants' cash-flow needs."],
        ['The Problem', 'Prepaid service packages require customers to pay before receiving the full service. This creates a trust gap: customers need confidence that their remaining balance is protected, while merchants rely on advance payments to support operations.'],
        ['My Contribution', 'I translated the business concept into user journeys and a web prototype using AI-assisted development tools. I assessed technical feasibility, explored smart-contract workflows and refined the interface to make the proposed service understandable to both customers and merchants.'],
        ['Approach', 'KAPT explores an escrow model in which funds are released as services are delivered. The proposed journey covers prepaid purchases, confirmation of completed visits and refund requests for unused sessions. I also explored how service and transaction records could support the assessment of merchant financing.'],
        ['Deliverable & Learning', 'Designing KAPT required me to consider both customer protection and merchant viability. It also highlighted questions around service verification, disputes and refunds that technology alone cannot resolve. The prototype is a concept for demonstration and further development.'],
        ['Prototype limitation', 'KAPT is a concept prototype. It is not a live financial service, does not hold real funds, and does not guarantee refunds, audited smart contracts or approved merchant financing.']
      ], tags: ['Blockchain Concepts', 'Product Design', 'AI-assisted Development'],
      link: {href: 'https://wliao0708-leon.github.io/kapt-prototype/', label: 'Explore Prototype ↗'}
    },
    smartphone: {
      eyebrow: 'Data analytics · Academic group project',
      title: 'Smartphone Market Analysis',
      description: 'Turning product reviews into a clearer picture of brand choice, customer segments and potential retention strategies.',
      blocks: [
        ['The question', 'How might an e-commerce retailer use product reviews to understand its customers and inform retention decisions? The team analysed a public Kaggle dataset containing 50,000 smartphone reviews.'],
        ['The approach', 'The analysis combined Python data preparation and Power BI dashboards with decision tree and KNN brand classification, K-Means segmentation and association rules.'],
        ['The perspective', 'The work suggests possible retention strategies; it does not predict churn directly or establish that the strategies improve retention. Longitudinal customer data would be needed to test their effect.']
      ],
      tags: ['Python', 'Power BI', 'KNN', 'K-Means', 'Decision tree'],
      link: { href: 'assets/smartphone-market-analysis.pdf', label: 'Read the full report ↗' }
    },
    wechat: { eyebrow: 'Contact', title: 'WeChat', description: 'Scan the QR code to connect on WeChat.', blocks: [], tags: [], image: 'assets/wechat.jpg' },
    saf: {
      eyebrow: 'Industry research · ESG',
      title: 'Sustainable Aviation Fuel',
      description: 'A closer look at the forces shaping the sustainable aviation fuel market and its role in aviation decarbonisation.',
      blocks: [
        ['The research', 'Explored the market through policy developments, supply and demand, production pathways and the economics of feedstocks.'],
        ['The perspective', 'The research considers how regulation, technology and access to feedstocks can influence the development of a lower-carbon aviation fuel market.']
      ],
      tags: ['Industry research', 'Policy analysis', 'Feedstock economics'],
      link: { href: 'assets/saf-research.pdf', label: 'Read the full report ↗' }
    }
  };

  const modal = document.querySelector('.modal');
  const modalPanel = document.querySelector('.modal-panel');
  const modalContent = document.querySelector('.modal-content');
  const closeButton = document.querySelector('.modal-close');
  let lastTrigger = null;
  let previousOverflow = '';

  function escapeText(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
  }

  function openProject(name, trigger) {
    const project = projects[name];
    if (!project || !modal || !modalPanel || !modalContent) return;
    const blocks = project.blocks.map(([title, text]) =>
      `<div class="modal-block"><h3>${escapeText(title)}</h3><p>${escapeText(text)}</p></div>`
    ).join('');
    const tags = project.tags.map((tag) => `<span>${escapeText(tag)}</span>`).join('');
    const action = project.link
      ? `<div class="modal-actions"><a class="button button-primary" href="${escapeText(project.link.href)}" target="_blank" rel="noopener noreferrer">${escapeText(project.link.label)}</a></div>`
      : '';
    modalContent.innerHTML = `<p class="modal-eyebrow">${escapeText(project.eyebrow)}</p>
      <h2 class="modal-title" id="project-modal-title">${escapeText(project.title)}</h2>
      <p class="modal-description">${escapeText(project.description)}</p>
      ${blocks}${project.availability ? `<p class="modal-description">${escapeText(project.availability)}</p>` : ''}${project.image ? `<img class="wechat-qr" src="${escapeText(project.image)}" alt="Leon’s WeChat QR code">` : ""}${tags ? `<div class="modal-tags" aria-label="Project topics">${tags}</div>` : ""}${action}`;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'project-modal-title');
    lastTrigger = trigger;
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    modal.hidden = false;
    modalPanel.scrollTop = 0;
    (closeButton || modalPanel).focus();
  }

  function closeProject() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.style.overflow = previousOverflow;
    if (lastTrigger) lastTrigger.focus();
    lastTrigger = null;
  }

  document.querySelectorAll('[data-project]').forEach((button) => {
    button.addEventListener('click', () => openProject(button.dataset.project, button));
  });
  if (modal) {
    if (closeButton) closeButton.addEventListener('click', closeProject);
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeProject();
    });
    modal.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeProject();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = [...modal.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')]
        .filter((element) => !element.hidden && element.getClientRects().length);
      if (!focusable.length) {
        event.preventDefault();
        modalPanel.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !modal.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !modal.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  const records = [
    {company:'Wipro',role:'Data Operations Analyst Intern',location:'Hong Kong',date:'Aug 2026 – Present', bullets:['Improved recurring reporting across 20+ inventory, promotion and master-data spreadsheets through Excel validation and reconciliation checks.','Analysed product and e-commerce sales using PivotTables, XLOOKUP and SUMIFS, and visualised category performance and promotional trends in Power BI.'], more:['Segmented customers and supported transaction-based sales forecasting to inform inventory and commercial planning.'], learned:'I learned that useful commercial analysis depends on reliable underlying data. Working across inventory, promotion and sales records strengthened my ability to connect detailed validation with broader questions about customer behaviour and operational planning.'},
    {company:'Baker Tilly',role:'Financial Advisory Intern',location:'Hong Kong',date:'Jan 2026 – Apr 2026',bullets:['Analysed EBITDA from financial statements and prepared advisory presentations to communicate business performance clearly.','Researched energy storage and biofuels, covering sustainable aviation fuel policies, supply-demand dynamics, production pathways and feedstock economics.'],more:['Researched AML and cryptocurrency regulations, summarising regulatory developments and potential business risks in structured assessment memos.'],learned:'I learned to connect financial performance with industry conditions and regulatory developments. The experience strengthened my ability to synthesise unfamiliar information and communicate the assumptions and business implications behind an analysis.'},
    {company:'SIG Global',role:'Finance & Compliance Intern',location:'Guangzhou',date:'Jan 2025 – Jun 2025',bullets:["Monitored clients' financial year-ends and statutory filing deadlines, following up on supporting documents for annual return submissions to ACRA.",'Reviewed and reconciled individual and corporate income tax records against financial information, identifying discrepancies and maintaining accurate supporting documentation.'],more:['Reviewed onboarding, KYC, and regulatory documentation, following up on missing information to support compliance requirements.'],learned:'I developed a more disciplined approach to documentation, deadlines and follow-up. Working with financial and compliance records showed me how accuracy and clear coordination support reliable reporting and compliance processes.'},
    {company:'GRAND Financial Group',role:'Research & Consulting Intern',location:'Guangzhou',date:'Oct 2024 – Dec 2024',bullets:['Conducted sector research and financial profiling for 15+ companies across multiple industries.','Built M&A valuation models to assess acquisition targets and synergy potential.'],more:['Prepared Hong Kong IPO readiness assessments including regulatory compliance checklists.','Delivered strategic reports to senior management for investment committee review.'],learned:'I learned to organise company and sector information around a clear business question. This strengthened my ability to distinguish evidence from assumptions and communicate research findings in a structured way.'},
    {company:'Grant Thornton China',role:'Audit Intern',location:'Shenzhen',date:'Jun 2023 – Sep 2023',bullets:['Performed internal control testing across multiple client engagements in manufacturing and retail.','Conducted physical inventory counts ensuring accuracy of stock records.'],more:['Issued bank confirmation letters achieving 100% return rate across all engagements.','Prepared audit working papers in compliance with China Audit Standards (CAS).'],learned:'I learned to trace financial information back to supporting evidence and ask questions when records did not align. Audit work strengthened my attention to detail, professional judgement and ability to follow through on outstanding information.'},
    {company:'Hefu Furniture Co., Ltd.',role:'Accounting Intern',location:'China',date:'Oct 2021 – Apr 2022',bullets:['Optimized Kingdee ERP workflows to reduce manual data entry and improve reporting accuracy.','Structured Bill of Materials (BOM) for production planning alignment.'],more:['Performed pre-MRP (Material Requirements Planning) data validation.','Reconciled accounts payable and inventory cost records with production data.'],learned:'I learned how accounting information connects with purchasing, inventory and production. Working with ERP records helped me understand why consistent operational data matters for reliable financial reporting and planning.'}
  ];
  const experienceList = document.querySelector('#experience-list');
  if (experienceList) experienceList.innerHTML = records.map((item) => `<article class="experience-card"><div class="experience-top"><div><h3>${escapeText(item.company)}</h3><p class="experience-role">${escapeText(item.role)}</p><p class="experience-location">${escapeText(item.location)}</p></div><span class="experience-date">${escapeText(item.date)}</span></div><ul class="responsibilities">${[...item.bullets, ...item.more].map((bullet) => `<li>${escapeText(bullet)}</li>`).join('')}</ul><div class="actions"><details class="disclosure"><summary>What I Learned</summary><div class="disclosure-content"><p>${escapeText(item.learned)}</p></div></details></div></article>`).join('');
  const courses = {
    'polyu-coursework':['Management Information Systems','Business Analytics','Business Intelligence and Decisions','Business Forecasting','Business Applications of Blockchain','Managing Operations Systems','Applications of Decision Making Models'],
    'birmingham-coursework':['Financial Reporting','Management Accounting','Financial Accounting','Business Analytics','Audit','Taxation: Principles and Planning','International Taxation','Business Law','Corporate Finance','International Financial Reporting Standards (IFRS)']
  };
  Object.entries(courses).forEach(([id, names]) => { const node = document.getElementById(id); if (node) node.innerHTML = `<ul>${names.map((name) => `<li>${escapeText(name)}</li>`).join('')}</ul>`; });

  const copyEmail = document.querySelector('[data-copy-email]');
  const toast = document.querySelector('.toast');
  let toastTimer;
  if (copyEmail) {
    copyEmail.addEventListener('click', async () => {
      try {
        if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText('wliao0708@gmail.com');
        if (toast) {
          toast.textContent = 'Email address copied';
          toast.classList.add('is-visible');
          clearTimeout(toastTimer);
          toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2500);
        }
      } catch (_) {
        window.location.href = 'mailto:wliao0708@gmail.com';
      }
    });
  }
})();
