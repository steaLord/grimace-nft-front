export const media = {
  "992px": (cssInjection: string) =>
    `@media(max-width: 992px) {${cssInjection}};`,
  "1199px": (cssInjection: string) =>
    `@media(max-width: 1199px) {${cssInjection}};`,
};
