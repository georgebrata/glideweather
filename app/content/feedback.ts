import type { CopyLocale } from "../../content-locales";

export const FEEDBACK_FORM_SRC =
  "https://docs.google.com/forms/d/e/1FAIpQLSerJUl4dyr7_zDVMk7bCJ8YJPC3DfqHkRB2BH6bJxjgi59MGA/viewform?embedded=true";

export const FEEDBACK_SLUGS: Record<CopyLocale, string> = {
  en: "feedback",
  ro: "pareri",
  de: "rueckmeldung",
  it: "feedback",
  es: "comentarios",
  pt: "feedback",
  cs: "zpetna-vazba",
  sk: "spatna-vazba",
  sl: "odziv",
  nl: "feedback",
  mt: "feedback",
  tr: "geri-bildirim",
  hr: "povratne-informacije",
  sr: "povratne-informacije",
  sq: "reagim",
};

export const FEEDBACK_SEO: Record<CopyLocale, { title: string; description: string }> = {
  en: {
    title: "Feedback | GlideWeather",
    description: "Send feedback about GlideWeather: what helps, what is missing, and what should change.",
  },
  ro: {
    title: "Păreri | GlideWeather",
    description: "Trimite păreri despre GlideWeather: ce ajută, ce lipsește și ce ar trebui schimbat.",
  },
  de: {
    title: "Rückmeldung | GlideWeather",
    description: "Schick Rückmeldung zu GlideWeather: was hilft, was fehlt und was sich ändern sollte.",
  },
  it: {
    title: "Feedback | GlideWeather",
    description: "Invia un feedback su GlideWeather: cosa aiuta, cosa manca e cosa andrebbe cambiato.",
  },
  es: {
    title: "Comentarios | GlideWeather",
    description: "Envía comentarios sobre GlideWeather: qué ayuda, qué falta y qué debería cambiar.",
  },
  pt: {
    title: "Feedback | GlideWeather",
    description: "Envia feedback sobre o GlideWeather: o que ajuda, o que falta e o que deve mudar.",
  },
  cs: {
    title: "Zpětná vazba | GlideWeather",
    description: "Pošli zpětnou vazbu ke GlideWeather: co pomáhá, co chybí a co by se mělo změnit.",
  },
  sk: {
    title: "Spätná väzba | GlideWeather",
    description: "Pošli spätnú väzbu ku GlideWeather: čo pomáha, čo chýba a čo by sa malo zmeniť.",
  },
  sl: {
    title: "Odziv | GlideWeather",
    description: "Pošlji odziv o GlideWeather: kaj pomaga, kaj manjka in kaj bi se moralo spremeniti.",
  },
  nl: {
    title: "Feedback | GlideWeather",
    description: "Stuur feedback over GlideWeather: wat helpt, wat ontbreekt en wat moet veranderen.",
  },
  mt: {
    title: "Feedback | GlideWeather",
    description: "Ibgħat feedback dwar GlideWeather: x’jgħin, x’jonqos u x’għandu jinbidel.",
  },
  tr: {
    title: "Geri bildirim | GlideWeather",
    description: "GlideWeather hakkında geri bildirim gönder: ne işe yarıyor, ne eksik ve ne değişmeli.",
  },
  hr: {
    title: "Povratne informacije | GlideWeather",
    description: "Pošalji povratne informacije o GlideWeatheru: što pomaže, što nedostaje i što treba promijeniti.",
  },
  sr: {
    title: "Povratne informacije | GlideWeather",
    description: "Pošalji povratne informacije o GlideWeather-u: šta pomaže, šta nedostaje i šta treba promeniti.",
  },
  sq: {
    title: "Reagim | GlideWeather",
    description: "Dërgo reagim për GlideWeather: çfarë ndihmon, çfarë mungon dhe çfarë duhet ndryshuar.",
  },
};

