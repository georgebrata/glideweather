import { FEEDBACK_FORM_SRC, FEEDBACK_PAGE } from "@/app/content/feedback";
import { contentLocaleDefinition } from "../../../content-locales";
import { ContentPageShell } from "./ContentPageShell";
import type { ContentLocale } from "@/app/seo/types";
import { pathForRoute } from "@/app/seo/routes";

export const FeedbackPageView = ({ locale }: { locale: ContentLocale }) => {
  const copy = FEEDBACK_PAGE[contentLocaleDefinition(locale).copy];
  const path = pathForRoute("feedback", locale);

  return (
    <ContentPageShell locale={locale} currentPath={path}>
      <article className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
        <h1 className="text-4xl font-semibold tracking-tight">{copy.heading}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{copy.lead}</p>
        <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--border-flight)] bg-card">
          <iframe
            title={copy.frameTitle}
            src={FEEDBACK_FORM_SRC}
            className="h-[1796px] w-full"
            loading="lazy"
          >
            {copy.heading}
          </iframe>
        </div>
      </article>
    </ContentPageShell>
  );
};