export const FEEDBACK_PAGE: Record<CopyLocale, { heading: string; lead: string; frameTitle: string; nav: string }> = {
  en: {
    nav: "Feedback",
    heading: "Feedback",
    lead: "Tell us what helps, what is missing, and what should change. This form is the same in every language.",
    frameTitle: "GlideWeather feedback form",
  },
  ro: {
    nav: "Păreri",
    heading: "Păreri",
    lead: "Spune-ne ce ajută, ce lipsește și ce ar trebui schimbat. Formularul este același în toate limbile.",
    frameTitle: "Formular de păreri GlideWeather",
  },
  de: {
    nav: "Rückmeldung",
    heading: "Rückmeldung",
    lead: "Sag uns, was hilft, was fehlt und was sich ändern sollte. Das Formular ist in allen Sprachen dasselbe.",
    frameTitle: "GlideWeather-Rückmeldeformular",
  },
  it: {
    nav: "Feedback",
    heading: "Feedback",
    lead: "Dicci cosa aiuta, cosa manca e cosa andrebbe cambiato. Il modulo è lo stesso in tutte le lingue.",
    frameTitle: "Modulo di feedback GlideWeather",
  },
  es: {
    nav: "Comentarios",
    heading: "Comentarios",
    lead: "Cuéntanos qué ayuda, qué falta y qué debería cambiar. El formulario es el mismo en todos los idiomas.",
    frameTitle: "Formulario de comentarios de GlideWeather",
  },
  pt: {
    nav: "Feedback",
    heading: "Feedback",
    lead: "Diz-nos o que ajuda, o que falta e o que deve mudar. O formulário é o mesmo em todas as línguas.",
    frameTitle: "Formulário de feedback do GlideWeather",
  },
  cs: {
    nav: "Zpětná vazba",
    heading: "Zpětná vazba",
    lead: "Napiš, co pomáhá, co chybí a co by se mělo změnit. Formulář je ve všech jazycích stejný.",
    frameTitle: "Formulář zpětné vazby GlideWeather",
  },
  sk: {
    nav: "Spätná väzba",
    heading: "Spätná väzba",
    lead: "Napíš, čo pomáha, čo chýba a čo by sa malo zmeniť. Formulár je vo všetkých jazykoch rovnaký.",
    frameTitle: "Formulár spätnej väzby GlideWeather",
  },
  sl: {
    nav: "Odziv",
    heading: "Odziv",
    lead: "Povej, kaj pomaga, kaj manjka in kaj bi se moralo spremeniti. Obrazec je v vseh jezikih enak.",
    frameTitle: "Obrazec za odziv GlideWeather",
  },
  nl: {
    nav: "Feedback",
    heading: "Feedback",
    lead: "Vertel wat helpt, wat ontbreekt en wat moet veranderen. Het formulier is in elke taal hetzelfde.",
    frameTitle: "GlideWeather-feedbackformulier",
  },
  mt: {
    nav: "Feedback",
    heading: "Feedback",
    lead: "Għidilna x’jgħin, x’jonqos u x’għandu jinbidel. Il-formola hija l-istess f’kull lingwa.",
    frameTitle: "Formola ta’ feedback ta’ GlideWeather",
  },
  tr: {
    nav: "Geri bildirim",
    heading: "Geri bildirim",
    lead: "Ne işe yarıyor, ne eksik ve ne değişmeli, yaz. Form tüm dillerde aynıdır.",
    frameTitle: "GlideWeather geri bildirim formu",
  },
  hr: {
    nav: "Povratne informacije",
    heading: "Povratne informacije",
    lead: "Reci što pomaže, što nedostaje i što treba promijeniti. Obrazac je isti na svim jezicima.",
    frameTitle: "Obrazac povratnih informacija GlideWeather",
  },
  sr: {
    nav: "Povratne informacije",
    heading: "Povratne informacije",
    lead: "Reci šta pomaže, šta nedostaje i šta treba promeniti. Obrazac je isti na svim jezicima.",
    frameTitle: "Obrazac povratnih informacija GlideWeather",
  },
  sq: {
    nav: "Reagim",
    heading: "Reagim",
    lead: "Na trego çfarë ndihmon, çfarë mungon dhe çfarë duhet ndryshuar. Formulari është i njëjtë në çdo gjuhë.",
    frameTitle: "Formulari i reagimit të GlideWeather",
  },
};
